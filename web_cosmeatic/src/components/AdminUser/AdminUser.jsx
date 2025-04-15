import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Input, Modal, message, AutoComplete, Tag, Select } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../../services/UserSevices";
import DrawerCompoment from "../DrawerComponent/DrawerComponent";
import axios from "axios";
import { debounce } from "lodash"; // Để thêm tính năng debounce cho các yêu cầu API

const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [stateUser, setStateUser] = useState({
        _id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
    });
    const [stateUserDetails, setStateUserDetails] = useState({
        _id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
    });

    const [users, setAllUsers] = useState([]);
    const [form] = Form.useForm();
    const [addressSuggestions, setAddressSuggestions] = useState([]); // State để lưu các gợi ý địa chỉ

    const fetchUserDetail = async (rowSelected) => {
        const res = await getUserById(rowSelected);
        if (res) {
            setStateUserDetails({
                _id: res?._id,
                name: res?.name,
                email: res?.email,
                password: res?.password,
                phone: res?.phone,
                address: res?.address,
                role: res?.role,
            });
        }
    };

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (rowSelected) {
            fetchUserDetail(rowSelected);
        }
    }, [rowSelected]);

    const handleUserDetails = () => {
        if (rowSelected) {
            fetchUserDetail(rowSelected); 
        }
        setIsOpenDrawer(true);
    };

    const onUpdateUser = async () => {
        try {
            await updateUser(stateUserDetails._id, stateUserDetails);
            message.success("Cập nhật người dùng thành công");
            setIsOpenDrawer(false);
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setAllUsers(res.map(item => ({ ...item, key: item._id })));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteUser = async () => {
        try {
            await deleteUser(stateUserDetails._id);
            message.success("Xóa người dùng thành công");
            setIsOpenDrawer(false);
            setIsModalOpenDelete(false);
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
        }
    };

    const onFinish = async () => {
        try {
            await createUser(stateUser);
            message.success("Thêm người dùng thành công");
            form.resetFields();
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            message.error("Lỗi khi thêm người dùng!");
        }
    };

    // Hàm tìm kiếm gợi ý địa chỉ và gọi API Goong
    const fetchAddressSuggestions = debounce(async (query) => {
        if (query) {
            try {
                const response = await axios.get('https://rsapi.goong.io/Geocode', {
                    params: {
                        address: query,
                        api_key: 'of49CrLM6HBYo1hhIR7URIFkedv19R2bkIB4l4SD', // Thay bằng API Key Goong của bạn
                    },
                });
                const data = response.data.results;
                if (data && data.length > 0) {
                    setAddressSuggestions(
                        data.map((item) => ({
                            value: item.formatted_address, // Gợi ý địa chỉ
                            label: item.formatted_address,
                        }))
                    );
                } else {
                    setAddressSuggestions([]);
                }
            } catch (error) {
                console.error('Lỗi khi lấy gợi ý địa chỉ:', error);
                setAddressSuggestions([]);
            }
        } else {
            setAddressSuggestions([]);
        }
    }, 300); // Đặt debounce là 300ms

    const handleOnchange = (e) => {
        const { name, value } = e.target || {}; // e.target có thể không tồn tại
        setStateUser({
            ...stateUser,
            [name]: value || e, // Nếu không có e.target, thì lấy e là giá trị trực tiếp
        });
    };    

    const handleOnchangeDetails = (e) => {
        const { name, value } = e.target || {};
        setStateUserDetails({
            ...stateUserDetails,
            [name]: value || e,
        });
    };


    const renderAction = () => {
        return (
            <div>
                    <Button icon={<DeleteOutlined style={{ color: 'red'}} />} onClick={() => setIsModalOpenDelete(true)} style={{marginRight: 5}} />
                    <Button icon={<EditOutlined style={{ color: 'orange'}} />} onClick={handleUserDetails} />
            </div>
            
        );
    };

    const columns = [
        { title: 'Tên', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phone' },
        // { title: 'Địa chỉ', dataIndex: 'address' },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            render: (role) => {
                let roleText = '';
                switch (role) {
                    case 'user':
                        roleText = 'user';
                        break;
                    case 'shipper':
                        roleText = 'shipper';
                        break;
                    case 'admin':
                        roleText = 'admin';
                        break;
                    
                    default:
                        roleText = 'Chưa xác định';
                }
        
                return (
                    <Tag color={role === 'user' ? 'green' : role === 'shipper' ? 'blue' : role === 'admin' ? 'orange' : 'gray'}>
                        {roleText}
                    </Tag>
                );
            },
        }, 
        { title: 'Thao tác', dataIndex: 'action', render: renderAction },
    ];

    return (
        <div>
            <WrapperHeader> Quản lý người dùng </WrapperHeader>
            <div style={{ padding: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: '40px' }} />
                </Button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    data={users}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id);
                            },
                        };
                    }}
                />
            </div>

            <Modal title="Tạo người dùng" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    {['name', 'email', 'password'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Vui lòng nhập ${field}!` }]}>
                            <Input value={stateUser[field]} onChange={handleOnchange} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item label="Số điện thoại" name="phone">
                        <Input value={stateUser.phone} onChange={handleOnchange} name="phone" />
                    </Form.Item>
                    <Form.Item label="Vai trò" name="role">
                        <Select 
                            value={stateUser.role} 
                            onChange={(value) => handleOnchange({ target: { name: "role", value } })}
                        >
                            <Select.Option value="user">Người dùng</Select.Option>
                            <Select.Option value="shipper">Shipper</Select.Option>
                            <Select.Option value="admin">Quản trị viên</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <AutoComplete
                            value={stateUser.address}
                            onChange={(value) =>
                                handleOnchange({ target: { name: "address", value } })
                            }
                            onSearch={fetchAddressSuggestions}
                            options={addressSuggestions}
                            style={{ 
                                width: '100%', 
                                height: '40px', 
                                borderRadius: '5px', 
                                padding: '5px 10px', 
                                fontSize: '14px', 
                            }}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <DrawerCompoment title="Chi tiết người dùng" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onUpdateUser}
                    autoComplete="off"
                    form={form}
                >
                    {['name', 'email', 'password'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Vui lòng nhập ${field}!` }]}>
                            <Input value={stateUserDetails[field]} onChange={handleOnchangeDetails} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item label="Số điện thoại" name="phone">
                        <Input value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                    </Form.Item>
                    <Form.Item label="Vai trò" name="role">
                        <Select 
                            value={stateUserDetails.role} 
                            onChange={(value) => handleOnchangeDetails({ target: { name: "role", value } })}
                        >
                            <Select.Option value="user">Người dùng</Select.Option>
                            <Select.Option value="shipper">Shipper</Select.Option>
                            <Select.Option value="admin">Quản trị viên</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <AutoComplete
                            value={stateUserDetails.address}
                            onChange={(value) =>
                                handleOnchangeDetails({ target: { name: "address", value } })
                            }
                            onSearch={fetchAddressSuggestions}
                            options={addressSuggestions}
                            style={{ 
                                width: '100%', 
                                height: '40px', 
                                borderRadius: '5px', 
                                padding: '5px 10px', 
                                fontSize: '14px', 
                            }}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Áp dụng
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerCompoment>

            <Modal title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <div>Bạn có chắc chắn muốn xóa người dùng này không?</div>
            </Modal>
        </div>
    );
};

export default AdminUser;
