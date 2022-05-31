exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Le nom est obligatoire').notEmpty();
    req.check('email', 'L\'email est obligatoire').notEmpty();
    req.check('email', 'L\'email doit avoir entre 6 et 50 caractères !')
        .matches(/.+\@.+\..+/)
        .withMessage('L\'email doit avoir un @')
        .isLength({
            min: 6,
            max: 50
        });
    
    req.check('password', 'Le mot de passe est obligatoire.').notEmpty();
    req.check('password')
        .isLength({ min:7 })
        .withMessage('Le mot de passe doit contenir au moins 7 caractères.')
        .matches(/\d/)
        .withMessage('Le mot de passe doit contenir au moins un chiffre.');

        const errors = req.validationErrors();
        if (errors) {
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({ error: firstError });
        }
        next();
    }