import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import MyContext from '../context/MyContext';
import '../App.css';

// Reuse the ProductCard component from HomeComponent
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
          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={(e) => {e.preventDefault(); this.props.onAddToCart(product)}}>
              Add to Cart
            </button>
          </div>
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

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      selectedCategory: 'all',
      isLoading: true,
      error: null,
      searchTerm: '',
      currentPage: 1,
      productsPerPage: 8,
      sortBy: 'newest',
      categoryName: ''
    };
  }

  componentDidMount() {
    this.apiGetCategories();
    // Check if we're searching by category or keyword
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
      this.setState({ selectedCategory: params.cid });
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
      this.setState({ searchTerm: params.keyword });
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
      this.setState({ selectedCategory: params.cid, currentPage: 1 });
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
      this.setState({ searchTerm: params.keyword, currentPage: 1 });
    }
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

  apiGetProductsByCatID(cid) {
    this.setState({ isLoading: true });
    axios.get('/api/customer/products/category/' + cid)
      .then((res) => {
        const result = res.data;
        // Find category name for the title
        const category = this.state.categories.find(cat => cat._id === cid);
        this.setState({ 
          products: result, 
          isLoading: false,
          categoryName: category ? category.name : 'Category Products'
        });
      })
      .catch(err => {
        this.setState({ 
          error: 'Failed to load products', 
          isLoading: false 
        });
      });
  }

  apiGetProductsByKeyword(keyword) {
    this.setState({ isLoading: true });
    axios.get('/api/customer/products/search/' + keyword)
      .then((res) => {
        const result = res.data;
        this.setState({ 
          products: result, 
          isLoading: false,
          categoryName: `Search Results for "${keyword}"`
        });
      })
      .catch(err => {
        this.setState({ 
          error: 'Failed to load products', 
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
    const { searchTerm } = this.state;
    // If we're already on a category page or search results page,
    // we just filter by the search term within these results
    return products.filter(product => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
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

  render() {
    const { products, categories, error, isLoading, categoryName } = this.state;
    
    // Filter, sort and paginate the products
    const filteredProducts = this.filterProducts(products);
    const sortedProducts = this.sortProducts(filteredProducts);
    const paginatedProducts = this.paginateProducts(sortedProducts);

    // Determine the title based on the context
    const title = categoryName || "PRODUCTS";

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
        
        <div className="product-section">
          <h2 className="section-title">{title}</h2>
          
          {isLoading ? (
            <div className="product-grid-loading">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="product-card skeleton"></div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <p className="no-products">No products available.</p>
          ) : (
            <div className="product-grid">
              {paginatedProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onAddToCart={this.handleAddToCart}
                />
              ))}
            </div>
          )}
          
          {this.renderPagination(filteredProducts)}
        </div>
      </div>
    );
  }
}

export default withRouter(Product);