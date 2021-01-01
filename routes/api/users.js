const express = require("express");
let router = express.Router();
let { User } = require("../../models/user");
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
router.post("/register", async (req, res) => {
	let user = await User.findOne({ Email: req.body.Email });
	if (user) return res.status(400).send("Email already exists");
	user = new User();
	user.Name = req.body.Name;
	user.Email = req.body.Email;
	user.Password = req.body.Password;
	await user.generateHashedPassword();
	await user.save();
	let token = jwt.sign(
		{ _id: user._id, Name: user.Name, role: user.role },
		config.get("jwtPrivateKey")
	);
	let datatoRetuen = {
		Name: user.Name,
		Email: user.Email,
		token: user.token,
	};
	return res.send(datatoRetuen);
});
router.post("/login", async (req, res) => {
	let user = await User.findOne({ Email: req.body.Email });
	if (!user) return res.status(400).send("User Not Registered");
	let isValid = await bcrypt.compare(req.body.Password, user.Password);
	if (!isValid) return res.status(401).send("Invalid Password!");
	let token = jwt.sign(
		{ _id: user._id, Name: user.Name, role: user.role },
		config.get("jwtPrivateKey")
	);
	res.send(token);
});
module.exports = router;
