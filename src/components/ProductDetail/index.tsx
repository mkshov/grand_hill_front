"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Button, Modal, Typography, IconButton, CircularProgress, styled, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Drawer, MyAccordion, ProductInfo, Recommended } from "@/components";
import { useParams } from "next/navigation";
import { fetchProductById, fetchProductSizes, ApiProduct, ApiSizeGrid } from "@/utils/api/productsApi";
import { addToCart, getCart, updateCartItemQuantity } from "@/utils/LocalStorage/cartStorage";
import "@/app/suits/products.css";

const THUMBS_VISIBLE = 5;

const ProductDetail: React.FC = () => {
	const params = useParams();
	const id = params?.id;
	const productIdRaw = Array.isArray(id) ? id[0] : id;
	const productId = productIdRaw ? parseInt(productIdRaw, 10) : undefined;

	const [product, setProduct] = useState<ApiProduct | null>(null);
	const [sizesData, setSizesData] = useState<ApiSizeGrid | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cart, setCart] = useState<any[]>([]);
	const [currentIdx, setCurrentIdx] = useState(0);
	const [thumbOffset, setThumbOffset] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedHeight, setSelectedHeight] = useState<string | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const touchStartX = useRef<number | null>(null);

	useEffect(() => {
		if (!productId) return;
		Promise.all([fetchProductById(productId), fetchProductSizes(productId).catch(() => null)])
			.then(([data, sizes]) => {
				setProduct(data);
				if (sizes) setSizesData(sizes);
			})
			.catch(() => setError("Товар не найден"))
			.finally(() => setLoading(false));
	}, [productId]);

	useEffect(() => {
		setCart(getCart());
		const handleCartUpdate = () => setCart(getCart());
		window.addEventListener("cartUpdated", handleCartUpdate);
		window.addEventListener("storage", handleCartUpdate);
		return () => {
			window.removeEventListener("cartUpdated", handleCartUpdate);
			window.removeEventListener("storage", handleCartUpdate);
		};
	}, []);

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<CircularProgress color="secondary" />
			</Box>
		);
	}
	if (error || !product) {
		return <div style={{ textAlign: "center", padding: "60px" }}>{error || "Товар не найден"}</div>;
	}

	const allImages = [...product.images].sort((a, b) => (a.position ?? 99) - (b.position ?? 99)).map((img) => img.image_l || img.image_m || img.image);

	const maxOffset = Math.max(0, allImages.length - THUMBS_VISIBLE);

	const goTo = (idx: number) => {
		const next = (idx + allImages.length) % allImages.length;
		setCurrentIdx(next);
		if (next < thumbOffset) setThumbOffset(next);
		else if (next >= thumbOffset + THUMBS_VISIBLE) setThumbOffset(next - THUMBS_VISIBLE + 1);
	};

	const shiftThumbs = (dir: number) => {
		setThumbOffset((prev) => Math.max(0, Math.min(maxOffset, prev + dir)));
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const delta = touchStartX.current - e.changedTouches[0].clientX;
		if (Math.abs(delta) > 40) goTo(currentIdx + (delta > 0 ? 1 : -1));
		touchStartX.current = null;
	};

	const finalPrice = parseFloat(product.final_price);
	const originalPrice = parseFloat(product.price);
	const hasDiscount = product.is_discount && finalPrice < originalPrice;

	const hasSizes = sizesData && sizesData.availability.length > 0;
	let currentCartItemId = product ? product.id.toString() : "";
	if (product && hasSizes) {
		if (selectedSize && selectedHeight) {
			currentCartItemId = `${product.id}-${selectedSize}-${selectedHeight}`;
		} else {
			currentCartItemId = ""; // Need selection
		}
	}
	const cartItem = currentCartItemId ? cart.find(item => (item.cartItemId || item.id.toString()) === currentCartItemId) : null;
	const currentQuantity = cartItem ? cartItem.quantity : 0;

	const handleAddToCart = () => {
		if (!product) return;

		if (hasSizes && (!selectedSize || !selectedHeight)) {
			setSnackbarOpen(true);
			return;
		}

		const mainImg = product.images.find((img) => img.is_main);
		const targetCartItemId = hasSizes ? `${product.id}-${selectedSize}-${selectedHeight}` : product.id.toString();

		let size_id: number | undefined;
		if (hasSizes && sizesData) {
			const sizeName = selectedHeight ? `${selectedSize}/${selectedHeight}` : selectedSize;
			const matchedSize = sizesData.availability.find(a => a.size_name === sizeName);
			if (matchedSize) {
				size_id = matchedSize.size_id;
			}
		}

		addToCart({
			cartItemId: targetCartItemId,
			id: product.id,
			title: `${product.name} ${product.model}`,
			price: Math.round(finalPrice),
			image: mainImg?.image_m || mainImg?.image || "",
			quantity: 1,
			size: selectedSize,
			height: selectedHeight,
			size_id: size_id,
		});
	};

	const handleChangeQuantity = (newQuantity: number) => {
		if (!product || !currentCartItemId) return;
		if (newQuantity < 1) return; // Prevent removing from cart here

		updateCartItemQuantity(currentCartItemId, newQuantity);
	};

	const visibleThumbs = allImages.slice(thumbOffset, thumbOffset + THUMBS_VISIBLE);

	return (
		<div className="product" style={{ marginTop: "20px" }}>
			<div className="product-container">
				{/* ── Gallery Column ── */}
				<GalleryCol>
					{/* Main image */}
					<MainImgBox onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onClick={() => setOpenModal(true)}>
						<img src={allImages[currentIdx]} alt={`${product.name} ${product.model}`} onError={(e) => (e.currentTarget.src = "/placeholder.jpg")} />

						{/* Nav arrows */}
						{allImages.length > 1 && (
							<>
								<NavBtn
									className="nav-btn"
									$side="left"
									onClick={(e) => {
										e.stopPropagation();
										goTo(currentIdx - 1);
									}}
								>
									<ChevronLeftIcon />
								</NavBtn>
								<NavBtn
									className="nav-btn"
									$side="right"
									onClick={(e) => {
										e.stopPropagation();
										goTo(currentIdx + 1);
									}}
								>
									<ChevronRightIcon />
								</NavBtn>
							</>
						)}

						{/* Dot indicators */}
						{allImages.length > 1 && (
							<DotRow>
								{allImages.map((_, i) => (
									<DotBar
										key={i}
										$active={i === currentIdx}
										onClick={(e) => {
											e.stopPropagation();
											goTo(i);
										}}
									/>
								))}
							</DotRow>
						)}
					</MainImgBox>

					{/* Thumbnails strip — fixed 5 slots */}
					{allImages.length > 1 && (
						<ThumbStrip>
							{/* Prev thumb button */}
							<ThumbNavBtn disabled={thumbOffset === 0} onClick={() => shiftThumbs(-1)}>
								<ChevronLeftIcon fontSize="small" />
							</ThumbNavBtn>

							{/* Fixed 5 slots */}
							<ThumbGrid>
								{visibleThumbs.map((img, localI) => {
									const globalI = thumbOffset + localI;
									return (
										<ThumbItem key={globalI} $active={globalI === currentIdx} onClick={() => goTo(globalI)}>
											<img src={img} alt={`thumb-${globalI}`} onError={(e) => (e.currentTarget.src = "/placeholder.jpg")} />
										</ThumbItem>
									);
								})}
								{/* Fill empty slots if fewer than THUMBS_VISIBLE */}
								{visibleThumbs.length < THUMBS_VISIBLE &&
									Array(THUMBS_VISIBLE - visibleThumbs.length)
										.fill(null)
										.map((_, i) => (
											<ThumbItem key={`empty-${i}`} $active={false} style={{ visibility: "hidden" }}>
												<div />
											</ThumbItem>
										))}
							</ThumbGrid>

							{/* Next thumb button */}
							<ThumbNavBtn disabled={thumbOffset >= maxOffset} onClick={() => shiftThumbs(1)}>
								<ChevronRightIcon fontSize="small" />
							</ThumbNavBtn>
						</ThumbStrip>
					)}
				</GalleryCol>

				{/* ── Product Info ── */}
				<div className="product-info">
					<div className="product-info2">
						<Typography sx={{ fontSize: "18px", color: "gray", mb: 0.5, letterSpacing: "0.04em" }}>{product.name}</Typography>
						<Typography sx={{ fontSize: { xs: "20px", sm: "24px" }, color: "#01041e", fontWeight: 400, lineHeight: 1.3 }} variant="h5">
							{product.model}
						</Typography>
						<Typography sx={{ fontSize: "16px", color: "#aaa", mt: 0.5, mb: 1.5 }}>Арт: {product.vendor_code}</Typography>
						<div className="product-info2-2">
							{hasDiscount && (
								<Typography sx={{ mt: 1, mr: 2, textDecoration: "line-through", color: "gray" }} variant="h5">
									{Math.round(originalPrice).toLocaleString("ru-RU")}₽
								</Typography>
							)}
							<Typography sx={{ mt: 1 }} variant="h5">
								{Math.round(finalPrice).toLocaleString("ru-RU")}₽
							</Typography>
						</div>
						{/* <ul style={{ marginTop: "14px" }}>
							{!product.quantity ? (
								<li style={{ color: "red" }}>Нет в наличии</li>
							) : (
								<>
									<li>Большой размерный ряд</li>
									<li>Качественный материал</li>
									<li>Хорошо сидит на фигуре</li>
								</>
							)}
						</ul> */}

						{/* Selectors */}
						{product.quantity > 0 && sizesData && sizesData.availability.length > 0 && (
							<Box sx={{ mt: 3 }}>
								<Typography sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>Размер:</Typography>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
									{Array.from(new Set(sizesData.availability.map((a) => a.size_name.split("/")[0]))).map((s) => (
										<SizeChip key={s} $active={selectedSize === s} onClick={() => setSelectedSize(s)}>
											{s}
										</SizeChip>
									))}
								</Box>

								{Array.from(new Set(sizesData.availability.map((a) => a.size_name.split("/")[1]).filter(Boolean))).length > 0 && (
									<>
										<Typography sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>Рост:</Typography>
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
											{Array.from(new Set(sizesData.availability.map((a) => a.size_name.split("/")[1]).filter(Boolean))).map((h) => (
												<SizeChip key={h} $active={selectedHeight === h} onClick={() => setSelectedHeight(h)}>
													{h}
												</SizeChip>
											))}
										</Box>
									</>
								)}
							</Box>
						)}
					</div>
					<div className="product-info3">
						<MyAccordion />
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2.5, justifyContent: { xs: "center", md: "flex-start" } }}>
							{product.quantity > 0 &&
								(currentQuantity === 0 ? (
									<Button sx={{ fontWeight: "bold" }} className="main-button" onClick={handleAddToCart}>
										В корзину
									</Button>
								) : (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Button sx={{ fontWeight: "bold", minWidth: "35px" }} className="main-button" onClick={() => handleChangeQuantity(currentQuantity - 1)}>
											-
										</Button>
										<Typography>{currentQuantity}</Typography>
										<Button sx={{ fontWeight: "bold", minWidth: "35px" }} className="main-button" onClick={() => handleChangeQuantity(currentQuantity + 1)}>
											+
										</Button>
									</Box>
								))}
							<Drawer />
						</Box>
					</div>
				</div>
			</div>

			{/* Zoom modal */}
			<Modal
				open={openModal}
				onClose={() => setOpenModal(false)}
				sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}
			>
				<ZoomBox>
					<IconButton
						onClick={() => setOpenModal(false)}
						sx={{
							position: "absolute",
							top: 10,
							right: 10,
							color: "white",
							bgcolor: "rgba(0,0,0,0.45)",
							"&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
							zIndex: 10,
						}}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
					<img src={allImages[currentIdx]} alt="Zoom" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", display: "block" }} />
				</ZoomBox>
			</Modal>

			<ProductInfo />
			<Recommended />

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={4000}
				onClose={() => setSnackbarOpen(false)}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert onClose={() => setSnackbarOpen(false)} severity="warning" variant="filled" sx={{ width: "100%", fontSize: "16px" }}>
					Пожалуйста, выберите размер и рост
				</Alert>
			</Snackbar>
		</div>
	);
};

