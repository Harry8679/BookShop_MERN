const Category = require('../models/category.model');

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Une erreur s\'est produite lors de la création de la catégorie'
            });
        }
        res.json({ data });
    });
}