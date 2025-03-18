import React from "react";
import PopularProducts from "./PopularProducts"; // Import component mới
import SkinCare from "./SkinCare";
import './style.css';

const HomePage = () => {
    return (
        <div>
            <div style={{ marginTop: "20px" }}>
              
                <SkinCare />
               <img src="https://s3-alpha-sig.figma.com/img/5899/4bbc/0503efd6883a1974cfb94f4458909058?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=cso3m6Z4w7pNC2wb2wyCsF-CJUOnDJYIRIM9OyCoEIi3IHz~daTfztRlm4O6UeBit8fsWxoV4MbYvnmtujVod4yrbsh2196QRtDeLkeoP7SEGUCENRSrjwImDxJmSjJGROx46gLvZojeJIdfb2u0P3DpWjbRblIBMT~JY1hXhF5HHjJOhk0pyFZnA3lRN076V7o-7ZhdRjAXpMEb6gIVbwNnGYgzUuUhGHi9meMpes9l79TKZQjhiSVx5ei91Y6BAiJTtvnYYEfbgPLLfnI8gD8vZeFHl-co1txxev~c686~XKW0CgPmtXWIqZ~OPfn41aDQhwWj3gUYhZLpV3p-zA__" alt="banner" style={{width: "80%", margin:" 0 10%"}}/>

                {/* Thêm phần Sản phẩm bán chạy */}
                <PopularProducts /> 

            <div>
                
            <div class="parent">
            <div class="div1" style={{  fontSize: 50 , color:"#2e7d32"}}>Sự lên ngôi của mỹ phẩm thuần chay tại Việt Nam</div>
            <div class="div2">Mỹ biến Việt Nam  
                tốc độ tăng trưởng 30% mỗi năm, sự quan tâm của  
                người tiêu dùng đến khỏe, môi trường và xu  
                sống xanh.  
                SV xuất hiện các hiệu thuần chay. Chính  
                sách hỗ trợ tài chính, phê duyệt giúp sản phẩm này dễ tiếp  
                cận hơn. Đây là cơ hội lớn cho các doanh nghiệp phát  
                triển theo xu hướng bền vững này.</div>

                <div class="div3">
                    <img src="https://s3-alpha-sig.figma.com/img/6a4f/1e16/9376c2f683f8c45b51ae036d19d79ddb?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hu-~F1r86CMWqIFzQG8TGJBI3SEKj5sxG5UeqL3mDkkPCHXLhX4vbFLmpzY9iNFYJ5kNYHbXB-moqEDsiCTLJ4agMmE4M47ZFjgLMhyJmSZnoiTtVcSLC8rkO4dLYATRhZDqkyJRBEEC~G-9NL6UTfrvI12u7OR~8NFssmPBhMhuT4-BMZJJQuxttj8XrnWCXCnYeRexcfczt~pCasgv4v6pdjEKu1RYoMzkg742Z1cITpsACU6jlLhnatWSYnuh~aIds1EnEsOuze4U1GSvCvJG44Qu3TeHpm2BwYgHKc4tm5vo03ffqReCBYK~K28su69HjUiK~blWdiZmgqMjSg__"/>
                </div>
            </div>
    
            </div>

            </div>
        </div>
    );
};

export default HomePage;
