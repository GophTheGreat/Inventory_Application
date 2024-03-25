
const Item = require("../models/item");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");
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

exports.item_create_get = asyncHandler(async(req, res, next) => {
  //Get all manufacturers and categories for the form 
  const [allCategories, allManufacturers] = await Promise.all([
    Category.find().sort({name: 1}).exec(),
    Manufacturer.find().sort({name: 1}).exec(),
  ]);

  res.render("item_form", {
    title: "Create Item",
    categories: allCategories,
    manufacturers: allManufacturers
  });
})

// Handle Item create on POST. 
exports.item_create_post = [
  //Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({min: 1, max: 100})
    .escape()
    .withMessage("Item must have a name")
    .isAlphanumeric()
    .withMessage("Name must be alphanumeric"),
  body("category")
    .trim()
    .isLength({min: 1, max: 100})
    .escape()
    .withMessage("Item must have a category")
    .isAlphanumeric()
    .withMessage("Category must be alphanumeric"),
  body("cost")
    .notEmpty()
    .withMessage("A price is required")
    .isInt({min: 0})
    .withMessage("Price must be a positive number representing cents"),
  body("manufacturer")
    .optional()
    .trim()
    .isLength({min: 1, max: 100})
    .escape()
    .withMessage("Item must have a category")
    .isAlphanumeric()
    .withMessage("Category must be alphanumeric"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from the request
    const errors = validationResult(req);
    console.log("Request Body:", req.body);

    //Create Item object with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      cost: req.body.cost,
      manufacturer: req.body.manufacturer
    });

    if(!errors.isEmpty()) {
      const [allCategories, allManufacturers] = await Promise.all([
        Category.find().sort({name: 1}).exec(),
        Manufacturer.find().sort({name: 1}).exec(),
      ]);

      // There are errors. Render form again with sanitized values/errors messages.
      res.render("item_form", {
        title: "Create Item",
        item: item,
        categories: allCategories,
        manufacturers: allManufacturers,
        errors: errors.array(),
      })
      return;
    }
    else{
      // Data from form is valid.

      // Save item.
      await item.save();
      // Redirect to new item record.
      res.redirect(item.url);
    }
  })
];

//Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).populate("category").populate("manufacturer").exec();
  res.render("item_list", {
    title: "Item List",
    item_list: allItems,
  })
});

