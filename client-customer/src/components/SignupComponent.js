import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtUsername: '',
            txtPassword: '',
            txtName: '',
            txtPhone: '',
            txtEmail: '',
            loading: false,
            error: '',
            success: '',
            errors: {
                username: '',
                password: '',
                name: '',
                phone: '',
                email: ''
            }
        };
    }

    render() {
        return (
            <div className="signup-container">
                <div className="signup-form-wrapper">
                    <div className="signup-header">
                        <h2>Register Account</h2>
                        <p>Please fill in all information to create a new account.</p>
                    </div>
                    
                    {this.state.error && (
                        <div className="signup-error">
                            <i className="fa fa-exclamation-circle"></i> {this.state.error}
                        </div>
                    )}
                    
                    {this.state.success && (
                        <div className="signup-success">
                            <i className="fa fa-check-circle"></i> {this.state.success}
                        </div>
                    )}
                    
                    <form className="signup-form" onSubmit={(e) => this.btnSignupClick(e)}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="username">
                                    <i className="fa fa-user"></i> Username <span className="required">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="username"
                                    placeholder="Input username"
                                    value={this.state.txtUsername} 
                                    onChange={(e) => this.handleInputChange('txtUsername', e.target.value)}
                                    className={this.state.errors.username ? 'error' : ''}
                                    required
                                />
                                {this.state.errors.username && (
                                    <div className="field-error">{this.state.errors.username}</div>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="name">
                                    <i className="fa fa-id-card"></i> Full name <span className="required">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="name"
                                    placeholder="Input full name"
                                    value={this.state.txtName} 
                                    onChange={(e) => this.handleInputChange('txtName', e.target.value)}
                                    className={this.state.errors.name ? 'error' : ''}
                                    required
                                />
                                {this.state.errors.name && (
                                    <div className="field-error">{this.state.errors.name}</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">
                                    <i className="fa fa-lock"></i> Password <span className="required">*</span>
                                </label>
                                <input 
                                    type="password" 
                                    id="password"
                                    placeholder="Input password"
                                    value={this.state.txtPassword} 
                                    onChange={(e) => this.handleInputChange('txtPassword', e.target.value)}
                                    className={this.state.errors.password ? 'error' : ''}
                                    required
                                />
                                {this.state.errors.password && (
                                    <div className="field-error">{this.state.errors.password}</div>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">
                                    <i className="fa fa-envelope"></i> Email <span className="required">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    id="email"
                                    placeholder="Input email"
                                    value={this.state.txtEmail} 
                                    onChange={(e) => this.handleInputChange('txtEmail', e.target.value)}
                                    className={this.state.errors.email ? 'error' : ''}
                                    required
                                />
                                {this.state.errors.email && (
                                    <div className="field-error">{this.state.errors.email}</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">
                                    <i className="fa fa-phone"></i> Phone number <span className="required">*</span>
                                </label>
                                <input 
                                    type="tel" 
                                    id="phone"
                                    placeholder="Input phone number"
                                    value={this.state.txtPhone} 
                                    onChange={(e) => this.handleInputChange('txtPhone', e.target.value)}
                                    className={this.state.errors.phone ? 'error' : ''}
                                    required
                                />
                                {this.state.errors.phone && (
                                    <div className="field-error">{this.state.errors.phone}</div>
                                )}
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="signup-button"
                            disabled={this.state.loading}
                        >
                            {this.state.loading ? (
                                <span><i className="fa fa-spinner fa-spin"></i> Processing...</span>
                            ) : (
                                <span><i className="fa fa-user-plus"></i> Signup</span>
                            )}
                        </button>
                    </form>
                    
                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </div>
            </div>
        );
    }

    handleInputChange = (field, value) => {
        this.setState({ [field]: value }, () => {
            this.validateField(field, value);
        });
    }

    validateField = (field, value) => {
        let errors = {...this.state.errors};
        
        switch (field) {
            case 'txtUsername':
                errors.username = 
                    value.length < 3
                        ? 'Username must be at least 3 characters'
                        : '';
                break;
            case 'txtPassword':
                errors.password = 
                    value.length < 6
                        ? 'Password must be at least 6 characters'
                        : '';
                break;
            case 'txtEmail':
                errors.email = 
                    !this.validateEmail(value)
                        ? 'Email not valid'
                        : '';
                break;
            case 'txtPhone':
                errors.phone = 
                    !this.validatePhone(value)
                        ? 'Phone number not valid'
                        : '';
                break;
            case 'txtName':
                errors.name = 
                    value.length < 2
                        ? 'Full name must be at least 2 characters'
                        : '';
                break;
            default:
                break;
        }
        
        this.setState({ errors });
    }
    
    validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePhone = (phone) => {
        const re = /^[0-9]{10,11}$/;
        return re.test(phone);
    }

    validateForm = () => {
        let valid = true;
        const fields = ['txtUsername', 'txtPassword', 'txtName', 'txtPhone', 'txtEmail'];
        
        fields.forEach(field => {
            this.validateField(field, this.state[field]);
            if (this.state.errors[field.replace('txt', '').toLowerCase()]) {
                valid = false;
            }
        });
        
        return valid;
    }

    btnSignupClick(e) {
        e.preventDefault();
        
        this.setState({ 
            error: '', 
            success: '',
            loading: true 
        });
        
        if (this.validateForm()) {
            const account = {
                username: this.state.txtUsername.trim(),
                password: this.state.txtPassword.trim(),
                name: this.state.txtName.trim(),
                phone: this.state.txtPhone.trim(),
                email: this.state.txtEmail.trim()
            };
            
            this.apiSignup(account);
        } else {
            this.setState({ 
                error: 'Please fill in the information completely and correct the errors.',
                loading: false 
            });
        }
    }

    apiSignup(account) {
        axios.post('/api/customer/signup', account)
            .then((res) => {
                const result = res.data;
                if (result.success) {
                    this.setState({
                        txtUsername: '',
                        txtPassword: '',
                        txtName: '',
                        txtPhone: '',
                        txtEmail: '',
                        success: result.message || 'Registration successful! Please check your email to activate your account.',
                        loading: false
                    });
                } else {
                    this.setState({ 
                        error: result.message || 'Registration failed. Please try again.',
                        loading: false 
                    });
                }
            })
            .catch((error) => {
                this.setState({ 
                    error: 'Error connecting to server',
                    loading: false 
                });
                console.error('Signup error:', error);
            });
    }
}

export default Signup;