let promptText = "";
let fullPrompt = "";
let correctChars = 0;
let incorrectChars = 0;


promptElement = document.getElementById("prompt", null);

function displayPrompt(prompt) {
  promptElement.setAttribute("prompt", prompt);
}

function setPrompt(aString) {
  promptText = aString;
}
function setPrompts(aString) {
  promptText = aString;
  fullPrompt = aString;
}

function setAndDisplayPrompts(aString) {
  promptText = aString;
  fullPrompt = aString;
  displayPrompt(fullPrompt);
}

setAndDisplayPrompts("Test_teass");

promptElement.onkeydown = function(e) {
  // Makes all inputs only input at the end of the prompt field
  moveCarettoEnd(promptElement);
  checkValidInput(e);

  if (isPromptInputValid(e)) {
    updatePrompt(e);
    checkCorrectInput(e);
  }
}

function checkCorrectInput(e) {
  let nextChar = fullPrompt.charAt(fullPrompt.length-promptText.length-1);
  let nextNextChar = fullPrompt.charAt(fullPrompt.length-promptText.length);
  if (e.key == nextChar && e.key != "_") {
    correctChars+= 1;
  } else if (e.key == "Enter" && (nextChar) == "_") {
    // Treats "Enter" as the equivalent of the underscore character in the prompts.
    correctChars += 1;
  } else if (e.key == "Backspace" && nextChar != nextNextChar){
    correctChars -= 1;
  } else if (e.key == "Backspace" && nextChar == nextNextChar) {
    incorrectChars -= 1;
  } else {
    incorrectChars += 1;
    incorrectStyles(promptElement);
  }
}


function incorrectStyles(el) {
  el.classList.toggle("incorrect");
  el.classList.toggle("fadeRed");
  setTimeout(function() {
    el.classList.toggle("incorrect");
    el.classList.toggle("fadeRed");
  }, 100);
  
}

function isPromptInputValid(e) {
  // Checks if the key pressed is allowed to be entered into the prompt.
  if (promptText == "" && checkValidInput(e) != "Backspace") {
    e.preventDefault();
    return false;
  } else if (e.key == "Shift" || e.key == "Delete" || e.ctrlKey) {
    return false;
  } else if (checkValidInput(e) != false || e.key == " ") {
    return true;
  } else {
    e.preventDefault();
    return false;
  }
}

function updatePrompt(e) {
  if (e.key != "Backspace") {
    // Removes the first letter of the prompt and displays it
    setPrompt(promptText.substring(1));
    displayPrompt(promptText);
  } else {
    setPrompt(fullPrompt.substring(fullPrompt.length-promptText.length-1));
    displayPrompt(promptText);
  }
}

// This removes an inexplicable problem that adds a space if you start typing without it.
promptElement.innerText = ""; 

/* Verifies if the key pressed is allowed. If not, the default behavior is prevented. Returns key.*/
function checkValidInput(e) {
  if (e.code == "KeyA" || e.code == "KeyB" || e.code == "KeyC" || e.code == "KeyD" || e.code == "KeyE" || 
    e.code == "KeyF" || e.code == "KeyG" || e.code == "KeyH" || e.code == "KeyI" || e.code == "KeyJ" || 
    e.code == "KeyK" || e.code == "KeyL" || e.code == "KeyM" || e.code == "KeyN" || e.code == "KeyO" || 
    e.code == "KeyP" || e.code == "KeyQ" || e.code == "KeyR" || e.code == "KeyS" || e.code == "KeyT" || 
    e.code == "KeyU" || e.code == "KeyV" || e.code == "KeyW" ||e.code == "KeyX" || e.code == "KeyY" || 
    e.code == "KeyZ" || e.code == "Digit1" || e.code == "Digit2" || e.code == "Digit3" || e.code == "Digit4" ||
    e.code == "Digit5" || e.code == "Digit6" || e.code == "Digit7" || e.code == "Digit8" || e.code == "Digit9" ||
    e.code == "Digit0" || e.code == "Quote" || e.code == "Enter" || e.code == "Backspace" || e.code == "Space" ||
    e.code == "Comma" || e.code == "Period" || e.code == "Slash" || e.code == "Semicolon" || e.code == "Minus" ||
    e.code == "Delete") {
      return e.key;
    }
    else {
      e.preventDefault(); 
      return false;
    }
}

// This function takes an element parameter and moves the selection to the end of it
function moveCarettoEnd(el) {
  var range,selection;
  if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
  {
      range = document.createRange();//Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(el);//Select the entire contents of the element with the range
      range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
      selection = window.getSelection();//get the selection object (allows you to change selection)
      selection.removeAllRanges();//remove any selections already made
      selection.addRange(range);//make the range you have just created the visible selection
  }
  else if(document.selection)//IE 8 and lower
  { 
      range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
      range.moveToElementText(el);//Select the entire contents of the element with the range
      range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
      range.select();//Select the range (make it the visible selection
  }
}