import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import AccountInfo from './AccountInfo';
import OrderHistory from './OrderHistory';

const { Sider, Content } = Layout;

const ProfilePage = () => {
  const [selectedMenu, setSelectedMenu] = useState('account');

  return (
    <Layout style={{ minHeight: '100vh' , margin: "0 20px"}}>
      {/* Sidebar Menu */}
      <Sider width={250} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['account']}
          onClick={(e) => setSelectedMenu(e.key)}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="account" icon={<UserOutlined />}>
            Thông tin tài khoản
          </Menu.Item>
          <Menu.Item key="history" icon={<HistoryOutlined />}>
            Lịch sử mua hàng
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Nội dung chính */}
      <Layout style={{ padding: '24px' }}>
        <Content>
          {selectedMenu === 'account' && <AccountInfo />}
          {selectedMenu === 'history' && <OrderHistory />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfilePage;
