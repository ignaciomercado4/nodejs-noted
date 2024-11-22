import { DataTypes } from '@sequelize/core';
import { sequelize } from '../database.js';
import { User } from './User.js';

export const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50]
        }
    },
    body: {
        type: DataTypes.TEXT('long'),
        validate: {
            len: [1, 500]
        }
    },
}, {
    timestamps: true
});