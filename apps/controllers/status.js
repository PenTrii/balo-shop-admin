var status = require('../models/status');

exports.getApiListStatus = async(req, res) => {
    status.find(function(err, result) {
        if (err) throw err;
        if (result) {
            res.status(200).send(result);
        } else {
            res.send(JSON.stringify({
                error : 'Error',
            }));
        }
    });
};