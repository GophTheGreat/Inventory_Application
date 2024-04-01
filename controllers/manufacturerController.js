const Item = require("../models/item");
const Manufacturer = require("../models/manufacturer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Display list of all Manufacturers

// Display list of all Categories.
exports.manufacturer_list = asyncHandler(async (req, res, next) => {
  const allManufacturers = await Manufacturer.find().sort({ name: 1 }).exec();
  res.render("manufacturer_list", {
    title: "Manufacturer List",
    manufacturer_list: allManufacturers,
  })
});

//Display detail page for a specific Manufacturer
exports.manufacturer_detail = asyncHandler( async(req, res, next) => {
  //Get details of the manufacturer an all associated items in parallel
  const [manufacturer, itemsInManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Item.find({manufacturer: req.params.id}).exec()
  ])

  if(manufacturer === null) {
    const err = new Error("Manufacturer not found");
    err.status = 404;
    return next(err);
  }

  res.render("manufacturer_detail", {
    title: "Manufacturer detail",
    manufacturer: manufacturer,
    manufacturer_items: itemsInManufacturer
  })
})

//Display Manufacturer create form on GET
exports.manufacturer_create_get = (req, res, next) => {
  res.render("manufacturer_form", {title: "Create Manufacturer"})
}

//Handle Manufacturer create on POST
exports.manufacturer_create_post = [
  // Validate and sanitize the name field.
  body("name", "Manufacturer's name")
    .trim()
    .isLength({min: 1})
    .escape()
    .isAscii()
    .withMessage("Name must be must be in ASCII characters"),

  asyncHandler(async (req, res, next) => {
    //Extract the validation errors from a request.
    const errors = validationResult(req);

    //Create a manufacturer object with the escaped and trimmed data
    const manufacturer = new Manufacturer({name: req.body.name})

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("manufacturer_form", {
        title: "Create Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Manufacturer with same name already exists.
      const manufacturerExists = await Manufacturer.findOne({ name: req.body.name }).exec();
      if (manufacturerExists) {
        // Manufacturer exists, redirect to its detail page.
        res.redirect(manufacturerExists.url);
      } else {
        await manufacturer.save();
        // New manufacturer saved. Redirect to manufacturer detail page.
        res.redirect(manufacturer.url);
      }
    }
  }),
]

//Display Manufacturer delete form on GET.
exports.manufacturer_delete_get = asyncHandler(async (req, res, next) => {
  const [manufacturer, allItemsInManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Item.find( {manufacturer: req.params.id}).exec(),
  ]);

  if(manufacturer === null) {
    //No results
    res.redirect("catalog/categories")
  }

  res.render("manufacturer_delete", {
    title: "Delete Manufacturer",
    manufacturer: manufacturer,
    items: allItemsInManufacturer,
  });
})

exports.manufacturer_delete_post = asyncHandler(async (req, res, next) => {
  const [manufacturer, allItemsInManufacturer] = await Promise.all([
    Manufacturer.findById(req.params.id).exec(),
    Item.find( {manufacturer: req.params.id}).exec(),
  ]);

  if(allItemsInManufacturer.length > 0) {
    res.render("manufacturer_delete", {
      title: "Delete Manufacturer",
      manufacturer: manufacturer,
      items: allItemsInManufacturer,
    });
    return;
  }
  else{
    await Manufacturer.findByIdAndDelete(req.body.manufacturerid)
    res.redirect("/catalog/manufacturers")
  }
})