import React, { useState } from 'react';
import { Menu } from "antd";
import { getItem } from "../../utils";
import {
    UserOutlined, ProductOutlined, AppstoreOutlined, ShoppingOutlined, LayoutOutlined,
    LineChartOutlined, AreaChartOutlined, ContactsOutlined, DollarOutlined
} from '@ant-design/icons';
import { LogoutOutlined } from '@ant-design/icons';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminCategory from '../../components/AdminCategory/AdminCategory';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import './style.css';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';
import HeaderComponent from '../../components/HeaderComponents/HeaderComponent';

// Import useNavigate from react-router-dom
import { useNavigate } from 'react-router-dom';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import Charts from '../../components/Settings/Charts';
import AdminBrand from '../../components/AdminBrand/AdminBrand';
import AdminVoucher from '../../components/AdminVoucher/AdminVoucher';

const AdminPage = () => {
    // Initialize navigate
    const navigate = useNavigate();

    const items = [
        {
            label: <strong style={{ color: '#000' }}>QUICK MENU</strong>,
            key: 'quickMenu',
            type: 'group',
            children: [
                getItem('Dashboard', 'dashboard', <LayoutOutlined />),
                getItem('Người dùng', 'user', <UserOutlined />),
                getItem('Sản phẩm', 'product', <ProductOutlined />, [
                    getItem('Danh mục', 'category', <AppstoreOutlined />),
                    getItem('Sản phẩm', 'product', <ProductOutlined />),
                ]),
                getItem('Đơn hàng', 'order', <ShoppingOutlined />),
                getItem('Quản lý thương hiệu ', 'brand', <ShoppingOutlined />),
                // getItem('Quan ly voucher', 'voucher', <ShoppingOutlined />),
                // getItem('Quan ly bài đăng', 'post', <ShoppingOutlined />),
                // getItem('Quan ly tin nhắn', 'message', <ShoppingOutlined />),
            ],
        },
        {
            label: <strong style={{ color: '#000' }}>SETTINGS</strong>,
            key: 'settings',
            type: 'group',
            children: [
                getItem('Charts', 'charts', <LineChartOutlined />),
                getItem('Trends', 'trends', <AreaChartOutlined />),
                getItem('Contact', 'contact', <ContactsOutlined />),
                getItem('Billing', 'billing', <DollarOutlined />),
            ],
        },
    ];

    const [keySelected, setKeySelected] = useState('dashboard');

    // Function to render pages based on selected key
    const renderPage = (key) => {
        switch (key) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'user':
                return <AdminUser />;
            case 'category':
                return <AdminCategory />;
            case 'product':
                return <AdminProduct />;
            case 'order':
                return <AdminOrder />;
            case 'brand':
                return <AdminBrand />;
            case 'charts':
                return <Charts />;  
            case 'voucher':
                return <AdminVoucher />;  
            default:
                return <></>;
        }
    };

    // Handle menu click, including logout
    const handleOnClick = ({ key }) => {
        if (key === 'logout') {
            console.log("Logging out...");
            navigate('/login'); // Redirect to login page
        } else {
            setKeySelected(key);
        }
    };

    // Logout button component
    const LogoutButton = ({ onLogout }) => {
        return (
            <div className="logout-container">
                <button className="logout-button" onClick={onLogout}>
                    <LogoutOutlined className="logout-icon" />
                    Log Out
                </button>
            </div>
        );
    };

    return (
        <div className="admin-container">
            <div className="sidebar">
                <div className="logo-header">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKVT29aD5GiiyNvC-qcl_1-8mldGfUXZSX-A&s"
                        alt="logo"
                        className="logo-image"
                    />
                    <div className="profile-header">Cocoon Original</div>
                </div>

                <Menu
                    mode="inline"
                    items={items}
                    onClick={handleOnClick}
                    className="menu"
                />

                {/* Render Logout Button */}
                <LogoutButton onLogout={() => handleOnClick({ key: 'logout' })} />


            </div>

            <div className="content-area">
                <HeaderComponent />
                {renderPage(keySelected)}

            </div>
        </div>
    );
};

export default AdminPage;
