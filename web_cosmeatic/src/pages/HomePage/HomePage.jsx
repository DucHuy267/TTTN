import React from "react";
import PopularProducts from "./PopularProducts"; // Import component mới
import SkinCare from "./SkinCare";
import PopularCate from "./popularCate";
import Img1 from "./img1";
import Img2 from "./img2";
import Img3 from "./img3";
import hinh1 from "./images/1.png";

const HomePage = () => {
    return (
        <div>
            <div>
              
                <SkinCare />
               <img src="https://i.pinimg.com/736x/4e/8a/ce/4e8ace833c19ff6cf1eb486f930300db.jpg" alt="banner" style={{width: "60%", margin:" 0 20%"}}/>

                {/* Thêm phần Sản phẩm bán chạy */}
                <PopularProducts /> 

                <div style={{ backgroundColor: "#f8fbec", padding: "30px", marginTop: "20px" }}>    
                    <div class="div1" style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        marginLeft: '30px',
                        color: '#357d18',
                        fontFamily: 'Nunito',
                        textTransform: 'uppercase',
                    }}>
                            Sự lên ngôi của mỹ phẩm thuần chay tại Việt Nam
                    </div>
                    <div class="parent" style={{display: "flex", margin: "30px" }}>
                        <div class="div2" style={{  margin: " 60px 0", padding: " 0 60px", width: 700}}>
                            <p style={{  fontSize: 18, lineHeight: '1.5', fontWeight: 'bold',  color: '#595656'}}>
                                Mỹ phẩm thuần chay đang ngày càng phổ biến tại Việt Nam  
                                với tốc độ tăng trưởng 30% mỗi năm, sự quan tâm của  
                                người tiêu dùng đến sức khỏe, môi trường và xu  
                                hướng sống xanh.  
                            </p> 
                            <p style={{fontSize: 18, lineHeight: '1.5', fontWeight: 'bold',  color: '#595656'}}> 
                                Sự xuất hiện các thương hiệu thuần chay cùng chính  
                                sách hỗ trợ từ chính phủ đã giúp sản phẩm này dễ tiếp  
                                cận hơn. Đây là cơ hội lớn cho các doanh nghiệp phát  
                                triển theo xu hướng bền vững này.           
                            </p>
                        
                        </div>
                        <div class="div3" style={{ width: 400,}}>
                            <img src={hinh1} style={{  height: 420}}/>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{
                        fontSize: '40px',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        color: '#357d18',
                        fontFamily: 'Nunito',
                        textTransform: 'uppercase',
                        marginTop: '20px',
                    }}>
                        Mỹ phẩm 100% thuần chay cho nét đẹp thuần việt
                    </h3>
                    <div>
                        <PopularCate categoryId={1} />
                    </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <Img1 />
                </div>

                <div>
                    <PopularCate categoryId={2} />
                </div>

                <div>
                    <Img2/>
                </div>

                <div>
                    <PopularCate categoryId={3} />
                </div>

                {/* <div>
                    <Img3/>
                </div> */}

            </div>
        </div>
    );
};

export default HomePage;
