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

//Display Category create form on GET
exports.category_create_get = (req, res, next) => {
  res.render("category_form", {title: "Create Category"})
}

//Handle Category create on POST
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name")
    .trim()
    .isLength({min: 1})
    .escape(),

  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from a request.
    const errors = validationResult(req);

    //Create a category object with the escaped and trimmed data
    const category = new Category({name: req.body.name})

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page.
        res.redirect(category.url);
      }
    }
  }),
]