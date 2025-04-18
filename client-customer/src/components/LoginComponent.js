import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../context/MyContext';
import withRouter from '../utils/withRouter';
import '../App.css';

class Login extends Component {
    static contextType = MyContext;
    
    constructor(props) {
        super(props);
        this.state = {
            txtUsername: '',
            txtPassword: '',
            loading: false,
            error: '',
            rememberMe: false
        };
    }

    render() {
        return (
            <div className="login-container">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2>Login</h2>
                        <p>Please login to continue shopping</p>
                    </div>
                    
                    {this.state.error && (
                        <div className="login-error">
                            <i className="fa fa-exclamation-circle"></i> {this.state.error}
                        </div>
                    )}
                    
                    <form className="login-form" onSubmit={(e) => this.btnLoginClick(e)}>
                        <div className="form-group">
                            <label htmlFor="username">
                                <i className="fa fa-user"></i> Username
                            </label>
                            <input 
                                type="text" 
                                id="username"
                                placeholder="Input username"
                                value={this.state.txtUsername} 
                                onChange={(e) => this.setState({ txtUsername: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">
                                <i className="fa fa-lock"></i> Password
                            </label>
                            <input 
                                type="password" 
                                id="password"
                                placeholder="Input password"
                                value={this.state.txtPassword} 
                                onChange={(e) => this.setState({ txtPassword: e.target.value })}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={this.state.loading}
                        >
                            {this.state.loading ? (
                                <span><i className="fa fa-spinner fa-spin"></i> Processing...</span>
                            ) : (
                                <span><i className="fa fa-sign-in"></i> Login</span>
                            )}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
                        
                        <div className="social-login">
                            <p>Or login with</p>
                            <div className="social-buttons">
                                <button className="social-button facebook">
                                    <i className="fa fa-facebook"></i>
                                </button>
                                <button className="social-button google">
                                    <i className="fa fa-google"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    btnLoginClick(e) {
        e.preventDefault();
        const { txtUsername, txtPassword } = this.state;
        
        // Xóa thông báo lỗi cũ
        this.setState({ error: '', loading: true });
        
        if (txtUsername && txtPassword) {
            const account = { 
                username: txtUsername.trim(), 
                password: txtPassword.trim() 
            };
            this.apiLogin(account);
        } else {
            this.setState({ 
                error: 'Please enter your username and password',
                loading: false
            });
        }
    }

    apiLogin(account) {
        axios.post('/api/customer/login', account)
            .then((res) => {
                const result = res.data;
                if (result.success === true) {
                    // Lưu thông tin đăng nhập nếu chọn "Remember Me"
                    if (this.state.rememberMe) {
                        localStorage.setItem('savedUsername', account.username);
                    } else {
                        localStorage.removeItem('savedUsername');
                    }
                    
                    this.context.setToken(result.token);
                    this.context.setCustomer(result.customer);
                    this.props.navigate('/home');
                } else {
                    this.setState({ 
                        error: result.message || 'Login failed',
                        loading: false
                    });
                }
            })
            .catch((error) => {
                this.setState({ 
                    error: 'Error connecting to server',
                    loading: false
                });
                console.error('Login error:', error);
            });
    }

    // componentDidMount() {
    //     // Kiểm tra xem có username đã lưu không
    //     const savedUsername = localStorage.getItem('savedUsername');
    //     if (savedUsername) {
    //         this.setState({ 
    //             txtUsername: savedUsername,
    //             rememberMe: true
    //         });
    //         // Focus vào trường mật khẩu
    //         document.getElementById('password')?.focus();
    //     } else {
    //         // Focus vào trường username
    //         document.getElementById('username')?.focus();
    //     }
    // }
}

export default withRouter(Login);