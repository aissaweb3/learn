

const express = require('express');
const router = express.Router();


router.get('/login', async (req, res) => {

  res.send("login page working")
    
})

router.get('/signup', async (req, res) => {

  res.send("signup page working")
    
})

module.exports = router;
