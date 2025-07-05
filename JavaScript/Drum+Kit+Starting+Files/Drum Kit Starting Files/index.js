debugger

var buttonObjects = document.querySelectorAll(".drum");
document.addEventListener("keydown", function (event) {
    if (event.repeat) return
    handleClick(event.key)
})

buttonObjects.forEach((button) => {
  button.addEventListener("click", handleClick);
  
});

function handleClick(event) {
    var elementLeter = this.innerHTML || event
    
    var path = ""
    switch (elementLeter) {
        
      case "w":
        path = "./sounds/tom-1.mp3";
        break;
      case "a":
        path = "./sounds/tom-2.mp3";
        break;
      case "s":
        path = "./sounds/tom-3.mp3";
        break;
      case "d":
        path = "./sounds/tom-4.mp3";
        break;
      case "j":
        path = "./sounds/snare.mp3";
        break;
      case "k":
        path = "./sounds/crash.mp3";
        break;
      case "l":
        path = "./sounds/kick-bass.mp3";
        break;

      default:
    }

    activeButton = document.querySelector("." + elementLeter)
    
    activeButton.classList.add("pressed");
    setTimeout(() => {
        activeButton.classList.remove("pressed");
        buttonObjects.forEach((button) => {
          button.classList.remove("pressed");
        });

    }, 100);
    audio = new Audio(path);
    audio.play()
    
}

function buttonAnimation() {
    
}