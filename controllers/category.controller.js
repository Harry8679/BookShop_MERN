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

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Un problème s\'est produit lors de la modification de la catégorie'
            });
        }
        res.json(data);
    });
}

exports.remove = (req, res) => {
    const category = req.category;
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Une erreur s\'est produite lors de la suppression de la catégorie'
            });
        }
        res.json({
            message: 'Categorie supprimée avec succès'
        });
    });
}

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: 'Une erreur s\'est produite lors du chargement des données'
            });
        }
        res.json(data);
    });
}