const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {type: String, required: true, maxLength: 100},
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  cost: {type: Number, required: true, min: 0},
  manufacturer: {type: Schema.Types.ObjectId, ref: "Manufacturer"},
})

// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});

// Virtual for item's price
ItemSchema.virtual("price").get(function() {
  const price = (this.cost / 100).toFixed(2);
  return "$" + price;
})

// Export model
module.exports = mongoose.model("Item", ItemSchema);