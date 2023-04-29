// //CHALLENGE: uncomment the code below and see the car stats rendered
import React from "react";
import ReactDOM from "react-dom";
//import animals, { useAnimals } from "./data";
import cars from "./practice";
console.log(cars);
const [honda, tesla] = cars;

const {
  speedStats: { topSpeed: hondaTopSpeed }
} = honda;

const {
  speedStats: { topSpeed: teslaTopSpeed }
} = tesla;

const {
  coloursByPopularity: [teslaTopColour]
} = tesla;
const {
  coloursByPopularity: [hondaTopColour]
} = honda;

ReactDOM.render(
  <table>
    <tr>
      <th>Brand</th>
      <th>Top Speed</th>
    </tr>
    <tr>
      <td>{tesla.model}</td>
      <td>{teslaTopSpeed}</td>
      <td>{teslaTopColour}</td>
    </tr>
    <tr>
      <td>{honda.model}</td>
      <td>{hondaTopSpeed}</td>
      <td>{hondaTopColour}</td>
    </tr>
  </table>,
  document.getElementById("root")
);

// console.log(animals);

// const [cat, dog] = animals;
// //console.log(useAnimals(cat));

// const [animal,makeSound]=useAnimals(cat);
// console.log(animal);
// makeSound();

// console.log(cat);
// console.log(dog);

// const { name, sound,foodingRequirments:{food,water} } = cat;

// console.log(food);

//const { name, sound } = cat;

// const{name:catName,sound:CatSound}=cat;

//if name is undefined use this value
//default value of name and sound of the cat
//const {name="ahmed",sound="dskdja"}=cat;
//console.log(catName);
