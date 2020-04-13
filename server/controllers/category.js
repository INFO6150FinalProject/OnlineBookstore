const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.json({
                status: 400,
                err: "Category not found"
            })
        }
        req.category = category;
        next();
    })
};

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) {
            return res.json({
                status: 400,
                err: errorHandler(err)
            })
        }
        return res.json({
            status: 200,
            message: data
        })
    });
}

exports.read = (req, res) => {
    return res.json(req.category);
};

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        return res.status(200).json({
            message: errorHandler(data)
        })
    })
};

exports.remove = (req, res) => {
    const category = req.category;
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        return res.status(200).json({
            message: "Category deleted successfully"
        })
    })
};

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        return res.status(200).json({
            data
        })
    })
};