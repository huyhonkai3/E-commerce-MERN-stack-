import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../context/MyContext';

const Orders = () => {
  const { token, customer } = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    if (customer) {
      const fetchOrders = async () => {
        try {
          const config = { headers: { 'x-access-token': token } };
          const res = await axios.get(`/api/customer/orders/customer/${customer._id}`, config);
          setOrders(res.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      fetchOrders();
    }
  }, [customer, token]);

  const handleOrderClick = (item) => {
    setOrderDetail(item);
  };

  if (!token) return <Navigate replace to='/login' />;

  return (
    <div className="container">
      <div className="orders-section">
        <h2 className="section-heading">My Orders</h2>
        <table className="order-table">
          <tbody>
            {orders.map((item) => (
              <tr key={item._id} className="order-row" onClick={() => handleOrderClick(item)}>
                <td>
                  <div className="order-card">
                    <div className="order-header">
                      <div className="order-date">
                        <i className="icon-clock"></i>
                        <span className="date-text">{new Date(item.cdate).toLocaleString()}</span>
                      </div>
                      <div className="order-info">
                        <i className="icon-truck"></i>
                        <span className="status-text">{item.status}</span>
                        <span className="customer-name">{item.customer.name}</span>
                      </div>
                    </div>
                    <div className="order-body">
                      {item.items.length > 0 && (
                        <img
                          src={`data:image/jpg;base64,${item.items[0].product.image}`}
                          className="product-image"
                          alt="Product"
                        />
                      )}
                      <div className="product-info">
                        <div className="order-code">Order Code: #{item._id}</div>
                        <div className="product-name">
                          {item.items.length > 0 && item.items[0].product.name}
                        </div>
                      </div>
                    </div>
                    <div className="order-footer">
                      <span className="total-price">Total: {item.total}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="order-detail-section">
        {orderDetail && <OrderDetail order={orderDetail} />}
      </div>
    </div>
  );
};

const OrderDetail = ({ order }) => (
  <div className="order-detail-container">
    <h2 className="detail-heading">Order Detail</h2>
    <table className="detail-table">
      <tbody>
        {order.items.map((item) => (
          <tr key={item.product._id} className="detail-row">
            <td>
              <div className="detail-card">
                <img
                  src={"data:image/jpg;base64," + item.product.image}
                  className="detail-image"
                  alt="Product"
                />
                <div className="detail-info">
                  <h3 className="product-name">{item.product.name}</h3>
                  <p className="product-quantity">Quantity: {item.quantity}</p>
                </div>
                <div className="product-price">
                  <p>Price: {item.product.price}</p>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Orders;