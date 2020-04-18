const express = require("express");

const router = express.Router();

router.use("/admin", require(__dirname + "/admin"));
router.use("/api/str1", require(__dirname + "/api"));

router.get("/", function(req, res) {
    res.status(200).json({"message" : "this page confirm!!!"});
});

module.exports = router;