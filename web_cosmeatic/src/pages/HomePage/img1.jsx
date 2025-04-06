import React from 'react';

const Img1 = () => {
    return (
        <div>
            
            <div class="parent" style={{display: "flex", maxWidth: 800, maxHeight: 1400}}>
                <div class="div1" style={{ width: 780, height: 700, padding: "0 40px"}}>
                    <img src="https://i.pinimg.com/474x/7d/53/e9/7d53e9c677009cd88a9f69ce63a335d6.jpg" 
                        alt="banner" 
                        style={{display: "flex", width: 650, height: 720}}
                    />
                </div>
                <div style={{ }}>
                    <div style={{display: "flex"}}>
                        <div class="div2">
                            <img src="https://i.pinimg.com/474x/e0/f2/5d/e0f25d8cfc6e8e0d72f67b6221d571fe.jpg" 
                                alt="banner" 
                                style={{ width: 350, height: 350, marginBottom: 20, marginRight: 20}}
                            />
                        </div>

                        <div class="div3">
                            <img src="https://i.pinimg.com/474x/de/e2/a7/dee2a7782583789a6a87cfa49909e4ba.jpg" 
                                alt="banner" 
                                style={{ width: 350, height: 350, marginBottom: 20}}
                            />
                        </div>
                    </div>

                    <div style={{display: "flex"}}>
                        <div class="div4">
                        <img src="https://i.pinimg.com/474x/18/6a/00/186a00d472024c8ffbc769a58a52b09d.jpg" 
                                alt="banner" 
                                style={{ width: 350, height: 350}}
                            />
                        </div>

                        <div class="div5">
                        <img src="https://i.pinimg.com/474x/07/a8/25/07a825b5b4276b22f0ed679d1d9242a3.jpg" 
                                alt="banner" 
                                style={{ width: 350, height: 350, marginLeft: 20}}
                            />
                        </div>
                    </div>
                </div>
            </div>
                
        </div>
    );
};


export default Img1;


