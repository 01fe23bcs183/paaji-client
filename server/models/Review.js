import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Product from './Product.js';

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    helpful: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['productId', 'userId']
        }
    ]
});

// Update product rating after review is created
Review.afterCreate(async (review) => {
    const reviews = await Review.findAll({
        where: { productId: review.productId, isApproved: true }
    });

    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product.update(
            {
                averageRating: Math.round(avgRating * 10) / 10,
                numReviews: reviews.length
            },
            { where: { id: review.productId } }
        );
    }
});

export default Review;
