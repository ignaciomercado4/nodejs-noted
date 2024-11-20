/*
Method to verify if a session is authenticated.
*/

export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }

    res.redirect('/login');
};
