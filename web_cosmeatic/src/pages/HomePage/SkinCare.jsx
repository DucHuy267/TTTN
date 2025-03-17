
import React from "react";
import styled from "styled-components";
import { FaLeaf, FaRecycle } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";

const SkinCareContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f9f9f0;
  padding: 40px;
  text-align: center;
`;

const HeroSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ImageWrapper = styled.div`

  img {
    max-width: 100%;
    border-radius: 10px;
  }
`;

const TextWrapper = styled.div`
  flex: 1;

  h1 {
    font-size: 2.5rem;
    color: #2e7d32;
    margin-bottom: 20px;
  }

  p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 20px;
  }

  button {
    background-color: #2e7d32;
    color: #fff;
    padding: 10px 20px;
    width: 350px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #1b5e20;
    }
  }
`;

const FeaturesSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeatureBox = styled.div`
  text-align: center;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  max-width: 200px;

  svg {
    font-size: 2rem;
    color: #2e7d32;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.9rem;
    color: #555;
  }
`;

const SkinCare = () => {
  const navigate = useNavigate();
  return (
    <SkinCareContainer>
      <HeroSection>
        <ImageWrapper>
          <img
          style={{marginLeft:60}}
            src="https://s3-alpha-sig.figma.com/img/5cc8/c22a/854da1584516d6ea9a6e41ec6ab14e3d?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GuKQgbZnrjsrUQRDb~58nL4r2RkOuI0TqidxRpLfq3vbvxmil-UZYUNBxx-1BmWuNz4PKeYXwRORD3--RSWECz~mgjij4zWcXCMdNF2jv0XOeTD1UVcVYGDJpN8Aclx25s6fR8PEqe8f2tQK8jSYx22zhI9XJIwF8zTVcYjkWh3GyXx0fMhLkCBVFd7pec8VpUjFC9-dZYxMYz2TLkolR8F3k1kMfniWFycmeW02tBS3lvJ50ic5a2FGkI25Z6Wc~3NPcyUP-0jscAeQNTlyDDuQg-mkdOMB2wn8yBLny~LKp5o57wVAQLQPdpg5l0rd69zPyDG8mVAVTtJa~x6EPA__"
            alt="Healthy and glowing skin"
          />
        </ImageWrapper>
        <TextWrapper style={{ marginRight: 200, marginLeft: 50 }}>
          <h1 style={{ fontSize: 80 , }}>Bí quyết để có làn da khỏe mạnh và rạng rỡ</h1>
          <p>Khám phá bí quyết chăm sóc da từ thiên nhiên, giúp da luôn khỏe mạnh, mịn màng và rạng rỡ mỗi ngày.</p>
          <button  onClick={() => navigate("/learnmore")} >Tìm hiểu thêm →</button>
        </TextWrapper>
      </HeroSection>

      <FeaturesSection>
        <FeatureBox>
          <FaRecycle />
          <h3>Thành phần thiên nhiên</h3>
          <p>Chiết xuất từ thực vật và không chứa hóa chất độc hại, an toàn cho mọi loại da.</p>
        </FeatureBox>
        <FeatureBox>
          <FaLeaf />
          <h3>Không thử nghiệm trên động vật</h3>
          <p>Sản phẩm được phát triển mà không thử nghiệm trên động vật, hướng tới vẻ đẹp nhân văn.</p>
        </FeatureBox>
        <FeatureBox>
          <FaRecycle />
          <h3>Bao bì thân thiện với môi trường</h3>
          <p>Sử dụng vật liệu có thể tái chế, giảm thiểu tác động đến môi trường.</p>
        </FeatureBox>
      </FeaturesSection>
    </SkinCareContainer>
  );
};

export default SkinCare;
