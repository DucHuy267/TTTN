import "./Footer.css"; // Import file CSS

const Footer = () => {
  return (
    <footer className="footer">
      {/* Cột bên trái: Hình ảnh */}
      <div className="footer-image">
        <img
          src="https://s3-alpha-sig.figma.com/img/82ae/a0a5/19417a1f39f243d4090c62c2c9b56415?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NSa~puOwQ0UffAwlu37CU82GyF9QNc9sVJSEG5xxruNW-3nAd1w4aAbkGgP0L1z4~AvebG7DCm~1ROXweXnsHvtfWfvAdyPHOkmp~l3p1iFlm~Ah69lMk7TIfkOGd0KnoXthvtq1ubaoH7WQnmqMaGE9jTM20hon2zs~eJDsUafpzJmEW2P3FmBn6sTgW8rpbVZVgjsxAvCn7YT799Td3oDUrUCEx9Y7YZACddotGWLstpzqP0V~lqfhm5NDFRa1XP48S6c4lhPEOGNDHQYAnkWLGDzwPcEnhJqOEd8DGYaATqvB1nUSlov7NEGPWv4GkccBitB-WtW2219~dONwLg__"
          alt="Couple Skincare"
        />
      </div>

      {/* Cột bên phải: Nội dung */}
      <div className="footer-content">
        <h2>Đăng ký để nhận thông tin khuyến mãi sớm nhất từ......</h2>

        {/* Ô nhập email */}
        <div className="email-input">
          <input type="email" placeholder="Nhập địa chỉ email" />
          <button>→</button>
        </div>

        <p className="footer-description">
          Đăng ký để nhận thông tin liên lạc về các sản phẩm, dịch vụ, cửa hàng, sự kiện và các vấn đề đáng quan tâm của.
        </p>

        <div className="footer-links">
          <div>
            <h3>Đặt hàng & Hỗ trợ</h3>
            <ul>
              <li><a href="#">Hỏi đáp</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Chính sách bán hàng</a></li>
              <li><a href="#">Điều khoản bảo mật</a></li>
              <li><a href="#">Liên hệ chung</a></li>
            </ul>
          </div>

          <div>
            <h3>Shop</h3>
            <ul>
              <li><a href="#">Sản phẩm mới</a></li>
              <li><a href="#">Dưỡng da</a></li>
              <li><a href="#">Chăm sóc tóc</a></li>
              <li><a href="#">Tắm & Dưỡng thể</a></li>
              <li><a href="#">Dưỡng môi</a></li>
              <li><a href="#">Combo/Bộ sản phẩm</a></li>
            </ul>
          </div>
        </div>

        {/* Về Orinal */}
        <div className="footer-links">
          <div>
          <h3>Về Orinal</h3>
          <ul>
            <li><a href="#">Câu chuyện thương hiệu</a></li>
            <li><a href="#">Giá trị cốt lõi</a></li>
            <li><a href="#">Trách nhiệm cộng đồng</a></li>
            <li><a href="#">Tìm hiểu nguyên liệu</a></li>
          </ul>
          </div>

          <div>
            <h3>Mạng xã hội</h3>
            <ul>
            <li><a href="https://www.facebook.com" target="_blank">Facebook</a></li>
            <li><a href="https://www.instagram.com" target="_blank">Instagram</a></li>
            <li><a href="https://www.youtube.com" target="_blank">YouTube</a></li>
          </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