export default ProductDetail;

/* ── Styled ── */

const GalleryCol = styled("div")({
	width: "35%",
	flexShrink: 0,
	"@media (max-width: 830px)": { width: "100%" },
});

const MainImgBox = styled("div")({
	position: "relative",
	width: "100%",
	aspectRatio: "3 / 4",
	overflow: "hidden",
	backgroundColor: "#f5f5f5",
	cursor: "zoom-in",
	"& > img": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
	"& .nav-btn": { opacity: 0, transition: "opacity 0.2s" },
	"&:hover .nav-btn": { opacity: 1 },
});

const NavBtn = styled("button")<{ $side: "left" | "right" }>(({ $side }) => ({
	position: "absolute",
	top: "50%",
	[$side]: "12px",
	transform: "translateY(-50%)",
	width: "34px",
	height: "34px",
	borderRadius: "50%",
	border: "none",
	backgroundColor: "rgba(255,255,255,0.9)",
	color: "#01041e",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	zIndex: 4,
	padding: 0,
	boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
	"&:hover": { backgroundColor: "#fff", boxShadow: "0 3px 12px rgba(0,0,0,0.22)" },
}));

const DotRow = styled("div")({
	position: "absolute",
	bottom: "10px",
	left: "50%",
	transform: "translateX(-50%)",
	display: "flex",
	gap: "4px",
	zIndex: 3,
});

