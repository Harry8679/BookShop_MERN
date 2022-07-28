const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/product.model');
const fs = require('fs');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'L\'image n\'a pas pu être téléchargée !'
            });
        }

        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'Tous les champs sont obligatoires !'
            });
        }

        let product = new Product(fields);

        if (files.photo) {
            // console.log('FILES PHOTO: ', files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'L\'image ne peut excéder les 1 Mb'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: 'Erreur lors de la création d\'un produit'
                });
            }
            res.json(result);
        });
    });
}

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: 'Produit inexistant'
            });
        }
        req.product = product;
        next();
    });
}

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                message: 'Un problème empêche la suppression de ce produit'
            });
        }
        res.json({
            deletedProduct,
            message: 'Le produit a bien été supprimé !'
        });
    });
}