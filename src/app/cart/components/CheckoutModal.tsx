"use client";
import React, { useRef } from "react";
import { submitCheckout } from "@/utils/api/checkoutApi";
import { Box, TextField, Typography, Modal } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "sonner";
import { CartItem, clearCart } from "@/utils/LocalStorage/cartStorage";

interface CheckoutModalProps {
  open: boolean;
  handleClose: () => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, handleClose, cart, setCart }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Формируем строку с данными заказа для отправки
  const orderDetails = cart.map((item) => `${item.title} - ${item.quantity} шт. - ${item.price * item.quantity}₽`).join("\n");
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const name = formData.get("from_name") as string;
      const phone = formData.get("phone_number") as string;
      const email = formData.get("from_email") as string;
      const address = formData.get("city") as string;

      const items = cart.map((item) => ({
        product: item.id,
        size: item.size_id,
        quantity: item.quantity,
      }));

      const payload = {
        name,
        phone,
        email,
        address,
        is_agreed: true,
        items,
      };

      try {
        await submitCheckout(payload);
        toast.success("Ваш заказ успешно оформлен!");
        clearCart(); // Очищаем корзину
        setCart([]); // Обновляем состояние корзины
        handleClose(); // Закрываем модалку
        formRef.current.reset();
      } catch (error: any) {
        if (error?.status === 400 && error.data?.detail) {
          toast.error(error.data.detail);
        } else if (error?.status === 429) {
          toast.error("Слишком много запросов. Попробуйте позже.");
        } else {
          toast.error("Ошибка при оформлении заказа.");
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box
        sx={{
          background: "white",
          padding: { xs: "20px", sm: "50px" },
          display: "flex",
          flexDirection: "column",
          maxWidth: 700,
          width: "100%",
          margin: "50px auto",
          borderRadius: 2,
        }}
        className="contacts-form"
      >
        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <Typography onClick={handleClose} variant="h6" sx={{ fontWeight: "bold", cursor: "pointer", color: "#01041e" }}>
            Закрыть
          </Typography>
        </Box>
        <Box component={"form"} sx={{ display: "flex", flexDirection: "column", width: "100%" }} ref={formRef} onSubmit={sendEmail}>
          <Typography variant="h4" sx={{ color: "#01041e", mb: 2 }}>
            Оформление заказа
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Заполните данные ниже, чтобы завершить заказ.
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Имя
          </Typography>
          <TextField
            required
            name="from_name"
            type="text"
            color="secondary"
            variant="outlined"
            placeholder="Ваше имя"
            fullWidth
            InputProps={{ style: { fontSize: "20px" } }}
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Номер телефона
          </Typography>
          <TextField
            required
            name="phone_number"
            type="tel"
            color="secondary"
            variant="outlined"
            placeholder="+7 (___) ___-__-__"
            fullWidth
            InputProps={{ style: { fontSize: "20px" } }}
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Почта
          </Typography>
          <TextField
            required
            name="from_email"
            type="email"
            color="secondary"
            variant="outlined"
            placeholder="example@email.com"
            fullWidth
            InputProps={{ style: { fontSize: "20px" } }}
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Город
          </Typography>
          <TextField
            required
            name="city"
            type="text"
            color="secondary"
            variant="outlined"
            placeholder="Ваш город"
            fullWidth
            InputProps={{ style: { fontSize: "20px" } }}
          />

          <LoadingButton
            sx={{
              mt: 3,
              height: "50px",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
            className="main-button"
            type="submit"
            loading={submitting}
            disabled={submitting}
          >
            Подтвердить заказ
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default CheckoutModal;
