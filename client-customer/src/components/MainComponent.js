import React, { Component } from 'react'; // Đã sửa khoảng trắng thừa
import Menu from './MenuComponent'; // Đã sửa khoảng trắng trong đường dẫn
import Inform from './InformComponent'; // Đã sửa khoảng trắng trong đường dẫn
import Home from './HomeComponent'; // Đã sửa khoảng trắng trong đường dẫn
import Product from './ProductComponent'; // Added import for ProductComponent
import ProductDetail from './ProductDetailComponent'; // Added import for ProductDetailComponent
import { Routes, Route, Navigate } from 'react-router-dom';
import CartComponent from './CartComponent'; // Added import for CartComponent
import Signup from './SignupComponent';
import Orders from './OrderComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';

class Main extends Component {
    render() {
        return (
            <div className="body-customer"> {/* Đã sửa tên class */}
                {/* <Header /> */}
                <Menu />
                <Inform />
                <Routes>
                    <Route path='/' element={<Navigate replace to='/home' />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/product/category/:cid' element={<Product />} />
                    <Route path='/product/search/:keyword' element={<Product />} />
                    <Route path='/product/:id' element={<ProductDetail />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/myorders' element={<Orders />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/cart' element={<CartComponent />} />
                    <Route path='/myprofile' element={<Myprofile />} />
                </Routes>
                {/* <Footer /> */}
            </div> // Đã thêm thẻ đóng </div>
        );
    }
}

export default Main;