//Imports
import express from 'express';
import session from 'express-session';
import miscRoutes from './routes/miscRoutes.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import { engine } from 'express-handlebars';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './database.js';
import { User } from './models/User.js';

//.env config
dotenv.config();

//Constants
const app = express();
const port = process.env.PORT || 3000;
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
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // = 24hs
    }
}));

//Method override
app.use(methodOverride('_method'));

//Routes setup
app.use(miscRoutes, userRoutes, noteRoutes);

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
