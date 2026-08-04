"use client";
import React, { useRef } from "react";
import { submitFeedback } from "@/utils/api/feedbackApi";

import { Box, Button, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";

import "../../app/contacts-us/ContactsUs.css";
import { toast } from "sonner";

const MyModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formRef = useRef();
  const [submitting, setSubmitting] = React.useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const name = formData.get("from_name");
      const email = formData.get("from_email");
      const message = formData.get("message");

      try {
        await submitFeedback({
          name,
          email,
          message,
          is_agreed: true,
        });
        toast.success("Ваше сообщение успешно отправлено!");
        formRef.current.reset();
        handleClose();
      } catch (error) {
        if (error?.status === 400 && error.data?.is_agreed) {
          toast.error(error.data.is_agreed[0]);
        } else if (error?.status === 429) {
          toast.error("Слишком много запросов. Попробуйте позже.");
        } else {
          toast.error("Ошибка при отправке сообщения.");
        }
      } finally {
        setSubmitting(false);
      }
    }
  };
  return (
    <Box>
      <Button onClick={handleOpen} sx={{ marginTop: "10px" }} className="main-button">
        Наши контакты
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            background: "white",
            padding: "50px",
            display: "flex",
            flexDirection: "column",
          }}
          className="contacts-form"
        >
          <Box sx={{ width: "100%", display: " flex", justifyContent: "flex-end" }}>
            <Typography
              onClick={handleClose}
              variant="h6"
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Закрыть
            </Typography>
          </Box>
          <form ref={formRef} onSubmit={sendEmail} className="contacts-form-inputs">
            <Typography variant="h4" sx={{ color: "#01041e" }}>
              Хотите связаться с нами?
            </Typography>
            <Typography variant="h5">Пожалуйста, воспользуйтесь формой ниже. </Typography>
            <Typography variant="h5">Все поля обязательны для заполнения.</Typography>
            <div className="contacts-form-inputs-inner">
              <Typography sx={{ marginTop: "40px" }} variant="h6">
                Имя
              </Typography>
              <TextField
                required
                name="from_name"
                type="text"
                color="secondary"
                variant="outlined"
                placeholder="Имя"
                InputProps={{
                  style: {
                    fontSize: "25px",
                  },
                }}
              />
              <Typography sx={{ marginTop: "20px" }} variant="h6">
                Почта
              </Typography>
              <TextField
                required
                name="from_email"
                color="secondary"
                variant="outlined"
                placeholder="Почта"
                type="email"
                InputProps={{
                  style: {
                    fontSize: "25px",
                  },
                }}
              />
              <Typography sx={{ marginTop: "20px" }} variant="h6">
                Сообщение
              </Typography>
              <TextField required multiline name="message" rows={4} color="secondary" variant="outlined" placeholder="Ваше сообщение" />

              <LoadingButton
                sx={{
                  marginTop: "20px",
                  height: "50px",
                  textTransform: "uppercase",
                }}
                className="main-button"
                type="submit"
                value="Send Message"
                loading={submitting}
              >
                Отправить
              </LoadingButton>
            </div>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default MyModal;
