import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Tabs } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');
  body {
    font-family: 'Quicksand', sans-serif;
    background-color: #fffefc;
    margin: 0;
    padding: 0;
  }
`;

const PageContainer = styled.div`
  padding: 30px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  padding: 50px 60px;
  position: relative;
`;

const Title = styled.h1`
  color: #1b5e20;
  text-align: center;
  margin-bottom: 30px;
  font-size: 3rem;
  font-weight: 700;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 20px;
  margin-bottom: 40px;
  object-fit: cover;
  max-height: 500px;
`;

const Paragraph = styled.p`
  font-size: 1.25rem;
  color: #333;
  line-height: 1.75;
  margin-bottom: 20px;
`;

const List = styled.ul`
  padding-left: 24px;
`;

const Li = styled.li`
  margin-bottom: 12px;
  font-size: 1.15rem;
  color: #555;
`;

const BackButton = styled.button`
  background: #aed581;
  color: #1b5e20;
  padding: 10px 20px;
  border: none;
  border-radius: 40px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 40px auto 0;
  transition: all 0.3s ease;

  &:hover {
    background: #9ccc65;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  }
`;

const LearnMore = () => {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  const items = [
    {
      key: "1",
      label: "Nguyên tắc vàng",
      children: (
        <>
          <Paragraph><strong>Nguyên tắc vàng:</strong></Paragraph>
          <List>
            <Li>Làm sạch da mỗi ngày.</Li>
            <Li>Giữ ẩm bằng kem dưỡng.</Li>
            <Li>Sử dụng kem chống nắng.</Li>
            <Li>Uống đủ nước & ăn uống lành mạnh.</Li>
            <Li>Ngủ đủ giấc & giảm stress.</Li>
          </List>
        </>
      ),
    },
    {
      key: "2",
      label: "Chăm sóc ban ngày",
      children: (
        <>
          <Paragraph><strong>Quy trình chăm sóc ban ngày:</strong></Paragraph>
          <List>
            <Li><strong>Làm sạch:</strong> Sữa rửa mặt dịu nhẹ.</Li>
            <Li><strong>Toner:</strong> Cân bằng pH.</Li>
            <Li><strong>Serum:</strong> Dưỡng sáng & chống oxy hóa.</Li>
            <Li><strong>Dưỡng ẩm:</strong> Khóa ẩm cho da.</Li>
            <Li><strong>Kem chống nắng:</strong> Bảo vệ khỏi tia UV.</Li>
          </List>
        </>
      ),
    },
    {
      key: "3",
      label: "Chăm sóc ban đêm",
      children: (
        <>
          <Paragraph><strong>Quy trình ban đêm:</strong></Paragraph>
          <List>
            <Li><strong>Tẩy trang:</strong> Làm sạch lớp makeup.</Li>
            <Li><strong>Rửa mặt:</strong> Loại bỏ cặn bẩn.</Li>
            <Li><strong>Toner:</strong> Chuẩn bị da cho dưỡng chất.</Li>
            <Li><strong>Serum:</strong> Retinol / tái tạo da.</Li>
            <Li><strong>Kem dưỡng:</strong> Giữ ẩm & phục hồi.</Li>
            <Li><strong>Dưỡng mắt:</strong> Giảm thâm & nếp nhăn.</Li>
          </List>
        </>
      ),
    },
    {
      key: "4",
      label: "Lỗi thường gặp & lưu ý",
      children: (
        <>
          <Paragraph><strong>Lỗi thường gặp:</strong></Paragraph>
          <List>
            <Li>Không làm sạch kỹ.</Li>
            <Li>Rửa mặt quá nhiều.</Li>
            <Li>Bỏ quên chống nắng.</Li>
            <Li>Dùng quá nhiều sản phẩm cùng lúc.</Li>
          </List>
          <Paragraph><strong>Lưu ý khi chọn sản phẩm:</strong></Paragraph>
          <List>
            <Li>Chọn thành phần lành tính.</Li>
            <Li>Phù hợp loại da.</Li>
            <Li>Kiểm tra hạn sử dụng.</Li>
          </List>
        </>
      ),
    },
  ];

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <ContentWrapper>
          <Title>Chăm Sóc Da Đúng Cách</Title>
          <Image
            src="https://i.pinimg.com/736x/06/65/6c/06656cb49763307778b67cb74d9a9509.jpg"
            alt="Skin care routine"
          />
          <Tabs defaultActiveKey="1" items={items} centered />
          <BackButton onClick={handleGoBack}>
            <ArrowLeftOutlined />
            Quay lại
          </BackButton>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default LearnMore;
