/*
Here are the registration, sign in & sign out routes + authentication
 */

import express from 'express';
import { User } from '../models/User.js';
import { validateRegistrationFormPassword, validateRegistrationFormName } from '../../public/js/validations.js';

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

            res.redirect('/');
        } else {
            res.render('partials/registerForm', {
                errors: errors
            });
        }

    } catch (error) {
        console.log('Error while creating a new User:', error);
    }
});

export default router;