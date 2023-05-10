const fs = require("fs");
const HTTPError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

let DUMMY_PLACES = [
  // {
  //   id: "p1",
  //   title: "Empire State Building",
  //   description: "One of the most famous sky scrapers in the world!",
  //   imageUrl:
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
  //   address: "20 W 34th St, New York, NY 10001",
  //   location: {
  //     lat: 40.7484405,
  //     lng: -73.9878584,
  //   },
  //   creator: "u1",
  // },
];

const getPlaceById = async (req, res, next) => {
  console.log("GET request in places");
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HTTPError("Something went wrong could not find a place ..", 404)
    );
  }

  if (!place) {
    return next(
      new HTTPError("Could Not find a place for the provided Id..", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) }); //{place:place}
};

const getPlacesByUserId = async (req, res, next) => {
  console.log("GET request in USERS");
  const userId = req.params.uid;
  console.log("the user id in user places is ", userId);
  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
    //console.log("the user id in the controller is ", userId);
  } catch (error) {
    return next(
      new HTTPError("fetched places failed please try again later..", 500)
    );
  }

  if (!userWithPlaces || userWithPlaces.length === 0) {
    return next(
      new HTTPError("Could Not find a places for the provided User Id..", 404)
    );
  }
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  }); //{place:place}
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HTTPError("Invalid inputs passed,please check your data..", 422)
    );
  }
  const { title, description, address } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HTTPError("Creating Place Failed Please try again"), 500);
  }

  if (!user) {
    return next(new HTTPError("Could not find user with provided id"), 404);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HTTPError("creating place failed please try again", 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HTTPError("Invalid inputs passed,please check your data..", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HTTPError("something went wrong could not update place..", 500)
    );
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(
      new HTTPError("You are not allowed to edit this place ..", 401)
    );
  }

  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (error) {
    return next(
      new HTTPError("something went wrong could not update place..", 500)
    );
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(
      new HTTPError("something went wrong could not find and del place..", 500)
    );
  }
  if (!place) {
    return next(
      new HTTPError("something went wrong could not find place..", 404)
    );
  }

  if (place.creator.id !== req.userData.userId) {
    return next(
      new HTTPError("You are not allowed to delete this place ..", 401)
    );
  }

  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.findByIdAndRemove(placeId, { session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(
      new HTTPError("something went wrong could not delete place..", 500)
    );
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
