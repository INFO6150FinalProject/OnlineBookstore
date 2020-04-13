const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const {
    errorHandler
} = require("../helpers/dbErrorHandler");


exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
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
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields

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
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields

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

/*
 * /products
 * by sell: /products?sortBy=sold&order=desc&limit=4
 * by arrival: /products?sortBy=createdAt&order=desc&limit=4
 */
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : "6";

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, order]
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.json({
                    status: 400,
                    err: "Products not found"
                })
            }
            return res.json({
                status: 200,
                products
            })
        })
}
/**
 * it will find products based on req product query
 * other products with same category will be returned
 */
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : "6";

    Product.find({
            _id: {
                $ne: req.product
            },
            category: req.product.category
        })
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) => {
            if (err) {
                return res.json({
                    status: 400,
                    err: "Products not found"
                })
            }
            return res.json({
                status: 200,
                products
            })
        })

};

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err) {
            return res.json({
                status: 400,
                err: "Categories not found"
            })
        }
        return res.json({
            status: 200,
            categories
        })
    })
}

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, order]
        ])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
} 