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
  await createItems();
  await createCategories();
  await createManufacturers();
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
  const categorydetail = {
    name: name
  }

  const category = new Category(categorydetail)
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function manufacturerCreate(index, name) {
  const manufacturerdetail = {name: name}

  const manufacturer = new Manufacturer(manufacturerdetail)
  await manufacturer.save();
  manufacturers[index] = manufacturer;
  console.log(`Added manufacturer: ${name}`)
}

// async function authorCreate(index, first_name, family_name, d_birth, d_death) {
//   const authordetail = { first_name: first_name, family_name: family_name };
//   if (d_birth != false) authordetail.date_of_birth = d_birth;
//   if (d_death != false) authordetail.date_of_death = d_death;

//   const author = new Author(authordetail);

//   await author.save();
//   authors[index] = author;
//   console.log(`Added author: ${first_name} ${family_name}`);
// }

// async function bookCreate(index, title, summary, isbn, author, genre) {
//   const bookdetail = {
//     title: title,
//     summary: summary,
//     author: author,
//     isbn: isbn,
//   };
//   if (genre != false) bookdetail.genre = genre;

//   const book = new Book(bookdetail);
//   await book.save();
//   books[index] = book;
//   console.log(`Added book: ${title}`);
// }

///////////

// async function createGenres() {
//   console.log("Adding genres");
//   await Promise.all([
//     genreCreate(0, "Fantasy"),
//     genreCreate(1, "Science Fiction"),
//     genreCreate(2, "French Poetry"),
//   ]);
// }

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
    itemCreate(0, "Left Socks", "Clothing", 999, Doob),
    itemCreate(1, "Right Socks", "Clothing", 999, Doob),
    itemCreate(2, "Shirt", "Clothing", 999, Doob),
    itemCreate(3, "Toaster", "Electronics", 2099, Sony),
    itemCreate(4, "Blender", "Electronics", 12099, Samsung),
    itemCreate(5, "Cybernetic Implant (small)", "Electronics", 209999, Sony),
    itemCreate(6, "Laser Sword", "Electronics", 350, Samsung),
    itemCreate(7, "Salt", "Hazardous Chemicals", 1000),
    itemCreate(8, "Calcium Chloride", "Hazardous Chemicals", 1850, Sony),
    itemCreate(9, "Uranium Juice", "Hazardous Chemicals", 51499)
  ]);
}

// async function createAuthors() {
//   console.log("Adding authors");
//   await Promise.all([
//     authorCreate(0, "Patrick", "Rothfuss", "1973-06-06", false),
//     authorCreate(1, "Ben", "Bova", "1932-11-8", false),
//     authorCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
//     authorCreate(3, "Bob", "Billings", false, false),
//     authorCreate(4, "Jim", "Jones", "1971-12-16", false),
//   ]);
// }


