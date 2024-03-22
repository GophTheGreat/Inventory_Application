const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  })
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  //Get details of the category and all associated items in parallel
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({category: req.params.id}).exec()
  ])

  if(category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_items: itemsInCategory,
  });
})