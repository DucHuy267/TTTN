import React, { useState, useEffect } from 'react';
import { Tabs, Input, Button, DatePicker, Select, message, AutoComplete } from 'antd';
import './ProfilePage.css';
import { getUserById, updateUser } from '../../services/UserSevices';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
const { Option } = Select;

const AccountInfo = () => {
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: '',
    name: '',
    phone: '',
    address:'',
    gender: '',
    birthday: null,
  });

  const [initialUserInfo, setInitialUserInfo] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      fetchUserData(decoded.userId);
    }
  }, []);

    // Hàm tải dữ liệu người dùng
    const fetchUserData = async (userId) => {
      try {
        const user = await getUserById(userId);
        const formattedUser = {
          email: user.email,
          name: user.name,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          birthday: user.birthday ? moment(user.birthday) : null,
        };
        setUserInfo(formattedUser);
        setInitialUserInfo(formattedUser); // Lưu trạng thái ban đầu
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };



  const handleUpdateUser = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      const decoded = jwtDecode(storedToken);
      const updatedData = await updateUser(decoded.userId, userInfo);
      setUserInfo(updatedData); // Cập nhật lại giao diện với thông tin mới
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  };

  const [addressSuggestions, setAddressSuggestions] = useState([]); // State để lưu gợi ý địa chỉ

   // Hàm tìm địa chỉ và lấy các gợi ý từ Goong API
   async function fetchAddressSuggestions(query) {
    if (query) {
      try {
        const response = await axios.get('https://rsapi.goong.io/Geocode', {
          params: {
            address: query,
            api_key: 'of49CrLM6HBYo1hhIR7URIFkedv19R2bkIB4l4SD', 
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
  
  // Hàm khôi phục lại trạng thái ban đầu
  const handleReset = () => {
    setUserInfo(initialUserInfo);
    message.info('Đã hủy bỏ các thay đổi.');
  };

  const handleInputChange = (field, value) => {
    setUserInfo({ ...userInfo,
      [field]: field === 'birthday' ? (value ? value.format('YYYY-MM-DD') : null) : value, });
  };

  return (
    <div>
      <div className="account-page">
        <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={(key) => setActiveTab(key)} className="account-tabs">
          <Tabs.TabPane tab="Thông tin tài khoản" key="1">
            <div className="account-info">
              <section className="account-section">
                <div className="grid-container">
                  <div className="grid-item">
                    <label>Email</label>
                    <Input
                      value={userInfo.email}
                      className="input-enabled"
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="grid-item">
                    <label>Địa chỉ</label>
                    <AutoComplete
                      id="address"
                      name="address"
                      placeholder="Nhập địa chỉ cụ thể"
                      value={userInfo.address}
                      onChange={(value) => {
                        handleInputChange('address', value);
                        fetchAddressSuggestions(value); // Gọi API khi người dùng nhập
                      }}
                      options={addressSuggestions} // Các gợi ý địa chỉ
                      onSelect={(value) => handleInputChange('address', value)} // Điền tự động khi chọn
                      style={{ 
                        width: '100%', // Đảm bảo AutoComplete chiếm toàn bộ chiều rộng như Input
                        height: '40px', // Chiều cao của ô nhập liệu giống Input
                        borderRadius: '5px', // Viền bo góc như Input
                        padding: '5px 10px', // Padding giống như Input
                        fontSize: '14px', // Đảm bảo kích thước font giống Input
                      }}
                    />
                  </div>
                </div>
              </section>
              <section className="personal-info">
                <h2>Thông tin cá nhân</h2>
                <div className="grid-container">
                  <div className="grid-item">
                    <label>Họ và tên</label>
                    <Input
                      placeholder="Họ và tên"
                      value={userInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid-item">
                    <label>Ngày sinh</label>
                    <DatePicker
                      placeholder="mm/dd/yyyy"
                      value={userInfo.birthday ? moment(userInfo.birthday) : null} // Hoặc dùng dayjs(userInfo.birthday)
                      onChange={(date) => handleInputChange('birthday', date)}
                      style={{ width: '30%' }}
                    />
                  </div>
                  <div className="grid-item">
                    <label>Số điện thoại</label>
                    <Input
                      placeholder="Số điện thoại"
                      value={userInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid-item">
                    <label>Giới tính</label>
                    <Select
                      placeholder="-- Chọn giới tính --"
                      value={userInfo.gender}
                      onChange={(value) => handleInputChange('gender', value)}
                      style={{ width: '30%' }}
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                    <div className="action-buttons">
                      <Button type="link" className="cancel-button" onClick={handleReset} >Hủy Bỏ</Button> 
                      <Button type="primary" className="save-button" onClick={handleUpdateUser} >Lưu Thông Tin Mới</Button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </Tabs.TabPane>
          
        </Tabs>
      </div>
    </div>
  );
};

export default AccountInfo;
