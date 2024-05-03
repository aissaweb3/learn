

const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
/*
  const email = 'email1', name = 'name1';

  const data = { email, name }

  const user = await prisma.user.create({ data })
*/
  res.send("home page working")
})

module.exports = router;
