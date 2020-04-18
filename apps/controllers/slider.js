var sliders = require('../models/slider');

//Api 
exports.getApiListSlider = async(req, res) => {
    sliders.aggregate([
        {$unwind: "$iduti" },
        {
            $lookup: {
                'from': 'utilities',
                'localField': 'iduti',
                'foreignField': '_id',
                'as': 'utilitiObject'
            }
        },
    ]).exec(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
}