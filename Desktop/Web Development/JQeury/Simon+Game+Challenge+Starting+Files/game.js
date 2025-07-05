buttons = $(".btn");
/** @type {JQuery<HTMLElement>} */
const greenButton = $(".green");

/** @type {JQuery<HTMLElement>} */
const title = $("#level-title");

/** @type {JQuery<HTMLElement>} */
const backgroundColor = $("body");

/** @type {JQuery<HTMLElement>} */
const redButton = $(".red");

/** @type {JQuery<HTMLElement>} */
const yellowButton = $(".yellow");

/** @type {JQuery<HTMLElement>} */
const blueButton = $(".blue");

var isPlaying = false;

function print(text) {
  console.log(text);
}

var BoxsList = [$("#green"), $("#red"), $("#yellow"), $("#blue")];
var RandomIndexes = [];
var AnswerIndexes = [];
var RandomBoxIndex = generateRandomIndex();

$(document).keydown(function (event) {
  if (event.key != "q" && !isPlaying) {
    print("Starting...");
    title.text("Level " + (RandomIndexes.length + 1));
      isPlaying = true;
      if ((RandomIndexes.length + 1) == 1){
          animateRandomBox();
      }
  } else if (event.key == "q" && isPlaying == true) {
    RandomIndexes = [];
    print("quiting...");
    isPlaying = false;
  }
});

$(".btn").on("click", function () {
  const id = $("#" + this.id);
  const clickedIndex = BoxsList.findIndex((box) => box[0].id === this.id);
  AnswerIndexes.push(clickedIndex);

  print("Clicked: " + this.id);
  print("AnswerIndexes: " + AnswerIndexes);
  print("RandomIndexes: " + RandomIndexes);

  let currentStep = AnswerIndexes.length - 1;

  if (AnswerIndexes[currentStep] === RandomIndexes[currentStep]) {
    animateBox(id, false);

    if (AnswerIndexes.length === RandomIndexes.length) {
      print("Level Passed!");

      setTimeout(() => {
        AnswerIndexes = [];
        title.text("Level " + (RandomIndexes.length + 1));
        animateRandomBox();
      }, 1000);
    }
  } else {
    print("Wrong");
    animateBox(id, true);
    isPlaying = false;
    RandomIndexes = [];
    AnswerIndexes = [];
  }
});

function animateBox(id, isWrong) {
  if (isPlaying) {
    var color = "green";

    if (isWrong) {
      wrong();
    }
    if (!isWrong) {
      if (id[0].id == "green") {
        playSound("./sounds/green.mp3");
      } else if (id[0].id == "red") {
        playSound("./sounds/red.mp3");
      } else if (id[0].id == "blue") {
        playSound("./sounds/blue.mp3");
      } else if (id[0].id == "yellow") {
        playSound("./sounds/yellow.mp3");
      }
    }
      

    print(id[0].id);

    const originalBoxShadow = id.css("box-shadow");
    id.css("box-shadow", "0 0 50px " + color);
    setTimeout(() => {
      id.css("box-shadow", originalBoxShadow);
    }, 200);
  }
}

function animateRandomBox() {
  RandomBoxIndex = generateRandomIndex();
  RandomIndexes.push(RandomBoxIndex);
  const boxToAnimate = BoxsList[RandomBoxIndex];
  animateBox(boxToAnimate, false);
}

function wrong() {
  playSound("./sounds/wrong.mp3");
  backgroundColor.css("backgroundColor", "red");
  setTimeout(() => {
    backgroundColor.css("backgroundColor", "rgb(1, 31, 63)");
  }, 200);
  title.text("Game Over, Press Any Key to Restart");
}

function generateRandomIndex() {
  return Math.floor(Math.random() * 4);
}

function playSound(path) {
  new Audio(path).play();
}
