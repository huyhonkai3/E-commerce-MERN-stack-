import React, { Component } from 'react';

class Home extends Component {
    render() {
        return (
            <div className="admin-home-container">
                <h2 className="admin-home-title">ADMIN HOME</h2>
                <img 
                    src={`${process.env.PUBLIC_URL}/images/bct.png`}
                    width="800px" 
                    height="800px" 
                    alt="Admin Home Pic" 
                />
            </div>
        );
    }
}

export default Home;