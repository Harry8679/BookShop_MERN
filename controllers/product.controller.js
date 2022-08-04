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

exports.update = (req, res) => {
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

        let product = req.product;
        product = _.extend(product, fields);

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

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no parames are sent, then all products are returned
 */
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 7;

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Pas de résultats'
                });
            }
            res.json(products);
        })
}

/**
 * it will find products based on the req product category
 * other products that has the same category, xill be returned
 */
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: {$ne: req.product}, category: req.product.category })
           .limit(limit)
           .populate('category', '_id name')
           .exec((err, products) => {
               if (err) {
                   return res.status(400).json({
                       error: "Produits non trouvés"
                   });
               }
               res.json(products)
           });
}

exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Catégorie non trouvée'
            });
        }
        res.json(categories);
    });
}