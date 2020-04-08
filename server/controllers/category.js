const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

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