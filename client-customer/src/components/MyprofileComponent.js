import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../context/MyContext';

class Myprofile extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      isLoading: false,
      message: '',
      messageType: '',
      passwordShown: false,
      profileImage: '/api/placeholder/150/150' // Placeholder image
    };
  }

  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email
      });
    }
  }

  // Toggle password visibility
  togglePasswordVisibility = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  }

  // Handle input changes
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  // Form submission
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, message: '' });

    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const customer = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail
      };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      this.setState({ 
        message: 'Please fill in all fields', 
        messageType: 'error',
        isLoading: false 
      });
    }
  }

  // API call to update customer
  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/customers/' + id, customer, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.setState({ 
            message: 'Profile updated successfully!', 
            messageType: 'success',
            isLoading: false 
          });
          this.context.setCustomer(result);
        } else {
          this.setState({ 
            message: 'Failed to update profile. Please try again.', 
            messageType: 'error',
            isLoading: false 
          });
        }
      })
      .catch((error) => {
        this.setState({ 
          message: error.response?.data?.message || 'An error occurred. Please try again.', 
          messageType: 'error',
          isLoading: false 
        });
      });
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);
    
    const { 
      txtUsername, txtPassword, txtName, txtPhone, txtEmail,
      isLoading, message, messageType, passwordShown, profileImage
    } = this.state;

    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-image-container">
              <img src={profileImage} alt="Profile" className="profile-image" />
            </div>
            <h2>My Profile</h2>
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <form onSubmit={this.handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="txtUsername">Username</label>
              <input
                type="text"
                id="txtUsername"
                name="txtUsername"
                value={txtUsername}
                onChange={this.handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtPassword">Password</label>
              <div className="password-input-container">
                <input
                  type={passwordShown ? "text" : "password"}
                  id="txtPassword"
                  name="txtPassword"
                  value={txtPassword}
                  onChange={this.handleInputChange}
                  className="form-control"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={this.togglePasswordVisibility}
                >
                  {passwordShown ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="txtName">Full Name</label>
              <input
                type="text"
                id="txtName"
                name="txtName"
                value={txtName}
                onChange={this.handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtPhone">Phone Number</label>
              <input
                type="tel"
                id="txtPhone"
                name="txtPhone"
                value={txtPhone}
                onChange={this.handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="txtEmail">Email Address</label>
              <input
                type="email"
                id="txtEmail"
                name="txtEmail"
                value={txtEmail}
                onChange={this.handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="update-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Myprofile;