//left Dice
let randomNumber1=Math.floor(Math.random()*6+1);
let randomDiceImageValue = "dice" + randomNumber1 + ".png"; 
let randomImageSrc='images/'+randomDiceImageValue;
let DiceImg=document.querySelectorAll('img')[0];
console.log(DiceImg);
console.log(randomImageSrc);
DiceImg.setAttribute("src", randomImageSrc);

//Right Dice

let randomNumber2 = Math.floor(Math.random() * 6 + 1);
let secondRandomDiceValue = "dice" + randomNumber2 + ".png"; 
let secondRandomImageSrc = "images/" + secondRandomDiceValue;
let secondDiceImg=document.querySelectorAll('img')[1];
console.log(secondDiceImg);
console.log(secondRandomImageSrc);
secondDiceImg.setAttribute("src", secondRandomImageSrc);


//check the result

if (randomNumber1>randomNumber2) {
    document.querySelector("h1").textContent = "🚩 Play 1 Wins!";
}else if (randomNumber2>randomNumber1) {
    document.querySelector("h1").textContent = "🚩 Play 2 Wins!";
}else{
    document.querySelector("h1").textContent="🚩 Draw";
}

