const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const manufacturer_controller = require("../controllers/manufacturerController");

// GET catalog home page.
router.get("/", item_controller.index);

// GET request for creating Item.
router.get("/item/create", item_controller.item_create_get)

// POST request for creating Item.
router.post("/item/create", item_controller.item_create_post);

// GET request for deleting Item
router.get("/item/:id/delete", item_controller.item_delete_get)

// Post request for deleting Item
router.post("/item/:id/delete", item_controller.item_delete_post)

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Items.
router.get("/items", item_controller.item_list);

// GET request for list of all categories
router.get("/categories", category_controller.category_list);

// GET request for creating Category
router.get("/category/create", category_controller.category_create_get)

// POST request for creating Category
router.post("/category/create", category_controller.category_create_post)

// GET request for deleting category
router.get("/category/:id/delete", category_controller.category_delete_get)

// POST request for deleting category
router.post("/category/:id/delete", category_controller.category_delete_post)

// GET request for one category
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all manufacturers
router.get("/manufacturers", manufacturer_controller.manufacturer_list);

// GET request for creating manufacturer.
router.get("/manufacturer/create", manufacturer_controller.manufacturer_create_get)

// POST request for creating manufacturer.
router.post("/manufacturer/create", manufacturer_controller.manufacturer_create_post);

// GET request for deleting manufacturer
router.get("/manufacturer/:id/delete", manufacturer_controller.manufacturer_delete_get)

// POST request for deleting manufacturer
router.post("/manufacturer/:id/delete", manufacturer_controller.manufacturer_delete_post)

// GET request for one manufacturer
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

module.exports = router;