import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide a name' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Please provide a valid email' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 100],
                msg: 'Password must be at least 6 characters'
            }
        }
    },
    phone: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('customer', 'admin'),
        defaultValue: 'customer'
    },
    addresses: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    wishlist: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    cart: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: {
        type: DataTypes.STRING
    },
    resetPasswordToken: {
        type: DataTypes.STRING
    },
    resetPasswordExpire: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'users',
    timestamps: true
});

// Hash password before saving
User.beforeSave(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user without password
User.prototype.toSafeObject = function () {
    const { password, ...safeUser } = this.toJSON();
    return safeUser;
};

export default User;
