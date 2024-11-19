import { Sequelize } from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';

export const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: '../database.sqlite',
    pool: { idleTimeoutMillis: Infinity }
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to DB succesfully established.');
        await sequelize.sync({ alter: true });
        console.log('Models succesfully synced to DB.');
    } catch (error) {
        console.error('Error while connecting to DB:', error);
    }
};