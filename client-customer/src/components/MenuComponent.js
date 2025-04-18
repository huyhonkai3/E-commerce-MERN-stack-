// src/components/MenuComponent.js
import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import MyContext from '../context/MyContext';
import '../App.css';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtKeyword: '',
            menuOpen: false,
            currentPath: window.location.pathname
        };
    }

    static contextType = MyContext;

    toggleMenu = () => {
        this.setState(prevState => ({
            menuOpen: !prevState.menuOpen
        }));
    }

    isActive = (path) => {
        return this.state.currentPath.includes(path);
    }

    render() {
        // Lấy thông tin số lượng giỏ hàng từ context
        const { cartCount } = this.context;

        const cates = this.state.categories.map((item) => {
            const categoryPath = `/product/category/${item._id}`;
            const isActive = this.state.currentPath.includes(categoryPath);
            
            return (
                <li key={item._id} className="nav-item">
                    <Link 
                        className={`nav-link ${isActive ? 'active' : ''}`} 
                        to={categoryPath}
                        onClick={() => this.handleNavClick(categoryPath)}
                    >
                        {item.name}
                    </Link>
                </li>
            );
        });

        const isHomeActive = this.state.currentPath === '/';

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img 
                            src={`${process.env.PUBLIC_URL}/images/bct.png`}
                            width="60px" 
                            height="60px" 
                            alt="Pic"
                        />
                    </Link>
                    <button 
                        className={`navbar-toggler ${this.state.menuOpen ? '' : 'collapsed'}`}
                        type="button" 
                        onClick={this.toggleMenu}
                        aria-expanded={this.state.menuOpen ? 'true' : 'false'}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className={`collapse navbar-collapse ${this.state.menuOpen ? 'show' : ''}`} id="navbarContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${isHomeActive ? 'active' : ''}`} 
                                    to="/"
                                    onClick={() => this.handleNavClick('/')}
                                >
                                    Home
                                </Link>
                            </li>
                            {cates}
                        </ul>
                        
                        <form className="d-flex search-form" onSubmit={(e) => this.btnSearchClick(e)}>
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Search for products..." 
                                aria-label="Search"
                                value={this.state.txtKeyword}
                                onChange={(e) => { this.setState({ txtKeyword: e.target.value }) }}
                            />
                            <button className="btn btn-outline-success" type="submit">
                                <i className="fa fa-search"></i> Search
                            </button>
                        </form>
                        
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 nav-icons">
                            <li className="nav-item">
                                <Link className="nav-link cart-link" to="/cart">
                                    <i className="fa fa-shopping-cart"></i>
                                    {cartCount > 0 && (
                                        <span className="cart-badge">{cartCount}</span>
                                    )}
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to="/account">
                                    <i className="fa fa-user"></i>
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

    handleNavClick = (path) => {
        this.setState({ 
            currentPath: path,
            menuOpen: false
        });
    }

    componentDidMount() {
        this.apiGetCategories();
        window.addEventListener('popstate', this.handleRouteChange);
    }
    
    componentWillUnmount() {
        window.removeEventListener('popstate', this.handleRouteChange);
    }

    handleRouteChange = () => {
        this.setState({ currentPath: window.location.pathname });
    }

    apiGetCategories() {
        axios.get('/api/customer/categories')
            .then((res) => {
                const result = res.data;
                this.setState({ categories: result });
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }

    btnSearchClick(e) {
        e.preventDefault();
        if (this.state.txtKeyword.trim()) {
            const searchPath = '/product/search/' + this.state.txtKeyword;
            this.props.navigate(searchPath);
            this.setState({ 
                currentPath: searchPath,
                menuOpen: false
            });
        }
    }
}

export default withRouter(Menu);