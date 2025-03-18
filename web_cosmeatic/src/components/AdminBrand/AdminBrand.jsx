import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Input, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import { addBrand, deleteBrand, getAllBrand, getDetailBrand, updateBrand } from "../../services/BrandSevices";
import DrawerCompoment from "../DrawerComponent/DrawerComponent";

const AdminBrand = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [stateBrand, setStateBrand] = useState({
        name: '',
        description: '',
        image: '',
        sections: [],
    });
    const [stateBrandDetails, setStateBrandDetails] = useState({
        name: '',
        description: '',
        image: '',
        sections: [],
    });

    const [brands, setAllBrands] = useState([]);
    const [form] = Form.useForm();

    const fetchGetDetailBrand = async (rowSelected) => {
        const res = await getDetailBrand(rowSelected);
        if (res) {
            setStateBrandDetails({
                name: res?.name,
                description: res?.description,
                image: res?.image,
                sections: res?.sections || [],
            });
        }
    };

    useEffect(() => {
        form.setFieldsValue(stateBrandDetails);
    }, [form, stateBrandDetails]);

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailBrand(rowSelected);
        }
    }, [rowSelected]);

    const handleDetailsBrand = () => {
        if (rowSelected) {
            fetchGetDetailBrand(rowSelected);
        }
        setIsOpenDrawer(true);
    };

    const onUpdateBrand = async () => {
        try {
            await updateBrand(stateBrandDetails.name, stateBrandDetails);
            message.success("Cập nhật thương hiệu thành công");
            setIsOpenDrawer(false);
            fetchBrands();
        } catch (error) {
            message.error("Cập nhật thương hiệu thất bại");
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await getAllBrand();
            setAllBrands(res.map(item => ({ ...item, key: item.name })));
        } catch (error) {
            message.error("Failed to fetch brands");
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteBrand = async () => {
        try {
            await deleteBrand(stateBrandDetails.name);
            message.success("Xóa thương hiệu thành công");
            setIsOpenDrawer(false);
            setIsModalOpenDelete(false);
            fetchBrands();
        } catch (error) {
            message.error("Xóa thương hiệu thất bại");
        }
    };

    const onFinish = async () => {
        try {
            await addBrand(stateBrand);
            message.success("Thêm thương hiệu thành công");
            form.resetFields();
            setIsModalOpen(false);
            fetchBrands();
        } catch (error) {
            message.error("Thêm thương hiệu thất bại");
        }
    };

    const handleOnchange = (e) => {
        setStateBrand({
            ...stateBrand,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnchangeDetails = (e) => {
        setStateBrandDetails({
            ...stateBrandDetails,
            [e.target.name]: e.target.value,
        });
    };

    const renderAction = () => (
        <div>
            <Button icon={<DeleteOutlined style={{ color: 'red' }} />} onClick={() => setIsModalOpenDelete(true)} style={{ marginRight: 5 }} />
            <Button icon={<EditOutlined style={{ color: 'orange' }} />} onClick={handleDetailsBrand} />
        </div>
    );

    const columns = [
        { title: 'Tên thương hiệu', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length },
        { title: 'Mô tả', dataIndex: 'description', ellipsis: true  },
        {
            title: 'URL hình ảnh', dataIndex: 'image',
            render: (image) => (
                <img
                    src={image}
                    alt="brand"
                    style={{ height: '80px', width: '110px', borderRadius: '10%', marginLeft: '5px' }}
                />
            ),
        },
        { title: 'Action', dataIndex: 'action', render: renderAction },
    ];

    // Xử lý thêm một section mới
    const handleAddSection = (isDetail = false) => {
        if (isDetail) {
            setStateBrandDetails(prevState => ({
                ...prevState,
                sections: [
                    ...prevState.sections,
                    { title: '', content: '' }
                ]
            }));
        } else {
            setStateBrand(prevState => ({
                ...prevState,
                sections: [
                    ...prevState.sections,
                    { title: '', content: '' }
                ]
            }));
        }
    };

    // Xử lý thay đổi giá trị trong section
    const handleSectionChange = (e, index, field, isDetail = false) => {
        const { value } = e.target;
        if (isDetail) {
            setStateBrandDetails(prevState => {
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
            setStateBrand(prevState => {
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

    // Xử lý xóa một section
    const handleRemoveSection = (index, isDetail = false) => {
        if (isDetail) {
            setStateBrandDetails(prevState => {
                const newSections = prevState.sections.filter((_, i) => i !== index);
                return {
                    ...prevState,
                    sections: newSections,
                };
            });
        } else {
            setStateBrand(prevState => {
                const newSections = prevState.sections.filter((_, i) => i !== index);
                return {
                    ...prevState,
                    sections: newSections,
                };
            });
        }
    };

    return (
        <div>
            <WrapperHeader> Quản lý thương hiệu </WrapperHeader>
            <div style={{ padding: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: '40px' }} />
                </Button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} data={brands}
                    onRow={(record) => ({
                        onClick: () => setRowSelected(record._id),
                    })}
                />
            </div>

            <Modal title="Tạo thương hiệu" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    {['name', 'description'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Please input your ${field}!` }]}
                        >
                            <Input value={stateBrand[field]} onChange={handleOnchange} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please input your Image!' }]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input onChange={handleOnchange} name="image" style={{ flex: 1 }} />
                            {stateBrand.image && (
                                <img
                                    src={stateBrand.image}
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

            <DrawerCompoment title="Chi tiết thương hiệu" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onUpdateBrand}
                    autoComplete="off"
                    form={form}
                >
                    {['name', 'description'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Please input your ${field}!` }]}
                        >
                            <Input value={stateBrandDetails[field]} onChange={handleOnchangeDetails} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please input your Image!' }]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input onChange={handleOnchangeDetails} 
                            name="image" style={{ flex: 1 }}
                            value={stateBrandDetails.image || ''}  />
                            {stateBrandDetails.image && (
                                <img
                                    src={stateBrandDetails.image}
                                    alt="avatar"
                                    style={{ height: '90px', width: '90px', borderRadius: '20%', marginLeft: '5px' }}
                                />
                            )}
                        </div>
                    </Form.Item>

                    {/* Sections */}
                    <div style={{width: '85%', display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', border: '1px solid #ccc',
                        margin: '10px 90px',  borderRadius: '5px'}}>
                        <h3>Câu chuyện thương hiệu</h3>
                    
                        {stateBrandDetails.sections.map((section, index) => (
                            <div key={index} 
                            style={{ 
                                width: '80%', display: 'flex',
                                padding: '10px 10px 0px 10px', 
                            }}
                            >
                            <div style={{ marginBottom: '10px', width: '95%' }}>
                                <Form.Item label={`Title ${index + 1}`}>
                                    <Input
                                        value={section.title}
                                        onChange={(e) => handleSectionChange(e, index, "title", true)}
                                        placeholder="Enter section title"
                                    />
                                </Form.Item>
                                <Form.Item label={`Content ${index + 1}`}>
                                    <Input.TextArea
                                        value={section.content}
                                        onChange={(e) => handleSectionChange(e, index, "content", true)}
                                        placeholder="Enter section content"
                                    />
                                </Form.Item>
                            </div>  
                                
                                <div style={{ width: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button danger onClick={() => handleRemoveSection(index, true)}   
                                        icon={<DeleteOutlined style={{ color: 'red'}} />}
                                        style={{  border: '1px solid #ccc', borderRadius: '5px' }}>
                                    </Button>
                                </div>
                            
                            </div>
                        ))}
                    </div>
                    
                    {/* Add Section Button */}
                    <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
                        <Button type="dashed" onClick={() => handleAddSection(true)} style={{ width: '100%' }}>
                            + Thêm câu chuyện thương hiệu
                        </Button>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 18, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerCompoment>

            <Modal title="Xóa thương hiệu" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteBrand}>
                <p>Bạn có chắc chắn muốn xóa thương hiệu không?</p>
            </Modal>
        </div>
    );
};

export default AdminBrand;