const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {type: String, required: true, maxLength: 100},
  category: {type: String, required: true, maxLength: 100},
  cost: {type: Number, required: true, min: 0},
  manufacturer: {type: String, maxLength: 100},
})

// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});

// Virtural for item's price
ItemSchema.virtual("price").get(function() {
  return "$" + (this.cost / 100).toString();
})