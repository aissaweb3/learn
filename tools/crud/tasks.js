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

router.post("/create", async (req, res) => {
  const { token, teamId, start, end, name, description } = req.body;
  isRoot(res, token);

  if (!teamId || !start || !end || !name || !description)
    return res
      .status(200)
      .json({ success: false, message: "Fill all the fields" });
  const team = await prisma.team.findFirst({ where: { id: userId } });

  if (!team)
    return res
      .status(200)
      .json({ success: false, message: "Team with teamId not found !" });

  let status = "STARTED";
  if (start > new Date()) status = "NOT_STARTED";

  try {
    const data = {
      start,
      end,
      name,
      description,
      status,
      teamId,
    };
    const createdTask = await prisma.task.create({ data });

    return res.status(200).json({ success: true, createdTask });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/get", async (req, res) => {
  const { token, limit, filter } = req.body;
  isRoot(res, token);

  try {
    const tasksQuery = limit ? { take: limit } : {};
    const tasksFilter = filter ? { where: filter } : {};
    const tasks = await prisma.task.findMany({ ...tasksQuery, ...tasksFilter });

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/update", async (req, res) => {
  const { token } = req.body;
  isRoot(res, token);

  try {
    return res.status(200).json({ success: true, message: "did nothing" });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
