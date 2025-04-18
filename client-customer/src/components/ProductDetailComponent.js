import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../context/MyContext';
import '../App.css'; // Import CSS riêng

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            quantity: 1,
            loading: true,
            error: null,
            activeTab: 'description',
            relatedProducts: []
        };
    }

    static contextType = MyContext;

    handleQuantityChange = (e) => {
        this.setState({ quantity: parseInt(e.target.value, 10) });
    }

    increaseQuantity = () => {
        this.setState(prevState => ({
            quantity: prevState.quantity + 1
        }));
    }

    decreaseQuantity = () => {
        if (this.state.quantity > 1) {
            this.setState(prevState => ({
                quantity: prevState.quantity - 1
            }));
        }
    }

    handleAddToCart = (e) => {
        e.preventDefault();
        const { product, quantity } = this.state;
        if (!product) return;
        
        const { addToCart } = this.context;
        addToCart(product, quantity);
        
        // Thay thông báo alert bằng thông báo trực quan hơn
        this.showNotification(`${product.name} has been added to cart!`);
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

    setActiveTab = (tab) => {
        this.setState({ activeTab: tab });
    }

    render() {
        const { product, quantity, loading, error, activeTab } = this.state;

        if (loading && !product) {
            return (
                <div className="product-detail-container">
                    <div className="product-detail-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading product information...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="product-detail-container">
                    <div className="product-detail-error">
                        <p>An error occurred: {error}</p>
                        <button onClick={() => window.location.reload()}>Retry</button>
                    </div>
                </div>
            );
        }

        if (!product) {
            return <div />;
        }

        return (
            <div className="product-detail-container">
                <div className="product-detail-breadcrumb">
                    <span>Home</span> &gt; 
                    <span>{product.category.name}</span> &gt; 
                    <span className="current">{product.name}</span>
                </div>

                <div className="product-detail-content">
                    {/* Cột hình ảnh sản phẩm */}
                    <div className="product-detail-image">
                        <div className="main-image-container">
                            <img
                                src={"data:image/jpg;base64," + product.image}
                                alt={product.name}
                                className="main-image"
                            />
                            {product.isNew && <span className="product-badge new-badge">New</span>}
                            {product.isHot && <span className="product-badge hot-badge">Hot</span>}
                        </div>
                    </div>

                    {/* Cột thông tin sản phẩm */}
                    <div className="product-detail-info">
                        <h1 className="product-name">{product.name}</h1>
                        
                        <div className="product-meta">
                            <span className="product-id">ID: {product._id}</span>
                            <span className="product-category">Category: {product.category.name}</span>
                            {/* {product.inStock ? (
                                <span className="product-stock in-stock">Còn hàng</span>
                            ) : (
                                <span className="product-stock out-stock">Hết hàng</span>
                            )} */}
                        </div>

                        <div className="product-price">
                            {product.discountPrice ? (
                                <>
                                    <span className="discount-price">${product.discountPrice}</span>
                                    <span className="original-price">${product.price}</span>
                                    <span className="discount-percent">
                                        -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                                    </span>
                                </>
                            ) : (
                                <span className="regular-price">${product.price}</span>
                            )}
                        </div>

                        <form className="add-to-cart-form" onSubmit={this.handleAddToCart}>
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="quantity-controls">
                                    <button 
                                        type="button" 
                                        className="quantity-btn" 
                                        onClick={this.decreaseQuantity}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={quantity}
                                        onChange={this.handleQuantityChange}
                                        className="quantity-input"
                                    />
                                    <button 
                                        type="button" 
                                        className="quantity-btn" 
                                        onClick={this.increaseQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button type="submit" className="add-to-cart-button">
                                    <i className="cart-icon">🛒</i> Add to cart
                                </button>
                                <button type="button" className="buy-now-button">
                                    Buy now
                                </button>
                            </div>
                        </form>

                        <div className="product-extra-info">
                            <div className="info-item">
                                <i className="icon">🚚</i>
                                <span>Free shipping on orders over $100</span>
                            </div>
                            <div className="info-item">
                                <i className="icon">🔄</i>
                                <span>Free returns within 30 days</span>
                            </div>
                            <div className="info-item">
                                <i className="icon">🛡️</i>
                                <span>12 month genuine warranty</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin chi tiết sản phẩm với tabs */}
                <div className="product-detail-tabs">
                    <div className="tabs-header">
                        <button 
                            className={activeTab === 'description' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => this.setActiveTab('description')}
                        >
                            Specifications
                        </button>
                        <button 
                            className={activeTab === 'specs' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => this.setActiveTab('specs')}
                            >
                            Description
                        </button>
                        <button 
                            className={activeTab === 'reviews' ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => this.setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </div>
                    
                    <div className="tabs-content">
                        {activeTab === 'description' && (
                            <div className="tab-panel description-panel">
                                <p>{product.detailedDescription || 'Product details...'}</p>
                            </div>
                        )}
                        
                        {activeTab === 'specs' && (
                            <div className="tab-panel specs-panel">
                                <table className="specs-table">
                                    <tbody>
                                        <tr>
                                            <td>ID</td>
                                            <td>{product._id}</td>
                                        </tr>
                                        <tr>
                                            <td>Product name</td>
                                            <td>{product.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Price</td>
                                            <td>${product.price}</td>
                                        </tr>
                                        <tr>
                                            <td>Category</td>
                                            <td>{product.category.name}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {activeTab === 'reviews' && (
                            <div className="tab-panel reviews-panel">
                                <div className="reviews-summary">
                                    <div className="rating-summary">
                                        <div className="average-rating">
                                            <span className="rating-value">{product.rating || 0}</span>
                                            <div className="stars">
                                                {[...Array(5)].map((_, index) => (
                                                    <span key={index} className={index < (product.rating || 0) ? "star filled" : "star"}>★</span>
                                                ))}
                                            </div>
                                            <span className="total-reviews">Based on {product.ratingCount || 0} reviews</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="reviews-list">
                                    {(product.reviews?.length > 0) ? (
                                        product.reviews.map((review, index) => (
                                            <div key={index} className="review-item">
                                                <div className="review-header">
                                                    <span className="reviewer-name">{review.userName}</span>
                                                    <div className="review-rating">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                                                        ))}
                                                    </div>
                                                    <span className="review-date">{review.date}</span>
                                                </div>
                                                <div className="review-content">
                                                    <p>{review.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-reviews">There are no reviews for this product yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    apiGetProduct(id) {
        this.setState({ loading: true, error: null });
        axios.get('/api/customer/products/' + id)
            .then((res) => {
                const result = res.data;
                this.setState({ 
                    product: result,
                    loading: false
                });
                
                // Lấy sản phẩm liên quan từ cùng một danh mục
                if (result && result.category) {
                    this.getRelatedProducts(result.category._id, result._id);
                }
            })
            .catch(err => {
                this.setState({ 
                    loading: false, 
                    error: 'Không thể tải thông tin sản phẩm'
                });
            });
    }

    getRelatedProducts(categoryId, currentProductId) {
        axios.get(`/api/customer/products/category/${categoryId}`)
            .then(res => {
                // Lọc ra sản phẩm hiện tại
                const relatedProducts = res.data.filter(prod => prod._id !== currentProductId);
                this.setState({ relatedProducts: relatedProducts.slice(0, 4) }); // Chỉ lấy 4 sản phẩm liên quan
            })
            .catch(err => {
                console.error('Failed to load related products', err);
            });
    }
}

export default withRouter(ProductDetail);