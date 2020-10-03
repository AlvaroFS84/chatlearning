const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    var greeting = res.__('hello')
    res.render('login/index.twig', {
        message : greeting
    });
})

module.exports = router