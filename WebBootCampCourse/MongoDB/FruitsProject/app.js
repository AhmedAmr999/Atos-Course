const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fruitsDB", {
  useNewUrlParser: true,
});

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please check your data entery add name"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
  review: String,
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit({
  name: "Peaches",
  rating: 10,
  review: "Peaches also yummy",
});

const kiwi = new Fruit({
  name: "Kiwi",
  rating: 10,
  review: "best fruit",
});

const Banana = new Fruit({
  name: "Banana",
  rating: 5,
  review: "meh",
});

const Orange = new Fruit({
  name: "Orange",
  rating: 10,
  review: "the best ever!",
});

// Fruit.insertMany([kiwi, Orange, Banana])
//   .then(function () {
//     console.log("Data inserted"); // Success
//   })
//   .catch(function (error) {
//     console.log(error); // Failure
//   });

Fruit.find()
  .then((fruits) => {
    //console.log(fruits);
    mongoose.connection.close();
    fruits.forEach((fruit) => {
      console.log(fruit.name);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Fruit.updateOne({ _id: "6443c265e6ce4f14bf186f90" }, { name: "Peach" })
//   .then(() => {
//     console.log("document updated successfully");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Fruit.deleteOne({ name: "Peach" })
//   .then(() => {
//     console.log("document deleted successfuly");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//fruit.save();

///Challenge
const peopleSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favouriteFruit: fruitSchema,
});

const People = mongoose.model("People", peopleSchema);

const mango = new Fruit({
  name: "Mango",
  rating: 6,
  review: "decent ever!",
});

//mango.save();

People.updateOne({ _id: "6443c54390630fea00d53796" }, { favouriteFruit: mango })
  .then(() => {
    console.log("updated Successfully");
  })
  .catch((err) => {
    console.log("the error is " + err);
  });

// const people = new People({
//   name: "Maso",
//   age: 37,
//   favouriteFruit: mango
// });

// People.deleteMany({ name: "John" })
//   .then(() => {
//     console.log("People records deleted");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//people.save();
