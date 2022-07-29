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

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'La catégorie n\'existe pas !'
            });
        }
        req.category = category;
        next();
    });
}

exports.read = (req, res) => {
    return res.json(req.category);
}