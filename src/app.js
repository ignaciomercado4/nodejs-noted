//Imports
import express from 'express';
import testRoutes from './routes/miscRoutes.js';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sequelize, testConnection } from './database.js';
import { initUser } from './models/User.js';

//Constants
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

//Rendering enging configuration
app.set('views', join(__dirname, 'views'));

app.engine('.hbs', engine({
    defaultLayout: 'mainLayout',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

//Routes setup
app.use(testRoutes);

//DB sync
sequelize.sync().then(() => {
    console.log('DB synced.');
}).catch((error) => {
    console.error('Error while syncing DB:', error);
});

//Model inits
initUser();

//DB connection test
await testConnection();


app.listen(port, () => {
    console.log('App listening on port ', port);
});

export default app;