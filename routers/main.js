const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  /*
  const email = 'email1', name = 'name1';

  const data = { email, name }

  const user = await prisma.user.create({ data })
*/
  return res.send("home page working");
});

module.exports = router;
