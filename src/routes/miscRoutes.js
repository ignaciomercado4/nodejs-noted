/*
In this file you can find routes I was too lazy to look up 
how to classify
*/

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('partials/home');
});

export default router;