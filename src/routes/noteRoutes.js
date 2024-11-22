/*
Here are stored all Note creation routes, from creation to deletion.
*/
import express from 'express';
import { isAuthenticated } from '../../public/js/auth.js';
import { Note } from '../models/Note.js';

const router = express.Router();

//View notes
router.get('/notes', isAuthenticated, async (req, res) => {
    try {

        const createdNotes = await Note.findAll({
            where: {
                userId: req.session.user.id
            }
        });

        res.render('partials/notes', {
            notes: createdNotes
        });
    } catch (error) {
        console.log('Error while loading created notes: ', error);
    }
});

//Creation
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { title, body } = req.body;

        await Note.create({
            title: title,
            body: body,
            userId: req.session.user.id
        });


    } catch (error) {
        console.log('Error while creating a note: ', error);
    }
});

export default router;