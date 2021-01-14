var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
var productSchema = mongoose.Schema({
	Name: String,
	Model: String,
	Price: Number,
	Picture: String,
});
var Product = mongoose.model("Product", productSchema);

function validateProduct(data) {
	const schema = Joi.object({
		Name: Joi.string().min(2).max(100).required(),
		Model: Joi.string().required(),
		Price: Joi.number().min(0).required(),
		Picture: Joi.string(),
	});
	return schema.validate(data, { abortEarly: false });
}
module.exports.Product = Product;
module.exports.validate = validateProduct;
