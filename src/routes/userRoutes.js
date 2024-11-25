/*
Here are the registration, sign in & sign out routes + authentication
 */

import express from 'express';
import { User } from '../models/User.js';
import { validateRegistrationFormPassword, validateRegistrationFormName } from '../../public/js/validations.js';
import { isAuthenticated } from '../../public/js/auth.js';
import session from 'express-session';

const router = express.Router();

//Registration
router.get('/register', (req, res) => {
    res.render('partials/registerForm');
});

router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;
        let errors = [];

        if (!validateRegistrationFormName(name)) {
            errors.push("Your username can be 3-50 chars long and have only lowercase, uppercase letters and numbers, includind '-' or '_'.");
        }

        if (!validateRegistrationFormPassword(password)) {
            errors.push("You password shoulf have a minimum of eight characters, at least one upper case English letter, one lower case English letter, one number and one special character.");
        }

        if (errors.length === 0) {
            await User.create({
                name: name,
                password: password
            });

            const newUser = await User.findAll({
                where: {
                    name: name,
                }
            });

            req.session.isAuthenticated = true;
            req.session.user = {
                id: newUser.id,
                name: name
            };

            res.redirect('/notes');
        } else {
            res.render('partials/registerForm', {
                errors: errors
            });
        }

    } catch (error) {
        console.log('Error while creating a new User:', error);
    }
});


//Log in
router.get('/login', (req, res) => {
    try {
        res.render('partials/login');
    } catch (error) {
        console.log('Error while rendering login template:', error);
    }
});

router.post('/verifyLogin', async (req, res) => {
    try {
        const { name, password } = req.body;
        let error;

        const user = await User.findOne({
            where: { name: name }
        });

        if (!user) {
            error = 'User not found, please verify your credentials';

            return res.render('partials/login', {
                error: error
            });
        }

        if (user.password !== password) {
            error = 'Wrong credentials, please verify.';

            return res.render('partials/login', {
                error: error
            });
        }

        req.session.isAuthenticated = true;
        req.session.user = {
            id: user.id,
            name: user.name
        };

        return res.redirect('/notes');

    } catch (error) {
        console.log('Error in log in POST route:', error);
    }
});


//Log out
router.get('/logout', isAuthenticated, (req, res) => {
    try {
        req.session.destroy((error) => {
            if (error) {
                console.error('Error while destroying session:', error);
                return res.status(500).json({ error: 'Failed to logout' });
            }

            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error while accessing log out route:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
});


export default router;