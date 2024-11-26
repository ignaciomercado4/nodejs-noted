import express from 'express';
import { User } from '../models/User.js';
import { validateRegistrationFormPassword, validateRegistrationFormName } from '../../public/js/validations.js';
import { isAuthenticated } from '../../public/js/auth.js';
import session from 'express-session';
import bcrypt from 'bcrypt';

const router = express.Router();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

//Registration
router.get('/register', (req, res) => {
    try {
        res.render('partials/registerForm');
    } catch (error) {
        console.log('Error while loading registration form:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;
        let errors = [];

        if (!validateRegistrationFormName(name)) {
            errors.push("Your username can be 3-50 chars long and have only lowercase, uppercase letters and numbers, including '-' or '_'.");
        }

        if (!validateRegistrationFormPassword(password)) {
            errors.push("Your password should have a minimum of eight characters, at least one upper case English letter, one lower case English letter, one number and one special character.");
        }

        if (errors.length === 0) {
            const existingUser = await User.findOne({
                where: { name: name }
            });

            if (existingUser) {
                errors.push("Username already exists");
                return res.render('partials/registerForm', {
                    errors: errors
                });
            }

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const newUser = await User.create({
                name: name,
                password: hashedPassword
            });

            // Set up session
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

        res.render('partials/registerForm', {
            errors: ["Username or password not meet the requirements!", "Your username can be 3-50 chars long and have only lowercase, uppercase letters and numbers, including '-' or '_'.", "Your password should have a minimum of eight characters, at least one upper case English letter, one lower case English letter, one number and one special character."]
        });
    }
});

//Log in
router.get('/login', (req, res) => {
    try {
        res.render('partials/login');
    } catch (error) {
        console.log('Error while rendering login template:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/verifyLogin', async (req, res) => {
    try {
        const { name, password } = req.body;
        let errors = [];

        const user = await User.findOne({
            where: { name: name }
        });

        if (!user) {
            errors.push('User not found, please verify your credentials');

            return res.render('partials/login', {
                errors: errors
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            errors.push('Wrong credentials, please verify.');

            return res.render('partials/login', {
                error: errors
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
        res.render('partials/login', {
            errors: ["Unexpected error. Verify your credentials."]
        });
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