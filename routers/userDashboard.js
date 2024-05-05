const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { verifyToken } = require("../tools/jwt/jwt");

router.post("/chooseTeam", async (req, res) => {
  const { token, teamId } = req.body;

  const payload = verifyToken(token);
  if (!payload)
    return res.status(401).json({ success: false, message: "Not Authorized" });
  const { userId } = payload;
  const user = await prisma.user.findFirst({ where: { id: userId } });
  const team = await prisma.team.findFirst({ where: { id: teamId } });

  if (!user)
    return res.status(404).json({ success: false, message: "User Not Found" });

  if (!team)
    return res.status(404).json({ success: false, message: "Team Not Found" });

  await prisma.user
    .update({
      where: { id: userId },
      data: { teamId },
    })
    .then((res) => {
      console.log("changed team.");
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: "Server Error" });
      console.log(err);
    });
});

module.exports = router;
