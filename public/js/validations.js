export function validateRegistrationFormPassword(password) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    if (password &&
        passwordRegex.test(password)) {

        return true;
    }

    return false;
}

export function validateRegistrationFormName(name) {
    const nameRegex = /^[a-z0-9_-]{3,50}$/;

    if (name &&
        nameRegex.test(name)) {

        return true;
    }

    return false;
}

