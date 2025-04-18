import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../context/MyContext';
import '../App.css';

// Tạo component ProductCard riêng để tái sử dụng
class ProductCard extends Component {
  render() {
    const { product } = this.props;
    return (
      <div className="product-card">
        {product.isNew && <span className="badge new-badge">New</span>}
        {product.isHot && <span className="badge hot-badge">Hot</span>}
        <div className="product-img-container">
          <Link to={`/product/${product._id}`}>
            <img
              src={"data:image/jpg;base64," + product.image}
              alt={product.name}
              className="product-img"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            {product.discountPrice ? (
              <>
                <span className="discount-price">${product.discountPrice}</span>
                <span className="original-price">${product.price}</span>
              </>
            ) : (
              <span className="regular-price">${product.price}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
}

class Home extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      categories: [],
      selectedCategory: 'all',
      isLoading: true,
      error: null,
      searchTerm: '',
      currentPage: 1,
      productsPerPage: 8,
      sortBy: 'newest'
    };
  }
  componentDidMount() {
    this.apiGetCategories();
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  apiGetCategories() {
    axios.get('/api/customer/categories')
      .then(res => {
        this.setState({ categories: res.data });
      })
      .catch(err => {
        this.setState({ error: 'Failed to load categories' });
      });
  }

  apiGetNewProducts() {
    this.setState({ isLoading: true });
    axios.get('/api/customer/products/new')
      .then(res => {
        const result = res.data;
        // Mark these products as new
        const newProds = result.map(p => ({ ...p, isNew: true }));
        this.setState({ newprods: newProds, isLoading: false });
      })
      .catch(err => {
        this.setState({ 
          error: 'Failed to load new products', 
          isLoading: false 
        });
      });
  }

  apiGetHotProducts() {
    this.setState({ isLoading: true });
    axios.get('/api/customer/products/hot')
      .then(res => {
        const result = res.data;
        // Mark these products as hot
        const hotProds = result.map(p => ({ ...p, isHot: true }));
        this.setState({ hotprods: hotProds, isLoading: false });
      })
      .catch(err => {
        this.setState({ 
          error: 'Failed to load hot products', 
          isLoading: false 
        });
      });
  }

  handleAddToCart = (product, e) => {
    // Ngăn chặn hành vi mặc định nếu được gọi từ sự kiện
    if (e) e.preventDefault();
    
    console.log('Adding to cart:', product);
    
    // Lấy phương thức addToCart từ context
    const { addToCart } = this.context;
    
    // Thêm sản phẩm vào giỏ hàng (mặc định số lượng là 1)
    if (addToCart) {
      addToCart(product, 1);
      
      // Hiển thị thông báo
      this.showNotification(`${product.name} has been added to cart!`);
    } else {
      console.error('addToCart method not available in context');
    }
  }
  
  showNotification = (message) => {
    // Tạo phần tử thông báo
    const notification = document.createElement('div');
    notification.className = 'product-notification';
    notification.textContent = message;
    
    // Thêm vào DOM
    document.body.appendChild(notification);
    
    // Hiển thị animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Xóa sau 3 giây
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  handleSortChange = (e) => {
    this.setState({ sortBy: e.target.value });
  }

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  }

  filterProducts = (products) => {
    const { selectedCategory, searchTerm } = this.state;
    return products.filter(product => {
      // Filter by category
      const categoryMatch = selectedCategory === 'all' || 
        product.category?._id === selectedCategory;
      
      // Filter by search term
      const searchMatch = product.name.toLowerCase()
        .includes(searchTerm.toLowerCase());
        
      return categoryMatch && searchMatch;
    });
  }

  sortProducts = (products) => {
    const { sortBy } = this.state;
    
    switch(sortBy) {
      case 'priceAsc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'nameAsc':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
      default:
        return products;
    }
  }

  paginateProducts = (products) => {
    const { currentPage, productsPerPage } = this.state;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.slice(indexOfFirstProduct, indexOfLastProduct);
  }

  renderPagination = (filteredProducts) => {
    const { currentPage, productsPerPage } = this.state;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="pagination">
        <button 
          onClick={() => this.handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-btn"
        >
          &laquo;
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => this.handlePageChange(number)}
            className={currentPage === number ? 'page-btn active' : 'page-btn'}
          >
            {number}
          </button>
        ))}
        
        <button 
          onClick={() => this.handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="page-btn"
        >
          &raquo;
        </button>
      </div>
    );
  }

  renderProductGrid = (products, title) => {
    if (this.state.isLoading) {
      return (
        <div className="product-grid-loading">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="product-card skeleton"></div>
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return <p className="no-products">No products available.</p>;
    }

    const filteredProducts = this.filterProducts(products);
    const sortedProducts = this.sortProducts(filteredProducts);
    const paginatedProducts = this.paginateProducts(sortedProducts);

    return (
      <div className="product-section">
        <h2 className="section-title">{title}</h2>
        <div className="product-grid">
          {paginatedProducts.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={this.handleAddToCart}
            />
          ))}
        </div>
        {this.renderPagination(filteredProducts)}
      </div>
    );
  }

  render() {
    const { newprods, hotprods, categories, error } = this.state;
    
    // Combine all products for the filter section
    // const allProducts = [...newprods, ...hotprods.filter(hot => 
    //   !newprods.some(newP => newP._id === hot._id)
    // )];

    return (
      <div className="home-container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="filter-section">
          
          <div className="filter-options">
            <select 
              value={this.state.sortBy}
              onChange={this.handleSortChange}
              className="sort-filter"
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A-Z</option>
              <option value="nameDesc">Name: Z-A</option>
            </select>
          </div>
        </div>
        
        {this.renderProductGrid(newprods, "NEW PRODUCTS")}
        
        {hotprods.length > 0 && this.renderProductGrid(hotprods, "HOT PRODUCTS")}
      </div>
    );
  }
}

export default Home;