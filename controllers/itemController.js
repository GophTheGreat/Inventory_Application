
const Item = require("../models/item");
const Category = require("../models/category")
const Manufacturer = require("../models/manufacturer")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all items, categories, and manufacturers
exports.index = asyncHandler(async (req, res, next) => {
  // Get all the items and their prices
  const [
    numItems,
    numCategories,
    numManufacturers
  ] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
    Manufacturer.countDocuments({}).exec(),
  ]);

  console.log("hi")
  console.log(numItems);

  res.render("index", {
    title: "THE SHOP home",
    item_count: numItems,
    category_count:  numCategories,
    manufacturer_count: numManufacturers
  });
})

//Display detail page for a specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
  //Get details of the item
  const item = await Item.findById(req.params.id).populate("category").populate("manufacturer").exec();

  if (item === null) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: item.name,
    item: item,
  });
});

//Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).populate("category").populate("manufacturer").exec();
  res.render("item_list", {
    title: "Item List",
    item_list: allItems,
  })
});
