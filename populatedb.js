#! /usr/bin/env node

console.log(
  'This script populates some test items, manufacturers, and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);


const Item = require("./models/item");
const Category = require("./models/category");
const Manufacturer = require("./models/manufacturer");

const items = [];
const categories = [];
const manufacturers = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await Promise.all([
    createCategories(),
    createManufacturers()
  ])
  await createItems();
  // await createAuthors();
  // await createBooks();
  // await createBookInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
// async function genreCreate(index, name) {
//   const genre = new Genre({ name: name });
//   await genre.save();
//   genres[index] = genre;
//   console.log(`Added genre: ${name}`);
// }

async function itemCreate(index, name, category, cost, manufacturer) {
  const itemdetail = {
    name: name,
    category: category,
    cost: cost,
  }
  if (manufacturer != false) itemdetail.manufacturer = manufacturer

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item
  console.log(`Added item: ${name}`);
}

async function categoryCreate(index, name) {
  const category = new Category({name: name})
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function manufacturerCreate(index, name) {
  const manufacturer = new Manufacturer({name: name})
  await manufacturer.save();
  manufacturers[index] = manufacturer;
  console.log(`Added manufacturer: ${name}`)
}


async function createCategories() {
  console.log("Adding categories")
  await Promise.all([
    categoryCreate(0, "Clothing"),
    categoryCreate(1, "Electronics"),
    categoryCreate(2, "Hazardous Chemicals"),
  ]);
}

async function createManufacturers() {
  console.log("Adding manufacturers")
  await Promise.all([
    manufacturerCreate(0, "Doob"),
    manufacturerCreate(1, "Samsung"),
    manufacturerCreate(2, "Sony"),
  ])
}

async function createItems() {
  console.log("Adding items")
  await Promise.all([
    itemCreate(0, "Left Socks",categories[0], 999, manufacturers[0]),
    itemCreate(1, "Right Socks",categories[0], 999, manufacturers[0]),
    itemCreate(2, "Shirt",categories[0], 999, manufacturers[0]),
    itemCreate(3, "Toaster",categories[1], 2099, manufacturers[2]),
    itemCreate(4, "Blender",categories[1], 12099, manufacturers[1]),
    itemCreate(5, "Cybernetic Implant (small)",categories[1], 209999, manufacturers[2]),
    itemCreate(6, "Laser Sword",categories[1], 350, manufacturers[1]),
    itemCreate(7, "Salt",categories[2], 1000, false),
    itemCreate(8, "Calcium Chloride",categories[2], 1850, manufacturers[2]),
    itemCreate(9, "Uranium Juice",categories[2], 51499, false)
  ]);
}
