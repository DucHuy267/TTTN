import React from "react";
import ImageCarousel from "./ImageCarousel";
import Marquee from "./Marquee";
import PopularProducts from "./PopularProducts"; // Import component mới

const HomePage = () => {
    return (
        <div>
            <div style={{ marginTop: "20px" }}>
                {/* <Marquee /> */}
                <ImageCarousel /> 

                {/* Thêm phần Sản phẩm bán chạy */}
                <PopularProducts /> 

            </div>
        </div>
    );
};

export default HomePage;
