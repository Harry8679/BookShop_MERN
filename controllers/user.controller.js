const User = require('../models/user.model');
const jwt = require('jsonwebtoken'); // Pour générer un token après connexion
const expressJwt = require('express-jwt');  // Pour vérifier les autorisation
// const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = async(req, res) => {
    try {
        const { email, password } = new User(req.body);
    
        let user = await User.findOne({ email });
        if (user) return res.status(400).send("Cet email existe déjà !");
    
        user = new User(req.body);
        await user.save();
    
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).send("Votre demande ne s'est pas bien passée.");
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
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
        // Mettre le toke. dans la variable t dans les cookies avec date d'expiration.
        res.cookie('t', token, { expire: new Date() + 9999 });
        // Envoyer à la partie front l'utilisateur et son token
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
}