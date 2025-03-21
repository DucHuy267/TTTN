import "./Footer.css"; // Import file CSS

const Footer = () => {
  return (
    <footer className="footer">
      {/* Cột bên trái: Hình ảnh */}
      <div className="footer-image">
        <img
          src="https://i.pinimg.com/474x/7d/53/e9/7d53e9c677009cd88a9f69ce63a335d6.jpg"
          alt="Couple Skincare"
        />
      </div>

      {/* Cột bên phải: Nội dung */}
      <div className="footer-content">
        <h2 style={{fontSize: 30, fontFamily: '-moz-initial'}}>Đăng ký để nhận thông tin khuyến mãi sớm nhất từ......</h2>

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
