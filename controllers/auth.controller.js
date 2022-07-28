const User = require('../models/user.model');
const jsonwebtoken = require('jsonwebtoken'); // Pour générer un token après connexion
var { expressjwt: jwt } = require("express-jwt");  // Pour vérifier les autorisation
// const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = async(req, res) => {
    try {
        const { email } = new User(req.body);
    
        let user = await User.findOne({ email });
        if (user) return res.status(400).send("Cet email existe déjà !");
    
        user = new User(req.body);
        await user.save();
    
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).send("Une erreur s'est produite lors de votre inscription.");
    }
};

exports.signin = (req, res) => {
    // Trouver un utilisateur dont on connaît l'email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: 'Il n y a pas d\'utilisateur avec cet email. Veuillez vous inscrire !'
            });
        }
        // S'il l'utilisateur existe, il faudra vérifier qu'il matche avec le mot de passe.

        // Créer la méthode authenticate dans le model User
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'L\'email et le mot de passe ne concordent pas.'
            });
        }
        // Générer un token à l'utilisateur authentifié (en fonction de son id et son secret)
        const token = jsonwebtoken.sign({ _id: user.id }, process.env.JWT_SECRET);
        // Mettre le toke. dans la variable t dans les cookies avec date d'expiration.
        res.cookie('t', token, { expire: new Date() + 9999 });
        // Envoyer à la partie front l'utilisateur et son token
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: "Déconnexion réussie !" })
}

exports.requireSignin = jwt({ 
    secret: process.env.JWT_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if (!user) {
        return res.status(403).json({
            error: 'Accès refusé'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Réservé aux Admins! Access denied"
        });
    }
    next();
}

// exports.requireSignin = expressJwt({
//     secret: process.env.JWT_SECRET,
//     // algorithms: ["HS256"], // added later
//     userProperty: "auth",
//   });

// exports.requireSignin = jwt({
//   secret: "shhhhhhared-secret",
//   algorithms: ["HS256"],
//   //algorithms: ['RS256']
// });