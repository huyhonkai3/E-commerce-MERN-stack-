// src/context/MyProvider.js
import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
    constructor(props) {
        super(props);
        this.state = { // global state
            // Biến dành cho người dùng
            token: '',
            customer: null,
            
            // Biến dành cho giỏ hàng
            cart: [],
            cartCount: 0,
            
            // Các hàm dành cho người dùng
            setToken: this.setToken,
            setCustomer: this.setCustomer,
            
            // Các hàm dành cho giỏ hàng
            addToCart: this.addToCart,
            removeFromCart: this.removeFromCart,
            updateCartItemQuantity: this.updateCartItemQuantity,
            setCart: this.setCart
        };
    }

    componentDidMount() {
        // Lấy token và thông tin người dùng từ localStorage
        const token = localStorage.getItem('token');
        if (token) {
            this.setState({ token });
            const customer = localStorage.getItem('customer');
            if (customer) {
                this.setState({ customer: JSON.parse(customer) });
            }
        }
        
        // Lấy giỏ hàng từ localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            this.setState({ 
                cart: parsedCart,
                cartCount: parsedCart.reduce((total, item) => total + item.quantity, 0)
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
        if (prevState.cart !== this.state.cart) {
            localStorage.setItem('cart', JSON.stringify(this.state.cart));
            this.setState({ 
                cartCount: this.state.cart.reduce((total, item) => total + item.quantity, 0) || 0 
            });
        }
        
        // Lưu token và thông tin người dùng vào localStorage khi chúng thay đổi
        if (prevState.token !== this.state.token) {
            localStorage.setItem('token', this.state.token);
        }
        
        if (prevState.customer !== this.state.customer && this.state.customer) {
            localStorage.setItem('customer', JSON.stringify(this.state.customer));
        }
    }

    // Các hàm quản lý thông tin người dùng
    setToken = (value) => {
        this.setState({ token: value });
    }
    
    setCustomer = (value) => {
        this.setState({ customer: value });
    }
    
    // Các hàm quản lý giỏ hàng
    setCart = (value) => {
        this.setState({ cart: value });
    }
    
    addToCart = (product) => {
        this.setState(prevState => {
            const existingItem = prevState.cart.find(item => item._id === product._id);
            if (existingItem) {
                return {
                    cart: prevState.cart.map(item => item._id === product._id 
                            ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
                            : item
                    )   
                };
            } else {
                return {
                    cart: [...prevState.cart, { ...product, quantity: product.quantity || 1 }]
                };
            }
        });
    }
    
    removeFromCart = (productId) => {
        this.setState(prevState => ({
            cart: prevState.cart.filter(item => item._id !== productId)
        }));
    }
    
    updateCartItemQuantity = (productId, newQuantity) => {
        this.setState(prevState => ({
            cart: prevState.cart.map(item => 
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        }));
    }

    render() {
        return (
            <MyContext.Provider value={this.state}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;