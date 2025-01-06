
import { message, Card } from "antd";
import React, { useEffect, useState } from "react";
import { getAllCategory } from "../../services/CategorySevices";
import './style.css'

function BottomLeft() {
    const [categories, setAllCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategory();
            setAllCategories(res.map(item => ({ ...item, key: item.categoryId })));
        } catch (error) {
            message.error("Failed to load categories.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="BottomLeft">
            <div className="bottomlefttop">
                <h2 style={{ fontWeight: 'bold', fontSize: '15px' }}>My Listings</h2>

            </div>

            <div className="bottomleftmid">
                <div className="card-container">
                    <div className="horizontal-scroll">
                        <div className="scroll-content">
                            {categories.map((category) => (
                                <div className="item" key={category.categoryId} style={{ margin: '10px' }}>
                                    <Card
                                        hoverable
                                        style={{ width: 120, height: 200 , }}
                                        cover={
                                            category.image && (
                                                <img
                                                    className="card-image"
                                                    src={category.image}
                                                    alt="product"
                                                    style={{
                                                        marginLeft: '10%',
                                                        marginTop: '10%',
                                                        height: '130px',
                                                        width: '100px',
                                                        objectFit: 'contain',
                                                        margin: '5px auto',
                                                        display: 'block', 

                                                    }}
                                                />
                                            )
                                        }
                                    >
                                        <Card.Meta title={category.categoryName} />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div >
    );
}

export default BottomLeft;