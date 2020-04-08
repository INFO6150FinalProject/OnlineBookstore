const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.json({
                status: 400,
                err: "Product not found"
            })
        }
        req.product = product;
        next();
    })
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.json({
                status: 400,
                err: "Image could not be uploaded"
            })
        }
        const {name, description, price, category, quantity, shipping} = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.json({
                status: 400,
                err: "All fields are required"
            })
        }
        let product = new Product(fields);

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.json({
                    status: 400,
                    err: "Image should be less than 1mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.json({
                    status: 400,
                    err: errorHandler(err)
                })
            }
            return res.json({
                status: 200,
                result
            })
        })
    })
};


exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product);
};

exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err) => {
        if (err) {
            return res.json({
                status: 400,
                err: errorHandler(err)
            }) 
        }
        return res.json({
            status: 200,
            message: "Product deleted successfully"
        }) 
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.json({
                status: 400,
                err: "Image could not be uploaded"
            })
        }
        const {name, description, price, category, quantity, shipping} = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.json({
                status: 400,
                err: "All fields are required"
            })
        }
        let product = req.product;
        product = _.extend((product, fields));

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.json({
                    status: 400,
                    err: "Image should be less than 1mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.json({
                    status: 400,
                    err: errorHandler(err)
                })
            }
            return res.json({
                status: 200,
                result
            })
        })
    })
};