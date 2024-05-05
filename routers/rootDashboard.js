const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { verifyToken } = require("../tools/jwt/jwt");

const isRoot = (res, token) => {
  if (!token)
    return res.status(401).json({ success: false, message: "Not Authorized" });
  const payload = verifyToken(token);
  if (!payload)
    return res.status(401).json({ success: false, message: "Not Authorized" });
  if (!payload.root === true)
    return res.status(401).json({ success: false, message: "Not Authorized" });
};

router.post("/getAllData", async (req, res) => {
  const { token, usersLimit, teamsLimit, tasksLimit, projectsLimit } = req.body;

  isRoot(res, token);

  const usersQuery = { take: usersLimit } || {};
  const users = await prisma.user.findMany(usersQuery);
  const teamsQuery = { take: teamsLimit } || {};
  const teams = await prisma.team.findMany(teamsQuery);
  const tasksQuery = { take: tasksLimit } || {};
  const tasks = await prisma.task.findMany(tasksQuery);
  const projectsQuery = { take: projectsLimit } || {};
  const projects = await prisma.project.findMany(projectsQuery);

  const data = { users, teams, tasks, projects };

  res.status(200).json({ success: true, data });
});

router.post("/getUsers", async (req, res) => {
  const { token, filter } = req.body;
  isRoot(res, token);

  try {
    let users;
    if (filter) {
      users = await prisma.user.findMany({ where: filter });
    } else {
      users = await prisma.user.findMany({});
    }
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/getUser/:id", async (req, res) => {
  const { token } = req.body;
  const id = parseInt(req.params.id);
  isRoot(res, token);

  try {
    let users;
    user = await prisma.user.findUnique({ where: { id } });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
