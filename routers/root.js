const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { verifyToken, generateToken } = require("../tools/jwt/jwt");

router.post("/createRoot", async (req, res) => {
  const { firstname, lastname, password } = req.body;
  const username = "root";

  const root = await prisma.root.findFirst({ where: { username } });

  if (root)
    return res.json({
      success: false,
      message: "Username Already Registred",
    });

  if (!firstname || !lastname || !password)
    return res.json({
      success: false,
      message: "Please Fill All The Fields !!!",
    });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.root.create({
      data: {
        firstname,
        lastname,
        username,
        password: hashedPassword,
        role: "all",
      },
    });

    return res.json({
      success: false,
      message: "Root created",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/registerNewUser", async (req, res) => {
  const { firstname, lastname, username, password, token } = req.body;

  if (!token)
    return res.json({
      success: false,
      message: "Not Authorized",
    });
  const data = verifyToken(token);
  if (!data)
    return res.json({
      success: false,
      message: "Not Authorized",
    });
  if (!data.root)
    return res.json({
      success: false,
      message: "Not Authorized",
    });

  if (!firstname || !lastname || !password || !username)
    return res.json({
      success: false,
      message: "Please Fill All The Fields !!!",
    });

  try {
    const user = await prisma.user.findFirst({ where: { username } });

    if (user)
      return res.json({
        success: false,
        message: "Username Already Registred",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstname,
        lastname,
        username,
        password: hashedPassword,
        teamId: null,
      },
    });

    return res.json({
      success: true,
      message: "User Registred Successfully !!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  passport.authenticate(
    "local",
    { session: false },
    async (err, root1, info) => {
      if (err) {
        console.error("Error during authentication:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server Error" });
      }
      const root = await prisma.root.findFirst({ where: { username } });
      if (!root) {
        console.log("User not found or incorrect password");
        return res.status(401).json({
          success: false,
          message: "Username not registered or incorrect password",
        });
      }
      req.login(root, { session: false }, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return res
            .status(500)
            .json({ success: false, message: "Server Error" });
        }
        const token = generateToken({ rootId: root.id, root: true }, "1h");
        return res.json({ success: true, message: "Login successful.", token });
      });
    }
  )(req, res, next);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const root = await prisma.root.findFirst({ where: { username } });

        console.log("User found:", root);

        if (!root) {
          return done(null, false, { message: "Username not registered" });
        }

        const passwordMatch = await bcrypt.compare(password, root.password);

        console.log("Password match:", passwordMatch);

        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, root);
      } catch (error) {
        console.error("Error during authentication:", error);
        return done(error);
      }
    }
  )
);

module.exports = router;
