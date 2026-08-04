"use client";
import React, { useState, useEffect } from "react";
import { Button, Typography, Skeleton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { fetchRecommendedProducts, fetchPopularProducts, ApiProduct, getMainImage } from "@/utils/api/productsApi";
import "../../app/suits/products.css";

const Recommended: React.FC = () => {
  const router = useRouter();
  const [recommended, setRecommended] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params?.id;
  const productIdRaw = Array.isArray(id) ? id[0] : id;
  const productId = productIdRaw ? parseInt(productIdRaw, 10) : undefined;

  useEffect(() => {
    const loadRecommended = async () => {
      try {
        let allProducts: ApiProduct[] = [];
        
        if (productId) {
          allProducts = await fetchRecommendedProducts(productId);
        } else {
          allProducts = await fetchPopularProducts();
        }

        // Shuffle array and pick first 3
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        
        setRecommended(selected);
      } catch (error) {
        console.error("Failed to load recommended products", error);
      } finally {
        setLoading(false);
      }
    };
    loadRecommended();
  }, [productId]);

  const handleClickNavigate = (id: number) => () => {
    // We default to /suits/suit/[id] for all products since we unified the detail page wrapper
    router.push(`/suits/suit/${id}`);
  };

  if (loading) {
    return (
      <div className="recommended" style={{ minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Рекомендуемые товары</Typography>
        <div className="recommended-container" style={{ width: "100%", justifyContent: "center", gap: "20px" }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="recommended-block">
              <Skeleton variant="rectangular" width="100%" height={300} />
              <Skeleton variant="text" width="80%" sx={{ mt: 2 }} />
              <Skeleton variant="text" width="40%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommended.length === 0) return null;

  return (
    <div className="recommended">
      <Typography variant="h4">Рекомендуемые товары</Typography>
      <img src="https://i.shgcdn.com/b1dfc452-0cb3-40a2-9fa1-4cfdcbfe5f13/-/format/auto/-/preview/3000x3000/-/quality/lighter/" alt="" />
      <div className="recommended-container">
        {recommended.map((item) => (
          <div key={item.id} onClick={handleClickNavigate(item.id)} className="recommended-block" style={{ cursor: "pointer" }}>
            <div className="product-wrapper">
              <img className="product-img" src={getMainImage(item)} alt={item.name} />
              <div className="middle">
                <Button onClick={(e) => { e.stopPropagation(); handleClickNavigate(item.id)(); }} className="main-button">
                  УЗНАТЬ БОЛЬШЕ
                </Button>
              </div>
            </div>
            <div className="text">
              <Typography sx={{ fontWeight: "300" }}>{item.name} {item.model}</Typography>
              <Typography sx={{ fontWeight: "300", letterSpacing: "1px" }}>{Math.round(parseFloat(item.final_price)).toLocaleString("ru-RU")}₽</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommended;
