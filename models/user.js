var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
var userSchema = mongoose.Schema({
	Name: String,
	Email: String,
	Password: String,
	role: {
		type: String,
		default: "user",
	},
});
userSchema.methods.generateHashedPassword = async function () {
	let salt = await bcrypt.genSalt(10);
	this.Password = await bcrypt.hash(this.Password, salt);
};
var User = mongoose.model("User", userSchema);

function validateUser(data) {
	const schema = Joi.object({
		Name: Joi.string().min(3).max(20).required(),
		Email: Joi.string().email().min(10).max(30).required(),
		Password: Joi.string().min(3).required(),
	});
	return schema.validate(data, { abortEarly: false });
}
function validateUserLogin(data) {
	const schema = Joi.object({
		Email: Joi.string().email().min(10).required(),
		Password: Joi.string().min(5).required(),
	});
	return schema.validate(data, { abortEarly: false });
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateUserLogin = validateUserLogin;
