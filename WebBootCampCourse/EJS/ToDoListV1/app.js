//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const app = express();

const _ = require("lodash");

const mongoose = require("mongoose");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const ListModel = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Item 1",
});

const item2 = new Item({
  name: "Item 2",
});
const item3 = new Item({
  name: "Item 3",
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  //const day = date.getDate();

  Item.find()
    .then((items) => {
      //file list inside views folder with extenstion ejs
      if (items.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("Data inserted"); // Success
          })
          .catch(function (error) {
            console.log(error); // Failure
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: items });
        // items.forEach((item) => {
        //   console.log(item.name);
        // });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  console.log(req.body);
  console.log(req.body.list);

  const postedItem = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    postedItem.save();
    res.redirect("/");
  } else {
    ListModel.findOne({ name: listName })
      .then((foundList) => {
        console.log("the found list is ", foundList);
        foundList.items.push(postedItem);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", (req, res) => {
  //console.log(req.body.checkbox);
  console.log(req.body);
  const listInputHidden = req.body.listInputHiddenName;
  const checkedItemId = req.body.checkbox;
  if (listInputHidden === "Today") {
    Item.findByIdAndRemove(checkedItemId)
      .then(() => {
        console.log("deleted successfully");
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    ListModel.findOneAndUpdate(
      { name: listInputHidden },
      { $pull: { items: {_id:checkedItemId} } }
    )
      .then((foundList) => {
        //console.log("the list input hidden name is "+listInputHidden);
        //console.log("found list in delete" + foundList);
        res.redirect("/"+listInputHidden);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  ListModel.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        console.log("doesnt exist");
        //create a new list
        const list = new ListModel({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        //show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
        console.log("exist");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/work", (req, res) => {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server Started on port 3000");
});
