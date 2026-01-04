import { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../services/payments';
import { FiPlus, FiEdit, FiTrash2, FiX, FiImage } from 'react-icons/fi';

const Products = () => {
    const { products, addNewProduct, editProduct, removeProduct, uploadMedia, loadAdminData } = useAdmin();

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        comparePrice: '',
        stock: '',
        featured: false,
        images: [],
        video: '',
        variants: []
    });
    const [variantName, setVariantName] = useState('');
    const [variantPrice, setVariantPrice] = useState('');
    const [variantStock, setVariantStock] = useState('');
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                description: product.description || '',
                price: product.price,
                comparePrice: product.comparePrice || '',
                stock: product.stock,
                featured: product.featured || false,
                images: product.images || [],
                video: product.video || '',
                variants: product.variants || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                price: '',
                comparePrice: '',
                stock: '',
                featured: false,
                images: [],
                video: '',
                variants: []
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const result = await uploadMedia(file, { type: 'product' });
            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, result.media.data]
                }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleAddVariant = () => {
        if (!variantName || !variantPrice || !variantStock) return;

        setFormData(prev => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    name: variantName,
                    price: parseFloat(variantPrice),
                    stock: parseInt(variantStock)
                }
            ]
        }));

        setVariantName('');
        setVariantPrice('');
        setVariantStock('');
    };

    const handleRemoveVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
                stock: parseInt(formData.stock)
            };

            let result;
            if (editingProduct) {
                result = await editProduct(editingProduct.id, productData);
            } else {
                result = await addNewProduct(productData);
            }

            if (result.success) {
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        await removeProduct(productId);
    };

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Products</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Products</span>
                        </div>
                    </div>
                    <div className="admin-header-actions">
                        <button onClick={() => handleOpenModal()} className="btn btn-primary">
                            <FiPlus /> Add Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
                {products.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                                {product.images && product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                                        {product.name.substring(0, 2)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{product.name}</p>
                                                <p className="text-tiny text-muted" style={{ marginBottom: 0 }}>{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <p className="text-small" style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{formatCurrency(product.price)}</p>
                                            {product.comparePrice && (
                                                <p className="text-tiny text-muted" style={{ textDecoration: 'line-through', marginBottom: 0 }}>
                                                    {formatCurrency(product.comparePrice)}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                backgroundColor: product.stock === 0 ? 'var(--color-error)' :
                                                    product.stock < 10 ? 'var(--color-warning)' : 'var(--color-success)',
                                                color: 'white'
                                            }}
                                        >
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${product.featured ? 'badge-primary' : ''}`} style={{ backgroundColor: product.featured ? 'var(--color-primary)' : 'var(--color-text-muted)', color: 'white' }}>
                                            {product.featured ? 'Featured' : 'Regular'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="admin-table-action-btn"
                                                title="Edit"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="admin-table-action-btn danger"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                        <FiImage size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }} />
                        <h3>No Products Yet</h3>
                        <p className="text-muted mb-lg">Start by adding your first product</p>
                        <button onClick={() => handleOpenModal()} className="btn btn-primary">
                            <FiPlus /> Add First Product
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={handleCloseModal} className="modal-close">
                                <FiX />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="admin-form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Product Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Slug *</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            className="form-input"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                    />
                                </div>

                                <div className="admin-form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Price (₹) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="1"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Compare Price (₹)</label>
                                        <input
                                            type="number"
                                            name="comparePrice"
                                            className="form-input"
                                            value={formData.comparePrice}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Stock *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-input"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                        />
                                        <span>Featured Product</span>
                                    </label>
                                </div>

                                {/* Images */}
                                <div className="form-group">
                                    <label className="form-label">Product Images</label>
                                    <div className="image-uploader">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            id="productImage"
                                        />
                                        <label htmlFor="productImage" style={{ cursor: 'pointer', display: 'block' }}>
                                            <div className="image-uploader-icon">📷</div>
                                            <p className="image-uploader-text">Click to upload product images</p>
                                            <p className="image-uploader-hint">PNG, JPG up to 5MB</p>
                                        </label>
                                    </div>

                                    {formData.images.length > 0 && (
                                        <div className="image-preview-grid">
                                            {formData.images.map((image, index) => (
                                                <div key={index} className="image-preview-item">
                                                    <img src={image} alt={`Product ${index + 1}`} />
                                                    <button
                                                        type="button"
                                                        className="image-preview-remove"
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Variants */}
                                <div className="form-group">
                                    <label className="form-label">Product Variants</label>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Variant name (e.g., 100ml)"
                                            value={variantName}
                                            onChange={(e) => setVariantName(e.target.value)}
                                            style={{ flex: 2 }}
                                        />
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Price"
                                            value={variantPrice}
                                            onChange={(e) => setVariantPrice(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Stock"
                                            value={variantStock}
                                            onChange={(e) => setVariantStock(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddVariant}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <FiPlus /> Add
                                        </button>
                                    </div>

                                    {formData.variants.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                            {formData.variants.map((variant, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: 'var(--spacing-sm)',
                                                        background: 'var(--color-background-alt)',
                                                        borderRadius: 'var(--radius-md)'
                                                    }}
                                                >
                                                    <span className="text-small">
                                                        {variant.name} - {formatCurrency(variant.price)} ({variant.stock} in stock)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariant(index)}
                                                        className="btn btn-ghost btn-sm btn-icon"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
