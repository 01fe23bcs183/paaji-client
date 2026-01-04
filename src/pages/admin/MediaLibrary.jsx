import { useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FiImage, FiTrash2 } from 'react-icons/fi';

const MediaLibrary = () => {
    const { media, uploadMedia, removeMedia, loadAdminData } = useAdmin();

    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        await uploadMedia(file, { type: 'general' });
    };

    return (
        <div>
            <div className="admin-header">
                <div className="admin-header-top">
                    <div>
                        <h1 className="admin-page-title">Media Library</h1>
                        <div className="admin-breadcrumb">
                            <span>Admin</span>
                            <span className="admin-breadcrumb-separator">/</span>
                            <span>Media</span>
                        </div>
                    </div>
                    <div className="admin-header-actions">
                        <label htmlFor="mediaUpload" className="btn btn-primary" style={{ cursor: 'pointer', margin: 0 }}>
                            <FiImage /> Upload Media
                        </label>
                        <input
                            type="file"
                            id="mediaUpload"
                            accept="image/*,video/*"
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>

            {media.length > 0 ? (
                <div className="admin-media-library-grid">
                    {media.map((item) => (
                        <div key={item.id} className="admin-media-library-item">
                            <div className="admin-media-library-preview">
                                {item.type === 'video' ? (
                                    <video src={item.data} controls />
                                ) : (
                                    <img src={item.data} alt={item.name} />
                                )}
                            </div>
                            <div className="admin-media-library-info">
                                <p className="text-tiny" style={{ marginBottom: 0, wordBreak: 'break-all' }}>
                                    {item.name}
                                </p>
                            </div>
                            <button
                                onClick={() => removeMedia(item.id)}
                                className="admin-media-library-delete"
                                title="Delete"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                    <FiImage size={64} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', display: 'block', margin: '0 auto var(--spacing-md)' }} />
                    <h3>No Media Files Yet</h3>
                    <p className="text-muted mb-lg">Upload images and videos for your products</p>
                    <label htmlFor="mediaUploadEmpty" className="btn btn-primary" style={{ cursor: 'pointer' }}>
                        <FiImage /> Upload First File
                    </label>
                    <input
                        type="file"
                        id="mediaUploadEmpty"
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        style={{ display: 'none' }}
                    />
                </div>
            )}
        </div>
    );
};

export default MediaLibrary;
