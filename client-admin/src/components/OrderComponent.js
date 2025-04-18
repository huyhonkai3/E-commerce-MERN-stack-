import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
      const orders = this.state.orders.map((item) => {
          return (
              <tr
                  key={item._id}
                  className="order-row"
                  onClick={() => this.trItemClick(item)}
              >
                  <td>{item._id}</td>
                  <td>{new Date(item.cdate).toLocaleString()}</td>
                  <td>{item.customer.name}</td>
                  <td>{item.customer.phone}</td>
                  <td>{item.total}</td>
              </tr>
          );
      });

      if (this.state.order) {
          var items = this.state.order.items.map((item, index) => {
              return (
                  <tr key={item.product._id} className="order-detail-row">
                      <td>{index + 1}</td>
                      <td>{item.product._id}</td>
                      <td>{item.product.name}</td>
                      <td>
                          <img
                              src={"data:image/jpg;base64," + item.product.image}
                              width="70px"
                              height="70px"
                              alt=""
                          />
                      </td>
                      <td>{item.product.price}</td>
                      <td>{item.quantity}</td>
                      <td>{item.product.price * item.quantity}</td>
                  </tr>
              );
          });
      }

      return (
          <div>
              <div className="order-list-container">
                  <h2 className="text-center">ORDER LIST</h2>
                  <table className="order-table">
                      <thead>
                          <tr className="order-header">
                              <th>ID</th>
                              <th>Creation date</th>
                              <th>Cust.name</th>
                              <th>Cust.phone</th>
                              <th>Total</th>
                          </tr>
                      </thead>
                      <tbody>{orders}</tbody>
                  </table>
              </div>
              {this.state.order && (
                  <div className="order-detail-container">
                      <h2 className="text-center">ORDER DETAIL</h2>
                      <table className="order-detail-table">
                          <thead>
                              <tr className="order-detail-header">
                                  <th>No.</th>
                                  <th>Prod.ID</th>
                                  <th>Prod.name</th>
                                  <th>Image</th>
                                  <th>Price</th>
                                  <th>Quantity</th>
                                  <th>Amount</th>
                              </tr>
                          </thead>
                          <tbody>{items}</tbody>
                      </table>
                  </div>
              )}
          </div>
      );
  }

  componentDidMount() {
    this.apiGetOrders();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrders() {
    localStorage.setItem('authToken', this.context.token); // Lưu token vào localStorage
    const gettoken = localStorage.getItem('authToken'); // Lấy token bằng key 'authToken'
    const config = { headers: { 'x-access-token': gettoken } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}

export default Order;