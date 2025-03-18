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
        sections: [
            { title: '', content: '' },
        ],
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
        sections: [
            { title: '', content: '' },
        ],
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
                sections: res?.sections || [],
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
            message.error("Failed to fetch products");
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
            message.success("Xóa sản phẩm thành công");
            setIsOpenDrawer(false);
            setIsModalOpenDelete(false)
            fetchGetDetailProduct(rowSelected); // Làm mới chi tiết sau khi cập nhật
            fetchProducts(); // Làm mới danh sách sản phẩm
        } catch (error) {
            message.error("Xóa sản phẩm thất bại");
        }
    }

    const onFinish = async () => {
        try {
            await addProduct(stateProduct);
            message.success("Thêm sản phẩm thành công");
            form.resetFields();
            setIsModalOpen(false);
            fetchProducts(); // Làm mới danh sách sản phẩm
        } catch (error) {
            message.error("Thêm sản phẩm thất bại");
        }
    };

    const onUpdateProduct = async () => {
            try {
                await updateProduct(stateProductDetails._id, stateProductDetails);
                message.success("Cập nhật sản phẩm thành công");
                setIsOpenDrawer(false);
                fetchGetDetailProduct(rowSelected); // Làm mới chi tiết sau khi cập nhật
                fetchProducts(); // Làm mới danh sách sản phẩm
            } catch (error) {
                message.error("Cập nhật sản phẩm thất bại");
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

    const handleAddSection = (isDetail = false) => {
        if (isDetail) {
            setStateProductDetails(prevState => ({
                ...prevState,
                sections: [
                    ...prevState.sections,
                    { title: '', content: '' }
                ]
            }));
        } else {
            setStateProduct(prevState => ({
                ...prevState,
                sections: [
                    ...prevState.sections,
                    { title: '', content: '' }
                ]
            }));
        }
    };
    
    const handleSectionChange = (e, index, field, isDetail = false) => {
        const { value } = e.target;
        if (isDetail) {
            setStateProductDetails(prevState => {
                const newSections = [...prevState.sections];
                newSections[index] = {
                    ...newSections[index],
                    [field]: value,
                };
                return {
                    ...prevState,
                    sections: newSections,
                };
            });
        } else {
            setStateProduct(prevState => {
                const newSections = [...prevState.sections];
                newSections[index] = {
                    ...newSections[index],
                    [field]: value,
                };
                return {
                    ...prevState,
                    sections: newSections,
                };
            });
        }
    };
    
    const handleRemoveSection = (index, isDetail = false) => {
        if (isDetail) {
            setStateProductDetails(prevState => {
                const newSections = prevState.sections.filter((_, i) => i !== index);
                return {
                    ...prevState,
                    sections: newSections,
                };
            });
        } else {
            setStateProduct(prevState => {
                const newSections = prevState.sections.filter((_, i) => i !== index);
                return {
                    ...prevState,
                    sections: newSections,
                };
            });
        }
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
        { title: 'Tên', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length,  },
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
                            <Input onChange={handleOnchangeDetails} name="imageUrl" value={stateProductDetails.imageUrl || ''} style={{ flex: 1 }} />
                            {stateProductDetails.imageUrl && (
                                <img
                                    src={stateProductDetails.imageUrl}
                                    alt="avatar"
                                    style={{ height: '90px', width: '90px', borderRadius: '20%', marginLeft: '5px' }}
                                />
                            )}
                        </div>
                    </Form.Item>
    
                    {/* Sections */}
                    <div style={{ width: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ccc', margin: '10px 90px', borderRadius: '5px' }}>
                        <h3>Chi tiết sản phẩm</h3>
                        {stateProductDetails.sections.map((section, index) => (
                            <div key={index} style={{ width: '80%', display: 'flex', padding: '10px 10px 0px 10px' }}>
                                <div style={{ marginBottom: '10px', width: '95%' }}>
                                    <Form.Item
                                        label={`Title ${index + 1}`}
                                        name={['sections', index, 'title']}
                                        rules={[{ required: true, message: 'Please input title' }]}
                                    >
                                        <Input
                                            defaultValue={section.title}
                                            onChange={(e) => handleSectionChange(e, index, "title", true)}
                                            placeholder="Enter section title"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={`Content ${index + 1}`}
                                        name={['sections', index, 'content']}
                                        rules={[{ required: true, message: 'Please input content' }]}
                                    >
                                        <Input.TextArea
                                            defaultValue={section.content}
                                            onChange={(e) => handleSectionChange(e, index, "content", true)}
                                            placeholder="Enter section content"
                                        />
                                    </Form.Item>
                                </div>
                                <div style={{ width: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                     <Popconfirm 
                                        title="Bạn có chắc chắn muốn xóa không?" 
                                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                        onConfirm= {() => handleRemoveSection(index, true)} // Add your delete handler here
                                        okText="Có"
                                        cancelText="Không"
                                        >
                                        <Button
                                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                                            style={{ marginRight: 5 }}
                                        />
                                    </Popconfirm>
                                </div>
                            </div>
                        ))}
                    </div>
    
                    {/* Add Section Button */}
                    <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
                        <Button type="dashed" onClick={() => handleAddSection(true)} style={{ width: '100%' }}>
                            + Thêm thành phần sản phẩm
                        </Button>
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