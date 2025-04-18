// CartComponent.js
import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import MyContext from '../context/MyContext';
import axios from 'axios';
import '../App.css';

// Utility để tính tổng tiền
const CartUtil = {
  getTotal: (cart) => {
    if (!cart) return 0;
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
};

class CartComponent extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      navigate: null
    };
  }

  calculateTotal = () => {
    const { cart } = this.context;
    return CartUtil.getTotal(cart);
  };

  handleRemove = (id) => {
    const { removeFromCart } = this.context;
    removeFromCart(id);
  };

  handleQuantityChange = (id, newQuantity) => {
    const { updateCartItemQuantity } = this.context;
    if (newQuantity >= 1) {
      updateCartItemQuantity(id, newQuantity);
    }
  };

  formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // event-handlers
  lnkCheckoutClick = () => {
    if (window.confirm('Are you sure you want to proceed to checkout?')) {
      const cart = this.context.cart;
      if (cart && cart.length > 0) {
        const total = CartUtil.getTotal(cart);
        const customer = this.context.customer;
        if (customer) {
          const items = cart.map(item => ({
            product: {
              _id: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
              cdate: item.cdate,
              category: item.category || {}
            },
            quantity: item.quantity
          }));
          
          this.apiCheckout(total, items, customer);
        } else {
          this.setState({ navigate: '/login' });
        }
      } else {
        alert('Your cart is empty!');
      }
    }
  };

  // apis
  apiCheckout = (total, items, customer) => {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Successfully placed order!');
        // Cập nhật giỏ hàng
        this.context.setCart([]);
        this.setState({ navigate: '/home' });
      } else {
        alert('Failed to place order!');
      }
    }).catch(error => {
      alert('Checkout Failed: ' + (error.response?.data?.message || error.message));
    });
  };

  render() {
    if (this.state.navigate) {
      return <Navigate to={this.state.navigate} />;
    }

    const { cart } = this.context;
    if (!cart) {
      return (
        <div className="cart-container">
          <div className="cart-header">
            <h2>My Cart</h2>
            <div className="cart-summary">
              Loading cart items...
            </div>
          </div>
        </div>
      );
    }
    
    const totalAmount = this.calculateTotal();

    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>My Cart</h2>
          <div className="cart-summary">
            {cart.length} {cart.length === 1 || cart.length === 0 ? 'item' : 'items'} in cart
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="fa fa-shopping-cart"></i>
            </div>
            <p>Cart is empty</p>
            <Link to="/home" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={`data:image/jpg;base64,${item.image}`}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">{this.formatPrice(item.price)}</div>
                  </div>
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => this.handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => this.handleQuantityChange(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-subtotal">
                    {this.formatPrice(item.price * item.quantity)}
                  </div>
                  <div className="item-remove">
                    <button 
                      className="remove-btn"
                      onClick={() => this.handleRemove(item._id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary-box">
              <div className="summary-header">Total Order</div>
              <div className="summary-row">
                <span>Temporary Total</span>
                <span>{this.formatPrice(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{cart.length > 0 ? this.formatPrice(10) : this.formatPrice(0)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{this.formatPrice(totalAmount + (cart.length > 0 ? 10 : 0))}</span>
              </div>
              <button onClick={this.lnkCheckoutClick} className="checkout-btn">
                Checkout
              </button>
              <Link to="/home" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CartComponent;