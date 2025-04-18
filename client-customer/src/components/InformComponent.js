// InformComponent.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../context/MyContext';
import '../App.css';

class Inform extends Component {
    static contextType = MyContext;

    render() {
        const { token, customer } = this.context;
        const isLoggedIn = token !== '';

        return (
            <div className="top-info-bar">
                <div className="container">
                    <div className="info-bar-content">
                        <div className="user-auth">
                            {!isLoggedIn ? (
                                <div className="auth-links">
                                    <Link to='/login' className="auth-link">
                                        <i className="fa fa-sign-in"></i> Login
                                    </Link>
                                    <span className="divider">|</span>
                                    <Link to='/signup' className="auth-link">
                                        <i className="fa fa-user-plus"></i> Signup
                                    </Link>
                                </div>
                            ) : (
                                <div className="user-profile">
                                    <div className="welcome-text">
                                        Hello, <span className="user-name">{customer.name}</span>
                                    </div>
                                    <div className="profile-links">
                                        <Link to='/myprofile' className="profile-link">
                                            <i className="fa fa-user"></i> My profile
                                        </Link>
                                        <span className="divider">|</span>
                                        <Link to='/myorders' className="profile-link">
                                            <i className="fa fa-shopping-bag"></i> My Orders
                                        </Link>
                                        <span className="divider">|</span>
                                        <Link to='/home' className="profile-link logout" onClick={() => this.lnkLogoutClick()}>
                                            <i className="fa fa-sign-out"></i> Logout
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setCustomer(null);
    }
}

export default Inform;