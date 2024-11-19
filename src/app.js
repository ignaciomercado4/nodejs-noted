//Imports
import express from 'express';
import bodyParser from 'body-parser';
import miscRoutes from './routes/miscRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './database.js';
import { User } from './models/User.js';

//Constants
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

//Rendering engine configuration
app.set('views', join(__dirname, 'views'));

app.engine('.hbs', engine({
    defaultLayout: 'mainLayout',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

//Configures req.body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes setup
app.use(miscRoutes, userRoutes);

//DB sync
const initDB = async () => {
    try {
        await sequelize.sync();
        console.log('DB synced.');
    } catch (error) {
        console.error('Error while syncing DB:', error);
    }
};

initDB().then(() => {
    app.listen(port, () => {
        console.log('App listening on port ', port);
    });
});
