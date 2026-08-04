"use client";
import React, { useEffect } from "react";

import { Box, Button, Typography } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";

import "./HomePage.css";

import { useRouter } from "next/navigation";
import { Slider } from "@/components";

const HomePage = () => {
	const router = useRouter();

	const settings = {
		className: "center",
		centerMode: true,
		infinite: true,
		focusOnSelect: true,
		dots: false,
		centerPadding: "60px",
		slidesToShow: 3,
		speed: 500,
		arrows: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	const handleClickNavigate = (path: string) => () => {
		router.push(path);
	};

	useEffect(() => {
		AOS.init();
		AOS.refresh();
	}, []);

	return (
		<Box>
			<Box className="sliders">
				<Slider>
					<Box>
						<Box className="slide-1">
							{/* <img alt="Background" src="/assets/HomePage/img1.jpg" /> */}
							<video autoPlay loop muted playsInline className="video-background">
								<source src="/assets/HomePage/video-banner-2.mp4" type="video/mp4" />
								Your browser does not support the video tag.
							</video>
							<Box className="slide-1-overlay">
								<Box data-aos="fade-center" data-aos-offset="200" data-aos-duration="500" className="slide-1-inner">
									<Typography variant="h3">Новая коллекция</Typography>
									<Typography variant="h5">Весна - лето</Typography>
									<Button className="main-button" onClick={handleClickNavigate("/collections/spring-summer")} variant="outlined" color="inherit">
										Узнать больше
									</Button>
								</Box>
							</Box>
						</Box>
					</Box>
					<Box>
						<Box className="slide-2">
							<img alt="background-2" src="/assets/HomePage/img2.jpg" />
							<Box className="slide-2-overlay">
								<Box className="slide-2-inner">
									<Typography variant="h3">Новая коллекция</Typography>
									<Typography variant="h5">Весна - лето</Typography>
									<Button onClick={handleClickNavigate("/collections/spring-summer")} className="main-button" variant="outlined" color="inherit">
										Узнать больше
									</Button>
								</Box>
							</Box>
						</Box>
					</Box>
				</Slider>
			</Box>

			<Box>
				<Box className="slide-1-inner-adaptive">
					<Box className="slide-1-inner-adaptive-box">
						<Typography variant="h3">Новая коллекция</Typography>
						<Typography variant="h5">Весна - лето</Typography>
						<Typography variant="h4">Стилевые рамки</Typography>
						<Button className="main-button" onClick={handleClickNavigate("/collections/spring-summer2")} variant="outlined" color="inherit">
							Узнать больше
						</Button>
					</Box>
				</Box>
				<Box className="txt-block1">
					<Box className="txt-block-inner">
						<Typography variant="h4">НАЙДИТЕ СВОЙ ИДЕАЛЬНЫЙ ОБРАЗ</Typography>
						<Typography variant="h6">
							Вот уже более 40 лет мы одеваем наших клиентов в повседневные и свадебные костюмы, созданные для того, чтобы их можно было отличить.
							Посетите наш широкий выбор изысканных мужских костюмов и выглядите лучше всех на каждом
						</Typography>
					</Box>
				</Box>
				<Box className="img-wrapper-container">
					<Box className="img-wrapper">
						<img className="inner-img" src="/assets/HomePage/men2.jpg" alt="inner-img" />
						<div className="middle" onClick={handleClickNavigate("/suits/everyday")}>
							<Button className="main-button">Узнать больше</Button>
						</div>
					</Box>
					<Box className="img-wrapper">
						<img className="inner-img" src="/assets/HomePage/men3.jpg" alt="inner-img" />
						<div className="middle" onClick={handleClickNavigate("/suits/suit-trio/")}>
							<Button className="main-button">Узнать больше</Button>
						</div>
					</Box>
					<Box className="img-wrapper">
						<img className="inner-img" src="/assets/HomePage/men4.jpeg" alt="inner-img" />
						<div className="middle" onClick={handleClickNavigate("/suits/suit")}>
							<Button className="main-button">Узнать больше</Button>
						</div>
					</Box>
				</Box>

				{/* ------------------------------- */}

				<Box className="img-txt-block1">
					<Box className="img-txt-mobile">
						<Typography variant="h4">Превосходное качество</Typography>
					</Box>
					<Box className="img-txt-inner visable">
						<Typography variant="h4">Превосходное качество</Typography>
						<Typography>
							Фабрика классических мужских костюмов выпускает коллекции несколько раз в год. Мы предлагаем широкий ассортимент моделей. Если вы ищете
							надежных поставщиков мужской одежды, мы будем рады обсудить условия сотрудничества.
						</Typography>
						<Typography>
							Наше производство мужской одежды обладает всеми современными технологиями для пошива высококачественных мужских костюмов. Все изделия
							имеют отличный состав ткани и представлены только в актуальных оттенках.
						</Typography>
					</Box>

					<Box>
						<img src="/assets/HomePage/img3.jpg" alt="" />
					</Box>
					<Box className="img-txt-mobile">
						<Typography>
							{" "}
							Фабрика классических мужских костюмов выпускает коллекции несколько раз в год. Мы предлагаем широкий ассортимент моделей. Если вы ищете
							надежных поставщиков мужской одежды, мы будем рады обсудить условия сотрудничества.
						</Typography>
						<Typography>
							Наше производство мужской одежды обладает всеми современными технологиями для пошива высококачественных мужских костюмов. Все изделия
							имеют отличный состав ткани и представлены только в актуальных оттенках.
						</Typography>
					</Box>
				</Box>

				<Box className="img-txt-block1">
					<Box>
						<img src="/assets/HomePage/img4.jpg" alt="" />
					</Box>
					<Box className="img-txt-inner">
						<Typography variant="h4">Новые модели</Typography>
						<Typography>
							Мы, как производители мужских классических костюмов, заинтересованы в том, чтобы в вашем магазине были представлены только самые
							современные модели.
						</Typography>
						<Typography>
							В производстве мы используем самые современные технологии и машины, что позволяет нам быть конкурентоспособными на рынке. Мы
							зарекомендовали себя как надежный поставщик высококачественной продукции.
						</Typography>
					</Box>
				</Box>
				<div>
					<Slider {...settings}>
						<div className="slide-padding">
							<img width="100%" src="/assets/HomePage/carousel-img_1.jpg" alt="" />
						</div>
						<div className="slide-padding">
							<img width="100%" src="/assets/HomePage/carousel-img_2.jpg" alt="" />
						</div>
						<div className="slide-padding">
							<img width="100%" src="/assets/HomePage/carousel-img_3.jpg" alt="" />
						</div>
						<div className="slide-padding">
							<img width="100%" src="/assets/HomePage/carousel-img_4.jpg" alt="" />
						</div>

						<div className="slide-padding">
							<img width="100%" src="/assets/HomePage/carousel-img_5.jpg" alt="" />
						</div>
					</Slider>
				</div>

				{/* ----------------------------------- */}

				{/* History us start */}
				<Box className="history-block">
					<Box className="history-block-box1">
						<Box className="history-text1">
							<Box data-aos="fade-right" className="history-text1-inner">
								<Typography variant="h4">ИСТОРИЯ БРЕНДА</Typography>
								<Typography variant="h6">
									Можете ли вы представить, что старая швейная машинка может творить чудеса? Так вот, вы должны в это поверить! При таких
									обстоятельствах родился Norvell. Время шло, фабрика начала постепенно расширяться. Производственные мощности были оснащены
									современным и высокотехнологичным оборудованием, позволяющим улучшать качество продукции, поддерживать высокую конкурентоспособность
									и создавать модели, отвечающие последним модным тенденциям.
								</Typography>
							</Box>
						</Box>
						<Box className="history-img">
							<Box data-aos="fade-left" data-aos-offset="200" data-aos-duration="500" className="history-img-title">
								<Typography variant="h3">Наша история</Typography>
							</Box>
							<Box data-aos="fade-left" data-aos-offset="200" data-aos-duration="500">
								<img src="/assets/HomePage/heritage.jpg" alt="" />
							</Box>
						</Box>
					</Box>
					<Box className="history-text2">
						<Box data-aos="fade-right" data-aos-offset="200" data-aos-duration="500" className="history-text2-container">
							<Box className="history-text2-inner" data-aos="fade-right" data-aos-offset="200" data-aos-duration="500">
								<Typography variant="h4">Norvell</Typography>
								<Typography variant="h6">
									Он начал свой путь еще в 1979 году. Norvell стремится вывести на рынок мужской одежды высококачественную продукцию, чтобы люди,
									надевающие костюм или пальто, чувствовали себя уверенно и комфортно.
								</Typography>
								<Button onClick={handleClickNavigate("about-us")} sx={{ borderRadius: 0 }} variant="outlined" className="bespoke-btn">
									Узнать больше
								</Button>
							</Box>
						</Box>
					</Box>
				</Box>
				{/* History us end */}
				<Box className="txt-block2">
					<Box className="txt-block-inner">
						<Typography variant="h3">Наши достижения</Typography>
						<Typography variant="h6">Отзывы</Typography>
					</Box>
				</Box>
				{/* <Box className="img-block">
          <Box className="img-block-inner">
            <Typography variant="subtitle2">
              Free shipping, Discount applied in cart
            </Typography>
            <Button className="button-white">hover me!</Button>
          </Box>
        </Box> */}

				{/* info us start */}
				<Box className="info-us">
					<Box data-aos="fade-left" data-aos-offset="200" data-aos-duration="500" className="info-us-blocks">
						<img className="info-usImg1" src="/assets/HomePage/icon1.png" alt="" />
						<Box>
							<Typography className="h4-txt1" variant="h5">
								БОЛЕЕ 5.000 КОСТЮМОВ В НАЛИЧИИ
							</Typography>
						</Box>
					</Box>
					<Box data-aos="zoom-in" data-aos-offset="200" data-aos-duration="500" className="info-us-blocks">
						<img className="info-usImg1" src="/assets/HomePage/img6.svg" alt="" />
						<Box>
							<Typography variant="h5">5-ЗВЕЗДОЧНЫЙ РЕЙТИНГ GOOGLE</Typography>
						</Box>
					</Box>
					<Box data-aos="fade-right" data-aos-offset="200" data-aos-duration="500" className="info-us-blocks">
						<img className="info-usImg1" src="/assets/HomePage/icon2.png" alt="" />
						<Box>
							<Typography variant="h5">БОЛЕЕ 40 ЛЕТ В БИЗНЕСЕ</Typography>
						</Box>
					</Box>
				</Box>
				{/* Info us end */}

				{/* ── Bespoke / Custom Tailoring Block ── */}
				<Box className="bespoke-block">
					<Box data-aos="fade-right" data-aos-duration="800" className="bespoke-content">
						<Typography variant="h3">ИНДИВИДУАЛЬНЫЙ ПОШИВ</Typography>
						<Typography variant="body1">
							Создайте костюм, который идеально отражает вашу индивидуальность. Наши опытные портные учтут каждую деталь, от выбора премиальной ткани
							до финальной строчки, чтобы обеспечить безупречную посадку.
						</Typography>
						<Button onClick={handleClickNavigate("contacts-us")} variant="outlined" sx={{ borderRadius: 0 }} className="bespoke-btn">
							ЗАПИСАТЬСЯ НА ПРИМЕРКУ
						</Button>
					</Box>
					<Box data-aos="fade-left" data-aos-duration="800" className="bespoke-image"></Box>
				</Box>

				{/* ── Newsletter / VIP Club Block ── */}
				<Box className="vip-club-block" data-aos="zoom-in" data-aos-duration="1000">
					<Box className="vip-club-overlay">
						<Typography variant="h3" sx={{ mb: 2, letterSpacing: "2px" }}>
							ПРИВИЛЕГИИ NORVELL CLUB
						</Typography>
						<Typography variant="body1" sx={{ maxWidth: "600px", margin: "0 auto", mb: 4, opacity: 0.9, fontSize: "1.1rem" }}>
							Присоединяйтесь к закрытому клубу клиентов. Получайте ранний доступ к новым коллекциям, приглашения на закрытые мероприятия и
							персональные предложения.
						</Typography>
						<Button variant="contained" className="vip-btn" sx={{ borderRadius: 0 }} onClick={handleClickNavigate("about-us")}>
							ВСТУПИТЬ В КЛУБ
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default HomePage;
