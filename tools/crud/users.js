const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../jwt/jwt");
const prisma = new PrismaClient();

const isRoot = (res, token) => {
  if (!token)
    return res.status(401).json({ success: false, message: "Not Authorized" });
  const payload = verifyToken(token);
  if (!payload)
    return res.status(401).json({ success: false, message: "Not Authorized" });
  if (!payload.root === true)
    return res.status(401).json({ success: false, message: "Not Authorized" });
};

router.post("/get", async (req, res) => {
  const { token, limit, filter } = req.body;
  isRoot(res, token);

  try {
    const usersQuery = limit ? { take: limit } : {};
    const usersFilter = filter ? { where: filter } : {};
    const users = await prisma.user.findMany({ ...usersQuery, ...usersFilter });

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
