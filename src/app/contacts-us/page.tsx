"use client";
import React, { useRef, FormEvent } from "react";
import { submitFeedback } from "@/utils/api/feedbackApi";
import { Box, TextField, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LoadingButton from "@mui/lab/LoadingButton";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

import "./ContactsUs.css";
import { toast } from "sonner";

const ContactsUs: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const name = formData.get("from_name") as string;
      const email = formData.get("from_email") as string;
      const message = formData.get("message") as string;

      try {
        await submitFeedback({
          name,
          email,
          message,
          is_agreed: true,
        });
        toast.success("Ваше сообщение успешно отправлено!");
        formRef.current.reset();
      } catch (error: any) {
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
    <div>
      <div className="contacts-background" />
      <div className="contacts">
        <div className="contacts-container">
          <div className="contacts-header">
            <Typography variant="h2">КОНТАКТЫ</Typography>
            <Typography variant="h6">Напишите нам на эту электронную почту, и мы постараемся ответить вам в течение дня.</Typography>
          </div>
          <div className="contacts-info">
            <div className="contacts-blocks">
              <EmailIcon sx={{ fontSize: "60px" }} />
              <Typography variant="h4">Почта</Typography>
              <Typography variant="h6">grandhill.contact@gmail.com</Typography>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <LocalPhoneIcon fontSize="large" />
                  <WhatsAppIcon fontSize="large" />
                </Box>
                <Typography sx={{ color: "white !important" }} variant="h6" component="a" href="tel:+79651167437">
                  +7 (965) 116-74-37
                </Typography>
              </Box>
            </div>
          </div>
        </div>
      </div>
      <div className="contacts-form">
        <form ref={formRef} onSubmit={sendEmail} className="contacts-form-inputs">
          <Typography variant="h4" sx={{ color: "#01041e" }}>
            Хотите связаться с нами?
          </Typography>
          <Typography variant="h5">Пожалуйста, воспользуйтесь приведенной ниже формой.</Typography>
          <Typography variant="h5">Все поля обязательны для заполнения.</Typography>
          <div className="contacts-form-inputs-inner">
            <Typography sx={{ marginTop: "30px" }} variant="h6">
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
              placeholder="Ваша почта"
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
              loading={submitting}
            >
              Отправить
            </LoadingButton>
          </div>
        </form>
        <div className="contacts-form-img">
          <img src="/assets/aboutus/contactsUs_2.jpg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default ContactsUs;
