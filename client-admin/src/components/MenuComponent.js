import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Menu extends Component {
    static contextType = MyContext; // using this.context to access global state

    render() {
        return (
            <div className="border-bottom">
                <div className="menu-float-left">
                <ul className="menu">
                        <li className="menu"><Link to='/admin/home'>Home</Link></li>
                        <li className="menu"><Link to='/admin/category'>Category</Link></li>
                        <li className="menu"><Link to ='/admin/product'>Product</Link></li>
                        <li className="menu"><Link to='/admin/order'>Order</Link></li>
                        <li className="menu"><Link to='/admin/customer'>Customer</Link></li>
                    </ul>
                </div>
                <div className="menu-float-right">
                    <span className='hello-text'>Hello</span> <b>{this.context.username}</b> <span>|| </span>
                    <Link className="btn-logout" to ='/admin/home' onClick={() => this.lnkLogoutClick()}>Logout</Link>
                </div>
                <div className="float-clear" />
            </div>
        );
    }

    // event-handlers
    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setUsername('');
    }
}

export default Menu;