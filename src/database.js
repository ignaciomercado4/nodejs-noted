import { Sequelize } from '@sequelize/core';
import { SqliteDialect } from '@sequelize/sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const sequelize = new Sequelize({
    dialect: SqliteDialect,
    storage: join(__dirname, '..', 'database.sqlite')
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to DB succesfully established.');
        await sequelize.sync({ alter: true });
        console.log('Models succesfully synced to DB.');
    } catch (error) {
        console.error('Error while connecting to DB:', error);
    }
};

testConnection();