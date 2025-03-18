import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import skincareroutine from "./images/skincare-routine.jpg";

const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f9f9f0;
  text-align: center;
  padding: 20px;
`;

const ContentSection = styled.div`
  margin: 0 auto;
  background: #fff;
  padding: 20px 80px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  max-width: 800px;
`;

const Title = styled.h1`
  color: #2e7d32;
  margin-bottom: 20px;
  text-align: center;
  font-size: 3rem;
`;

const Paragraph = styled.p`
  color: #555;
  line-height: 1.8;
  font-size: 1.6rem;
  margin-bottom: 20px;
`;

const List = styled.ul`
  padding-left: 30px;
`;

const Li = styled.li`
  color: #555;
  line-height: 1.8;
  font-size: 1.6rem;
  margin-bottom: 15px;
`;

const Strong = styled.strong`
  color: #2e7d32;
`;

const BackButton = styled.button`
  background-color: #2e7d32;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1.8rem;
  transition: background-color 0.3s ease;
  display: block;
  margin: 20px auto 0;

  &:hover {
    background-color: #1b5e20;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin: 20px 0;
`;

const LearnMore = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <ContentSection>
        <Title>Chăm Sóc Da Đúng Cách</Title>

        <Paragraph>
          Một làn da đẹp không chỉ nhờ vào mỹ phẩm, mà còn phụ thuộc vào chế độ sinh hoạt và dinh dưỡng.
          Hãy chăm sóc da đúng cách để luôn giữ được sự tươi trẻ và rạng rỡ!
        </Paragraph>

        <Paragraph>
          <Strong>Những nguyên tắc vàng trong chăm sóc da:</Strong>
          <List>
            <Li>Làm sạch da hằng ngày để loại bỏ bụi bẩn và dầu thừa.</Li>
            <Li>Giữ ẩm cho da bằng kem dưỡng phù hợp.</Li>
            <Li>Sử dụng kem chống nắng để bảo vệ da khỏi tác hại của tia UV.</Li>
            <Li>Bổ sung đủ nước và ăn uống lành mạnh để nuôi dưỡng làn da từ bên trong.</Li>
            <Li>Hạn chế thức khuya và căng thẳng để tránh tình trạng da xỉn màu.</Li>
          </List>
        </Paragraph>

        <Paragraph>
       

          <Image src="https://th.bing.com/th/id/OIP.kJ6LjhCkxRlYuBU3zsVWNwHaFT?rs=1&pid=ImgDetMain" alt="Làm sạch da đúng cách" />

            <Paragraph style={{ marginLeft: 20 }}>
                <Strong>Quy trình chăm sóc da ban ngày:</Strong>
                <List>
                    <Li><Strong>Bước 1: Làm sạch</Strong> - Dùng sữa rửa mặt dịu nhẹ để loại bỏ dầu thừa và bụi bẩn.</Li>
                    <Li><Strong>Bước 2: Toner</Strong> - Cân bằng độ pH, giúp da sẵn sàng hấp thụ dưỡng chất.</Li>
                    <Li><Strong>Bước 3: Serum</Strong> - Cung cấp dưỡng chất cần thiết như vitamin C để làm sáng da.</Li>
                    <Li><Strong>Bước 4: Dưỡng ẩm</Strong> - Giữ nước cho da, ngăn ngừa tình trạng khô ráp.</Li>
                    <Li><Strong>Bước 5: Kem chống nắng</Strong> - Bảo vệ da khỏi tác hại của tia UV, rất quan trọng khi ra ngoài.</Li>
                </List>
                </Paragraph>

                <Paragraph style={{ marginLeft: 20 }}>
                <Strong>Quy trình chăm sóc da ban đêm:</Strong>
                <List>
                    <Li><Strong>Bước 1: Tẩy trang</Strong> - Loại bỏ lớp trang điểm và bụi bẩn tích tụ trong ngày.</Li>
                    <Li><Strong>Bước 2: Rửa mặt</Strong> - Làm sạch sâu để loại bỏ cặn bã trên da.</Li>
                    <Li><Strong>Bước 3: Toner</Strong> - Giúp da hấp thụ tốt hơn các sản phẩm dưỡng sau.</Li>
                    <Li><Strong>Bước 4: Serum</Strong> - Dùng serum có chứa retinol hoặc các hoạt chất tái tạo da.</Li>
                    <Li><Strong>Bước 5: Kem dưỡng ẩm</Strong> - Cung cấp độ ẩm và phục hồi da khi ngủ.</Li>
                    <Li><Strong>Bước 6: Dưỡng mắt</Strong> - Giúp giảm quầng thâm và nếp nhăn quanh mắt.</Li>
                </List>
            </Paragraph>
        </Paragraph>

        <Paragraph>
          <Strong>Các lỗi thường gặp khi chăm sóc da:</Strong>
          <List>
            <Li>Không làm sạch da đúng cách, dẫn đến mụn và lỗ chân lông bị bít tắc.</Li>
            <Li>Rửa mặt quá nhiều lần trong ngày khiến da bị khô và kích ứng.</Li>
            <Li>Không dùng kem chống nắng, khiến da nhanh lão hóa.</Li>
            <Li>Sử dụng quá nhiều sản phẩm cùng lúc, gây kích ứng và tổn thương da.</Li>
            <Li>Không thay đổi sản phẩm theo tình trạng da và thời tiết.</Li>
          </List>
        </Paragraph>

        <Paragraph>
          <Strong>Lưu ý khi chọn mỹ phẩm chăm sóc da:</Strong>
          <List>
            <Li>Ưu tiên các sản phẩm có thành phần thiên nhiên, lành tính.</Li>
            <Li>Tránh các sản phẩm chứa paraben, cồn khô hoặc hương liệu tổng hợp.</Li>
            <Li>Chọn sản phẩm phù hợp với loại da: da dầu, da khô, da nhạy cảm, da hỗn hợp.</Li>
            <Li>Luôn kiểm tra hạn sử dụng và bảo quản sản phẩm đúng cách.</Li>
          </List>
        </Paragraph>

        <Paragraph>
          Hãy kiên trì với chu trình chăm sóc da phù hợp, kết hợp với chế độ ăn uống lành mạnh
          để có một làn da khỏe mạnh, sáng mịn và tràn đầy sức sống!
        </Paragraph>

        <BackButton onClick={handleGoBack}>Quay lại</BackButton>
      </ContentSection>
    </PageContainer>
  );
};

export default LearnMore;
