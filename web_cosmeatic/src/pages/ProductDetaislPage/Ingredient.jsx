import React from 'react';

const Ingredient = ({ sections }) => {
    return (
        <div className='ingredient' 
            style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, background: '#F2FDED', padding: 20 }}
        > 
            <div className='left-content' style={{ width: '50%', margin: '40px' }}>
                <div>
                    <h1 style={{fontSize: 18, fontWeight: 'bold', color: '#2C6C15', fontFamily: '-moz-initial' }}>
                        Thành phần chính 
                    </h1>
                </div>
                <div>
                    {sections.map((section, index) => (
                        <div key={index}>
                            <p style={{fontSize: 18, fontWeight: 'bold', fontFamily:'-moz-initial'}}>
                                {section.title}
                            </p>
                            <p style={{fontSize: 18, color: '#595454',  fontFamily:'-moz-initial', marginLeft: 20 }}>
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
                
            <div className='right-content' style={{ width: '50%' }}>
                <img src="https://i.pinimg.com/474x/3a/21/51/3a2151b4f918aacf1b8f16a194916c6e.jpg" alt="ingredient" 
                    style={{ width: '650px', height: '500px', padding: 20}} 
                />
            </div> 
        </div>
    );
};

export default Ingredient;
