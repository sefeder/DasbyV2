const router = require("express").Router();
const dasbyActions = require("../../dasbyLogic/dasbyActions")

router.route('/')
    .post(function(req,res){
        console.log("dasby post route hit!!")
        dasbyActions.handleNewMessage(req.body.ChannelSid, req.body.Body, req.body.From)
        res.end()

    })
    // .get(function(req,res){
    //     console.log("dasby get route hit!!")
    //     console.log("get req: ", req)
    //     console.log("get params: ", req.params)
    //     res.end()

    // })
    

module.exports = router;