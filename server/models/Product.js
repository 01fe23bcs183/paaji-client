import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a product name' }
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    comparePrice: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
            min: 0
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    video: {
        type: DataTypes.STRING
    },
    variants: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'other'
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    averageRating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ingredients: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    howToUse: {
        type: DataTypes.TEXT
    },
    benefits: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    seoTitle: {
        type: DataTypes.STRING
    },
    seoDescription: {
        type: DataTypes.TEXT
    },
    seoKeywords: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'products',
    timestamps: true
});

// Virtual field for discount percentage
Product.prototype.getDiscountPercentage = function () {
    if (this.comparePrice && this.comparePrice > this.price) {
        return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
    }
    return 0;
};

export default Product;
