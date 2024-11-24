/*
In this file you can find routes I was too lazy to look up 
how to classify
*/

import express from 'express';
import { isAuthenticated } from '../../public/js/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        res.render('partials/home');
    } catch (error) {
        console.log('Error while rendering home template:', error);
    }
});

export default router;