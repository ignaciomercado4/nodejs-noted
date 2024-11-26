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
            },
            order: [['createdAt', 'DESC']]
        });

        res.render('partials/notes', {
            notes: createdNotes
        });
    } catch (error) {
        console.error('Error while loading created notes: ', error);
        res.status(500).render('partials/notes', {
            message: 'Failed to load notes'
        });
    }
});

//Creation
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { title, body } = req.body;

        if (!title || !body) {
            return res.status(400).render('partials/create', {
                message: 'Title and content are required'
            });
        }

        await Note.create({
            title: title,
            body: body,
            userId: req.session.user.id
        });

        res.redirect('/notes');
    } catch (error) {
        console.error('Error while creating a note: ', error);
        res.status(500).render('partials/create', {
            message: 'Failed to create note'
        });
    }
});

//View note
router.get('/note/:id', isAuthenticated, async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);

        if (isNaN(noteId)) {
            return res.status(400).redirect('/notes');
        }

        const selectedNote = await Note.findOne({
            where: {
                id: noteId,
                userId: req.session.user.id
            }
        });

        if (!selectedNote) {
            return res.status(404).redirect('/notes');
        }

        res.render('partials/viewNote', {
            note: selectedNote
        });
    } catch (error) {
        console.error('Error while viewing note: ', error);
        res.status(500).redirect('/notes');
    }
});

//Edit
router.post('/note/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);

        if (isNaN(noteId)) {
            return res.status(400).redirect('/notes');
        }

        const { title, body } = req.body;

        if (!title || !body) {
            return res.redirect(`/note/${noteId}`);
        }

        const selectedNote = await Note.findOne({
            where: {
                id: noteId,
                userId: req.session.user.id
            }
        });

        if (!selectedNote) {
            return res.status(404).redirect('/notes');
        }

        await selectedNote.update({
            title: title,
            body: body
        });

        res.redirect(`/note/${noteId}`);
    } catch (error) {
        console.error('Error while editing note: ', error);
        res.status(500).redirect('/notes');
    }
});

router.post('/note/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);

        if (isNaN(noteId)) {
            return res.status(400).redirect('/notes');
        }

        await Note.destroy({
            where: {
                id: noteId,
                userId: req.session.user.id
            }
        });

        res.redirect('/notes');
    } catch (error) {
        console.error('Error while deleting note:', error);
        res.status(500).redirect('/notes');
    }
});

export default router;