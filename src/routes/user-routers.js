const User = require("../models/User");
const auth = require("../middleware/auth");

const express = require("express");

const router = express.Router();

//Create a User
router.post("/user/new", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
});

//Login a User
router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.username,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
});

//Logout User
router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== token;
        });
        await user.save();

        res.status(200).send({ message: "User logged out" });
    } catch (e) {
        res.status(500).send(e);
    }
});

//Get User Details
router.get("/user/me", auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
