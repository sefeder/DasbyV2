const dialogue = require('../models/dialogue')

module.exports = {
    readDasbyScript: function (req, res) {
        console.log("read dasby script")
        dialogue.find(req.body.chapter, req.body.section, req.body.block)
    }
}