const DotBar = styled("span")<{ $active: boolean }>(({ $active }) => ({
	display: "block",
	width: $active ? "22px" : "12px",
	height: "2px",
	borderRadius: "1px",
	backgroundColor: $active ? "#fff" : "rgba(255,255,255,0.45)",
	transition: "width 0.25s, background-color 0.25s",
	cursor: "pointer",
}));

const ThumbStrip = styled("div")({
	display: "flex",
	alignItems: "center",
	gap: "6px",
	marginTop: "8px",
});

const ThumbNavBtn = styled("button")({
	width: "28px",
	height: "28px",
	flexShrink: 0,
	borderRadius: "50%",
	border: "1px solid #ddd",
	backgroundColor: "#fff",
	color: "#01041e",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	padding: 0,
	transition: "border-color 0.2s",
	"&:hover:not(:disabled)": { borderColor: "#01041e" },
	"&:disabled": { opacity: 0.3, cursor: "default" },
});

const ThumbGrid = styled("div")({
	display: "flex",
	gap: "6px",
	flex: 1,
});

const ThumbItem = styled("div")<{ $active: boolean }>(({ $active }) => ({
	flex: 1,
	aspectRatio: "3/4",
	overflow: "hidden",
	cursor: "pointer",
	border: $active ? "2px solid #01041e" : "2px solid transparent",
	transition: "border-color 0.2s",
	"& img, & div": { width: "100%", height: "100%", objectFit: "cover", display: "block" },
	"&:hover": { borderColor: $active ? "#01041e" : "#aaa" },
}));

const ZoomBox = styled(Box)({
	position: "relative",
	maxWidth: "95vw",
	maxHeight: "95vh",
	backgroundColor: "transparent",
	outline: "none",
});

const SizeChip = styled("div")<{ $active: boolean }>(({ $active }) => ({
	padding: "6px 12px",
	border: `1px solid ${$active ? "#01041e" : "#ddd"}`,
	backgroundColor: $active ? "#01041e" : "#fff",
	color: $active ? "#fff" : "#333",
	fontSize: "13px",
	borderRadius: "4px",
	cursor: "pointer",
	transition: "all 0.2s",
	"&:hover": {
		borderColor: "#01041e",
	},
}));
