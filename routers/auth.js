const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const generateToken = require("../tools/jwt/generateToken");
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  if (!firstname || !lastname || !password || !password)
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

    const checkUser = await prisma.user.findUnique({ where: { username } });
    if (checkUser)
      return res.json({
        success: true,
        message: "User Registred Successfully !!",
      });

    return res.json({
      success: false,
      message: "Server Error",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        message: "Username not registered or incorrect password",
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server Error" });
      }
      const token = generateToken({ userId: user.id }, "1h");
      return res.json({ success: true, message: "Login successful.", token });
    });
  })(req, res, next);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
          return done(null, false, { message: "Username not registered" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = router;
