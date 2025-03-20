import React, { useState } from 'react';
import { Button, Col, Input, notification, Radio, Row, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './CreateOrder.css';
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTotalPrice = location.state?.totalPrice || 0;
  const initialOrderSummary = location.state?.products || [];
  const userId = location.state?.userId; // Retrieve userId from location.state
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);
  const [orderSummary, setOrderSummary] = useState(initialOrderSummary);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: '', 
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]); // State để lưu gợi ý địa chỉ

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm tìm địa chỉ và lấy các gợi ý từ Goong API
  async function fetchAddressSuggestions(query) {
    if (query) {
      try {
        const response = await axios.get('https://rsapi.goong.io/Geocode', {
          params: {
            address: query,
            api_key: 'of49CrLM6HBYo1hhIR7URIFkedv19R2bkIB4l4SD', // Thay thế bằng API Key Goong của bạn
          },
        });
        const data = response.data.results;
        if (data && data.length > 0) {
          setAddressSuggestions(
            data.map((item) => ({
              value: item.formatted_address, // Gợi ý địa chỉ
              label: item.formatted_address, // Hiển thị gợi ý dưới dạng label
            }))
          );
        } else {
          setAddressSuggestions([]);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API Geocoding Goong:', error);
        setAddressSuggestions([]);
      }
    } else {
      setAddressSuggestions([]);
    }
  }

  async function handlePayment() {
    try {
      const newOrder = {
        userInfo: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        payment: formData.payment,
        products: orderSummary.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          total: item.total,
        })),
        userId: userId,
        amount: totalPrice,
      };

      // Kiểm tra phương thức thanh toán
      if (formData.payment === 'cod') {
        // Gửi yêu cầu đến API cho phương thức thanh toán khi nhận hàng
        const response = await axios.post(
          'http://localhost:4000/orders/create_order_receive',
          newOrder
        );

        if (response.status === 200) {
          notification.success({
            message: 'Đặt hàng thành công',
            description: 'Đơn hàng của bạn đã được tạo thành công.',
          });
          navigate('/');
        } else {
          throw new Error('Không thể tạo đơn hàng COD');
        }
      } else {
        // Phương thức thanh toán khác (ví dụ: VNPay)
        const orderResponse = await axios.post(
          'http://localhost:4000/orders/create_order',
          newOrder
        );

        if (orderResponse.status !== 200 || !orderResponse.data) {
          throw new Error('Không thể tạo đơn hàng');
        }

        const { orderId, paymentUrl } = orderResponse.data;
        console.log("VNPay Payment URL:", paymentUrl);


        // Chuyển hướng đến URL thanh toán của VNPay
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error('Không nhận được URL thanh toán VNPay');
        }
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi đặt hàng',
        description: `Không thể xử lý yêu cầu: ${error?.message || error}`,
      });
    }
  };

  return (
    <div className="CreateOrder" style={{ backgroundColor: '#fefbf4' }}>
      <header className="checkout-header" style={{ marginBottom: '20px' }}>
        <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <img
            src="https://cocoonvietnam.com/_nuxt/img/logo-left.b10676c.svg"
            alt="Logo"
            style={{
              width: '100px', 
              height: 'auto',  
              marginRight: '10px', 
            }}
          />
          <h1 style={{
             fontSize: '30px',
             fontFamily: '-moz-initial',
             margin: 0,
             marginLeft: 380
          }}>
            Thanh toán
          </h1>
        </div>
      </header>

      <main className="checkout-container">
        <div className="form-container">
          <form className="checkout-form">
            <section className="billing-info">
              <h2>Thông tin liên hệ</h2>
              <h2>Địa chỉ giao hàng</h2>
              <label htmlFor="name">Họ và tên</label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={handleChange}
              />
              <label htmlFor="phone">Số điện thoại</label>
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
              <label htmlFor="address">Địa chỉ</label>
              <AutoComplete
                id="address"
                name="address"
                placeholder="Nhập địa chỉ cụ thể"
                value={formData.address}
                onChange={(value) => {
                  setFormData({ ...formData, address: value });
                  fetchAddressSuggestions(value); // Gọi API khi người dùng nhập
                }}
                options={addressSuggestions} // Các gợi ý địa chỉ
                onSelect={(value) => setFormData({ ...formData, address: value })} // Điền tự động khi chọn
                style={{ 
                  width: '100%', // Đảm bảo AutoComplete chiếm toàn bộ chiều rộng như Input
                  height: '40px', // Chiều cao của ô nhập liệu giống Input
                  borderRadius: '5px', // Viền bo góc như Input
                  padding: '5px 10px', // Padding giống như Input
                  fontSize: '14px', // Đảm bảo kích thước font giống Input
                }}
              />
              <section className="payment-method">
                <h2>Phương thức thanh toán</h2>
                <Radio.Group
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                >
                  <Radio style={{ display: 'block' }} value="cod">
                    Thanh toán khi giao hàng
                  </Radio>
                  <Radio style={{ display: 'block' }} value="vnpay">
                    Thanh toán bằng Ví VNPAY
                  </Radio>
                </Radio.Group>
              </section>
            </section>
          </form>

          <section className="order-summary">
            <b>Thông tin đơn hàng</b>
            <hr style={{ margin: 10 }} />
            <ul>
              {orderSummary.map((item, index) => (
                <Row key={index} style={{ margin: 8 }}>
                  <Col span={10}>
                    {item.name.length > 25
                      ? `${item.name.substring(0, 25)}...`
                      : item.name}
                  </Col>
                  <Col span={2}>{item.quantity}</Col>
                  <Col span={6}>{item.price.toLocaleString()} VND</Col>
                  <Col span={6}>{item.total.toLocaleString()} VND</Col>
                </Row>
              ))}
            </ul>
            <div className="price-summary">
              <p>
                Tạm tính: <span>{totalPrice.toLocaleString()} VND</span>
              </p>
              <p>Giảm giá: <span>0 VND</span></p>
              <p>Phí vận chuyển: <span>0 VND</span></p>
              <p>
                <b>
                  Tổng cộng: <span>{totalPrice.toLocaleString()} VND</span>
                </b>
              </p>
            </div>
            <Button
              style={{ marginTop: 3, marginBottom: 15, fontFamily: '-moz-initial' }}
              type="primary"
              htmlType="submit"
              className="checkout-btn"
              onClick={handlePayment}
            >
              Đặt hàng
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CreateOrder;
