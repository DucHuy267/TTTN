import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Input, message, Modal, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import { addProduct, deleteProduct, getAllProduct, getDetailProduct, updateProduct } from "../../services/ProductServices";
import DrawerCompoment from "../DrawerComponent/DrawerComponent";

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isHidden, setIsHidden] = useState(false);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };
    const [stateProduct, setStateProduct] = useState({
        _id: '',
        name: '',
        price: '',
        description: '',
        quantity: '',
        categoryId: '',
        subcategoryName:'',
        brand:'',
        imageUrl: '',
    });
    const [stateProductDetails, setStateProductDetails] = useState({
        _id: '',
        name: '',
        price: '',
        description: '',
        quantity: '',
        categoryId: '',
        brand:'',
        subcategoryName:'',
        imageUrl: '',
    });

    const [product, setAllProduct] = useState([]);
    const [form] = Form.useForm();

    const fetchGetDetailProduct = async (rowSelected) => {
        const res = await getDetailProduct(rowSelected)
        if (res) {
            setStateProductDetails({
                _id: res?._id,
                name: res?.name,
                price: res?.price,
                description: res?.description,
                quantity: res?.quantity,
                brand: res?.brand,
                categoryId: res?.categoryId,
                subcategoryName: res?.subcategoryName,
                imageUrl: res?.imageUrl,
            });
        }
    }

    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailProduct(rowSelected)
        }
    }, [rowSelected])

    console.log('StateProduct', stateProductDetails)

    const handleDetailsProduct = () => {
        if (rowSelected) {
            fetchGetDetailProduct()
        }
        setIsOpenDrawer(true)
        console.log('rowSeleted', rowSelected)
    };

    const onUpdateProduct = async () => {
        try {
            await updateProduct(stateProductDetails._id, stateProductDetails);
            message.success("Cập nhật sản phẩm thành công");
            setIsOpenDrawer(false);
            fetchGetDetailProduct(rowSelected); // Làm mới chi tiết sau khi cập nhật
            fetchProducts(); // Làm mới danh sách sản phẩm
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleToggleVisibility = async (productId, currentVisibility) => {
        try {
            await updateProduct(productId, { isVisible: !currentVisibility });
            message.success(currentVisibility ? "Sản phẩm đã được ẩn" : "Sản phẩm đã được hiển thị");
            fetchProducts(); // Làm mới danh sách sản phẩm
        } catch (error) {
            console.error("Error toggling product visibility:", error);
        }
    };
    

    const fetchProducts = async () => {
        try {
            const res = await getAllProduct();
            setAllProduct(res.map(item => ({ ...item, key: item._id })));
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(stateProductDetails._id, stateProductDetails);
            alert("Xóa sản phẩm thành công");
            setIsOpenDrawer(false);
            setIsModalOpenDelete(false)
            fetchGetDetailProduct(rowSelected); // Làm mới chi tiết sau khi cập nhật
            fetchProducts(); // Làm mới danh sách sản phẩm
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    const onFinish = async () => {
        try {
            await addProduct(stateProduct);
            alert("Thêm sản phẩm thành công");
            setIsModalOpen(false);
            fetchProducts(); // Làm mới danh sách sản phẩm
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        });
    };
    const handleOnchangeDetails = (e) => {
        console.log('check', e.target.name, e.target.value)
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        });
    };

    const columns = [
        {
            title: 'Hình ảnh', dataIndex: 'imageUrl',
            render: (imageUrl) => (
                <img
                    src={imageUrl}
                    alt="product"
                    style={{ height: '80px', width: '80px', borderRadius: '20%', marginLeft: '5px' }}
                />
            ),
        },
        { title: 'Tên', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length },
        { title: 'Giá', dataIndex: 'price', render: (price) => `${price.toLocaleString('vi-VN')} đ`, sorter: (a, b) => a.price - b.price },
        { title: 'Số lượng', dataIndex: 'quantity', sorter: (a, b) => a.quantity - b.quantity },
        { title: 'Mã loại', dataIndex: 'categoryId' },
        { title: 'Thương hiệu', dataIndex: 'brand'},
        { title: 'Mã danh mục', dataIndex: 'subcategoryName' },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <div>
                    <Popconfirm 
                        title="Bạn có chắc chắn muốn xóa không?" 
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onConfirm={handleDeleteProduct} // Add your delete handler here
                        okText="Có"
                        cancelText="Không"
                        >
                        <Button
                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                            style={{ marginRight: 5 }}
                        />
                    </Popconfirm>
                     
                    <Button
                        icon={<EditOutlined style={{ color: 'orange' }} />}
                        onClick={handleDetailsProduct}
                        style={{ marginRight: 5 }}
                    />
                    <Button
                        onClick={() => handleToggleVisibility(record._id, record.isVisible)}
                    >
                        {record.isVisible ? 'Ẩn' : 'Hiển thị'}
                    </Button>
                </div>
            ),
        },
    ];
    

    return (
        <div>
            <WrapperHeader> Quản lý sản phẩm </WrapperHeader>
            <div style={{ padding: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: '40px' }} />
                </Button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} data={product}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }, // click row

                        };
                    }} />
            </div>

            <Modal title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    {['name', 'description', 'price', 'quantity', 'categoryId', 'subcategoryName', 'brand'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Please input your ${field}!` }]}
                        >
                            <Input value={stateProduct[field]} onChange={handleOnchange} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item
                        label="ImageUrl"
                        name="imageUrl"
                        rules={[{ required: true, message: 'Please input your ImageUrl!' }]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input onChange={handleOnchange} name="imageUrl" style={{ flex: 1 }} />
                            {stateProduct.imageUrl && (
                                <img
                                    src={stateProduct.imageUrl}
                                    alt="avatar"
                                    style={{ height: '80px', width: '80px', borderRadius: '20%', marginLeft: '5px' }}
                                />
                            )}
                        </div>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <DrawerCompoment title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onUpdateProduct}
                    autoComplete="off"
                    form={form}
                >
                    {['name', 'description', 'price', 'quantity', 'categoryId', 'subcategoryName', 'brand'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Please input your ${field}!` }]}
                        >
                            <Input value={stateProductDetails[field]} onChange={handleOnchangeDetails} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item
                        label="ImageUrl"
                        name="imageUrl"
                        rules={[{ required: true, message: 'Please input your ImageUrl!' }]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input onChange={handleOnchangeDetails} name="imageUrl" style={{ flex: 1 }} />
                            {stateProductDetails.imageUrl && (
                                <img
                                    src={stateProductDetails.imageUrl}
                                    alt="avatar"
                                    style={{ height: '90px', width: '90px', borderRadius: '20%', marginLeft: '5px' }}
                                />
                            )}
                        </div>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerCompoment>

            <Modal title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <div>Bạn có chắc chắn xóa sản phẩm này không ?</div>
            </Modal>
        </div>
    );
};
export default AdminProduct;