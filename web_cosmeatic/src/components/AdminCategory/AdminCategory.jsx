import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Input, message, Modal, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import TableComponent from "../TableComponent/TableComponent";
import { addCategory, deleteCategory, getAllCategory, getDetailCategory, updateCategory } from "../../services/CategoryServices";
import DrawerCompoment from "../DrawerComponent/DrawerComponent";

const AdminCategory = () => {
    const [showSubcategories, setShowSubcategories] = useState(false); // Ẩn ban đầu danh sách danh mục con
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [stateCategory, setStateCategory] = useState({
        categoryId: '',
        categoryName: '',
        image: '',
        subcategories: [
            {
                subcategoryName: '',
            }
        ],
    });
    
    const [stateCategoryDetails, setStateCategoryDetails] = useState({
        categoryId: '',
        categoryName: '',
        image: '',
        subcategories: [
            {
                subcategoryName: '',
            }
        ],
    });

    const [categories, setAllCategories] = useState([]);
    const [form] = Form.useForm();

    const fetchGetDetailCategory = async (rowSelected) => {
        const res = await getDetailCategory(rowSelected);
        if (res) {
            setStateCategoryDetails({
                categoryId: res?.categoryId,
                categoryName: res?.categoryName,
                image: res?.image,
                subcategories: res?.subcategories || [],
            });
        }
    };

    useEffect(() => {
        form.setFieldsValue(stateCategoryDetails);
    }, [form, stateCategoryDetails]);

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailCategory(rowSelected);
        }
    }, [rowSelected]);

    const handleDetailsCategory = () => {
        if (rowSelected) {
            fetchGetDetailCategory(rowSelected);
        }
        setIsOpenDrawer(true);
    };

    const onUpdateCategory = async () => {
        try {
            await updateCategory(stateCategoryDetails.categoryId, stateCategoryDetails);
            message.success("Cập nhật danh mục thành công");
            setIsOpenDrawer(false);
            fetchGetDetailCategory(rowSelected);
            fetchCategories();
        } catch (error) {
            message.error("Cập nhật danh mục thất bại");
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getAllCategory();
            setAllCategories(res.map(item => ({ ...item, key: item.categoryId })));
            console.log('cate',res);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleDeleteCategory = async () => {
        try {
            await deleteCategory(stateCategoryDetails.categoryId, stateCategoryDetails);
            message.success("Xóa danh mục thành công");
            setIsOpenDrawer(false);
            setIsModalOpenDelete(false);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const onFinish = async () => {
        try {
            await addCategory(stateCategory);
            message.success("Thêm danh mục thành công");
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            message.error("Thêm danh mục thất bại");
        }
    };

    const handleOnchange = (e) => {
        setStateCategory({
            ...stateCategory,
            [e.target.name]: e.target.value,
        });
    };

    const handleOnchangeDetails = (e) => {
        setStateCategoryDetails({
            ...stateCategoryDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubcategoryChange = (e, index, field, isDetail = false) => {
        const { value } = e.target;
        if (isDetail) {
            setStateCategoryDetails(prevState => {
                const newSubcategories = [...prevState.subcategories];
                newSubcategories[index] = {
                    ...newSubcategories[index],
                    [field]: value,
                };
                return {
                    ...prevState,
                    subcategories: newSubcategories,
                };
            });
        } else {
            setStateCategory(prevState => {
                const newSubcategories = [...prevState.subcategories];
                newSubcategories[index] = {
                    ...newSubcategories[index],
                    [field]: value,
                };
                return {
                    ...prevState,
                    subcategories: newSubcategories,
                };
            });
        }
    };

    const removeSubcategory = (index, isDetail = false) => {
        if (isDetail) {
            setStateCategoryDetails(prevState => {
                const newSubcategories = prevState.subcategories.filter((_, i) => i !== index);
                return {
                    ...prevState,
                    subcategories: newSubcategories,
                };
            });
        } else {
            setStateCategory(prevState => {
                const newSubcategories = prevState.subcategories.filter((_, i) => i !== index);
                return {
                    ...prevState,
                    subcategories: newSubcategories,
                };
            });
        }
    
    };
    
    const addSubcategory = (isDetail = false) => {
        setShowSubcategories(true); // Khi bấm thêm, hiển thị form danh mục con
        if (isDetail) {
            setStateCategoryDetails(prevState => ({
                ...prevState,
                subcategories: [
                    ...prevState.subcategories,
                    { subcategoryName: '' }
                ]
            }));
        } else {
            setStateCategory(prevState => ({
                ...prevState,
                subcategories: [
                    ...prevState.subcategories,
                    { subcategoryName: '' }
                ]
            }));
        }
    };

     const renderAction = () => (
        <div>
            <Button icon={<DeleteOutlined style={{ color: 'red'}} />} onClick={() => setIsModalOpenDelete(true)} style={{marginRight: 5}} />
            <Button icon={<EditOutlined style={{ color: 'orange'}} />} onClick={handleDetailsCategory} />
        </div>
    );

    const columns = [
        { title: 'Mã loại', dataIndex: 'categoryId' },
        { title: 'Tên', dataIndex: 'categoryName', sorter: (a, b) => a.categoryName.length - b.categoryName.length },
        {
            title: 'URL hình ảnh', dataIndex: 'image',
            render: (image) => (
                <img
                    src={image}
                    alt="category"
                    style={{ height: '80px', width: '80px', borderRadius: '20%', marginLeft: '5px' }}
                />
            ),
        },
        { 
            title: 'Danh mục con', 
            dataIndex: 'subcategories', 
            render: (subcategories) => subcategories.map(item => item.subcategoryName).join(', '),
            ellipsis: true 
        },
        { title: 'Action', dataIndex: 'action', render: renderAction },
    ];

    return (
        <div>
            <WrapperHeader> Quản lý danh mục </WrapperHeader>
            {/* them ds san pham */}
            <div style={{ padding: '10px' }}>
                <Button
                    style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <PlusOutlined style={{ fontSize: '40px' }} />
                </Button>
            </div>

            {/* Hiển thị danh sách sản phẩm  */}
            <div style={{ marginTop: '20px' }}>
                <TableComponent columns={columns} data={categories}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: () => setRowSelected(record.categoryId),
                        };
                    }}
                />
            </div>

            <Modal title="Tạo danh mục" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    {/* Trường nhập thông tin danh mục chính */}
                    {['categoryId', 'categoryName'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Please input your ${field}!` }]}
                        >
                            <Input value={stateCategory[field]} onChange={handleOnchange} name={field} style={{ marginLeft:10}} />
                        </Form.Item>
                    ))}

                    {/* Trường nhập ảnh */}
                    <Form.Item
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Please input your Image!' }]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input onChange={handleOnchange} name="image" style={{ flex: 1 }} />
                            {stateCategory.image && (
                                <img
                                    src={stateCategory.image}
                                    alt="avatar"
                                    style={{ height: '80px', width: '80px', borderRadius: '20%', marginLeft: '5px' }}
                                />
                            )}
                        </div>
                    </Form.Item>

                    <h1 style={{ marginLeft: '10px', fontSize: 14,  }}>Danh mục con</h1>
                    {/* Trường nhập danh mục con */}
                    {stateCategory.subcategories.map((subcategory, index) => (
                        <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px 10px 0px 10px', borderRadius: '5px' }}>
                            <Form.Item
                                labelCol={{ span: 9 }}
                                wrapperCol={{ span: 14 }}
                                label={` Name ${index + 1}`}
                                name={`subcategoryName${index}`}
                                rules={[{ required: true, message: 'Please input Subcategory Name!' }]}
                            >
                                <Input
                                    value={subcategory.subcategoryName}
                                    onChange={(e) => handleSubcategoryChange(e, index, 'subcategoryName')}
                                    name={`subcategoryName${index}`}
                                    style={{ marginLeft:10}}
                                />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 22, span: 10 }}>
                                
                                <Popconfirm 
                                        title="Bạn có chắc chắn muốn xóa không?" 
                                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                        onConfirm= {() => removeSubcategory(index)} // Add your delete handler here
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                        <Button
                                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                                            style={{ marginRight: 5 }}
                                        />
                                    </Popconfirm>
                            </Form.Item>
                                
                        </div>
                    ))}

                    {/* Nút thêm danh mục con */}
                    <Form.Item wrapperCol={{ offset: 15, span: 18 }}>
                        <Button type="dashed" onClick={() => addSubcategory()} 
                         style={{marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                            + Thêm danh mục con
                        </Button>
                    </Form.Item>

                    {/* Nút Submit */}
                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


            <DrawerCompoment title="Chi tiết danh mục" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onUpdateCategory}
                    autoComplete="off"
                    form={form}
                >
                    {['categoryId', 'categoryName'].map(field => (
                        <Form.Item
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            rules={[{ required: true, message: `Please input your ${field}!` }]}
                        >
                            <Input value={stateCategoryDetails[field]} onChange={handleOnchangeDetails} name={field} />
                        </Form.Item>
                    ))}
                    <Form.Item
                        label="Image URL"
                        name="image"
                        rules={[{ required: true, message: 'Please input your Image URL!' }]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input 
                                onChange={handleOnchangeDetails} 
                                name="image" 
                                value={stateCategoryDetails.image || ''} // Đảm bảo hiển thị giá trị cũ
                                placeholder="Enter image URL..."
                                style={{ flex: 1 }} 
                            />
                            {stateCategoryDetails.image && (
                                <img
                                    src={stateCategoryDetails.image}
                                    alt="preview"
                                    style={{ height: '90px', width: '90px', borderRadius: '20%', marginLeft: '5px' }}
                                />
                            )}
                        </div>
                    </Form.Item>
                    <h1 style={{ marginLeft: '100px', fontSize: 14,  }}>Danh mục con</h1>

                    {stateCategoryDetails.subcategories.map((subcategory, index) => (
                        <div key={index} style={{ 
                                width: '80%', display: 'flex', border: '1px solid #ccc', 
                                padding: '10px 10px 0px 10px', margin: '10px 90px', borderRadius: '5px' 
                            }}>                            
                            <div style={{ marginBottom: '10px', width: '95%' }}>         
                            <Form.Item
                                label={`Name ${index + 1}`}
                                name={['subcategories', index, 'subcategoryName']} // Sử dụng mảng để liên kết form
                                rules={[{ required: true, message: 'Please input Subcategory Name!' }]}
                            >
                                <Input
                                    defaultValue={subcategory.subcategoryName} // Hoặc dùng `value` với `setFieldsValue`
                                    onChange={(e) => handleSubcategoryChange(e, index, 'subcategoryName', true)}
                                />
                            </Form.Item>
                                </div>
                                <div style={{ width: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    
                                        <Button type="danger" onClick={() => removeSubcategory(index, true)} 
                                            icon={<DeleteOutlined style={{ color: 'red'}} />}
                                            style={{  border: '1px solid #ccc', borderRadius: '5px' }}>
                                    
                                        </Button>
                                </div>
                        </div>
                    ))}
                    <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
                        <Button type="dashed" onClick={() => addSubcategory(true)} style={{ width: '100%' }}>
                            + Thêm danh mục con
                        </Button>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 18, span: 18 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerCompoment>

            <Modal title="Xóa danh mục" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteCategory}>
                <p>Bạn có chắc chắn muốn xóa danh mục không?</p>
            </Modal>
        </div>
    );
};

export default AdminCategory;