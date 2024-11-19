import express from 'express';
import testRoutes from './testRoutes.js';

const app = express();
const port = 3000;

app.use(testRoutes);

app.listen(port, () => {
    console.log('App listening on port ', port);
});


