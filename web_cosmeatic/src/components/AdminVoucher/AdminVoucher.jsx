import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import axios from "axios";
import { WrapperHeader } from "../AdminUser/style";
import DrawerCompoment from "../DrawerComponent/DrawerComponent";

const AdminVoucher = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [stateVoucher, setStateVoucher] = useState({
        voucherId: '',
        name: '',
        description: '',
        discount: '',
        type: '',
        startDate: '',
        endDate: '',
        products: [],
        categories: [],
        active: false,
    });

    const [stateVoucherDetails, setStateVoucherDetails] = useState({
        voucherId: '',
        name: '',
        description: '',
        discount: '',
        type: '',
        startDate: '',
        endDate: '',
        products: [],
        categories: [],
        active: false,
    });

    const [vouchers, setAllVouchers] = useState([]);
    const [form] = Form.useForm();

    const fetchGetDetailVoucher = async (rowSelected) => {
        const res = await axios.get(`http://localhost:4000/vouchers/${rowSelected}`);
        if (res) {
            setStateVoucherDetails({
                voucherId: res.data.voucherId,
                name: res.data.name,
                description: res.data.description,
                discount: res.data.discount,
                type: res.data.type,
                startDate: res.data.startDate,
                endDate: res.data.endDate,
                products: res.data.products,
                categories: res.data.categories,
                active: res.data.active,
            });
        }
    };

    useEffect(() => {
        form.setFieldsValue(stateVoucherDetails);
    }, [form, stateVoucherDetails]);

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailVoucher(rowSelected);
        }
    }, [rowSelected]);

    const handleDetailsVoucher = () => {
        if (rowSelected) {
            fetchGetDetailVoucher(rowSelected);
        }
        setIsOpenDrawer(true);
    };

    const onUpdateVoucher = async () => {
        try {
            await axios.put(`http://localhost:4000/vouchers/${stateVoucherDetails.voucherId}`, stateVoucherDetails);
            message.success("Cập nhật voucher thành công");
            setIsOpenDrawer(false);
            fetchGetDetailVoucher(rowSelected);
            fetchVouchers();
        } catch (error) {
            console.error("Lỗi khi cập nhật voucher:", error);
        }
    };

    const fetchVouchers = async () => {
        try {
            const res = await axios.get('http://localhost:4000/vouchers');
            setAllVouchers(res.data.map(item => ({ ...item, key: item.voucherId })));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách voucher:", error);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteVoucher = async () => {
        try {
            await axios.delete(`http://localhost:4000/vouchers/${stateVoucherDetails.voucherId}`);
            message.success("Xóa voucher thành công");
            setIsOpenDrawer(false);
            setIsModalOpenDelete(false);
            fetchVouchers();
        } catch (error) {
            console.error("Lỗi khi xóa voucher:", error);
        }
    };

    const onFinish = async () => {
        try {
            await axios.post('http://localhost:4000/vouchers', stateVoucher);
            message.success("Thêm voucher thành công");
            setIsModalOpen(false);
            fetchVouchers();
        } catch (error) {
            console.error("Lỗi khi thêm voucher:", error);
        }
    };

    const handleOnchange = (e) => {
        setStateVoucher({
            ...stateVoucher,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnchangeDetails = (e) => {
        setStateVoucherDetails({
            ...stateVoucherDetails,
            [e.target.name]: e.target.value,
        });
    };

    const renderAction = () => (
        <div>
            <Button icon={<DeleteOutlined style={{ color: 'red' }} />} onClick={() => setIsModalOpenDelete(true)} style={{ marginRight: 5 }} />
            <Button icon={<EditOutlined style={{ color: 'orange' }} />} onClick={handleDetailsVoucher} />
        </div>
    );

    const columns = [
        { title: 'Mã voucher', dataIndex: 'voucherId' },
        { title: 'Tên', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length },
        { title: 'Mô tả', dataIndex: 'description' },
        { title: 'Giảm giá', dataIndex: 'discount' },
        { title: 'Loại', dataIndex: 'type' },
        { title: 'Ngày bắt đầu', dataIndex: 'startDate', render: (text) => new Date(text).toLocaleDateString() },
        { title: 'Ngày kết thúc', dataIndex: 'endDate', render: (text) => new Date(text).toLocaleDateString() },
        { title: 'Hoạt động', dataIndex: 'active', render: (text) => (text ? 'Có' : 'Không') },
        { title: 'Hành động', dataIndex: 'action', render: renderAction },
    ];

    return (
        <div>
            <WrapperHeader> Quản lý voucher </WrapperHeader>
            <div style={{ padding: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: '40px' }} />
                </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} data={vouchers}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: () => setRowSelected(record.voucherId),
                        };
                    }}
                />
            </div>
            <Modal title="Tạo voucher" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    {['voucherId', 'name', 'description', 'discount', 'type', 'startDate', 'endDate'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Vui lòng nhập ${field}!` }]}
                        >
                            <Input value={stateVoucher[field]} onChange={handleOnchange} name={field} style={{ marginLeft: 10 }} />
                        </Form.Item>
                    ))}
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <DrawerCompoment title="Chi tiết voucher" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onUpdateVoucher}
                    autoComplete="off"
                    form={form}
                >
                    {['voucherId', 'name', 'description', 'discount', 'type', 'startDate', 'endDate'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Vui lòng nhập ${field}!` }]}
                        >
                            <Input value={stateVoucherDetails[field]} onChange={handleOnchangeDetails} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item wrapperCol={{ offset: 18, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerCompoment>
            <Modal title="Xóa voucher" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteVoucher}>
                <p>Bạn có chắc chắn muốn xóa voucher không?</p>
            </Modal>
        </div>
    );
};

export default AdminVoucher;