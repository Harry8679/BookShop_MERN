const User = require('../models/user.model');
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