const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
//const category_controller = require("../controllers/categoryController");
//const manufacturer_controller = require("../controllers/manufacturerController");

// GET catalog home page.
router.get("/", item_controller.index);


// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Items.
router.get("/items", item_controller.item_list);

module.exports = router;