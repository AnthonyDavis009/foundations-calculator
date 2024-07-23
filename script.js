const clearBtn = document.querySelector("#clr-btn");
const calcInput = document.querySelector("#calc-input");
const calcBtnUsable = document.querySelectorAll(".calc-btn-usable");
const enterBtn = document.querySelector("#enter-btn");

calcBtnUsable.forEach(node => {
    node.addEventListener("click", e => {
    eraseErrMsg();
    if(isEventTargetErrCase(e.target.textContent)) {

    } else {
      calcInput.value += node.textContent;
      calcInput.scrollLeft += 100;  

      const actualWidth = calcInput.clientWidth;
      calcInput.scrollLeft = calcInput.scrollWidth - actualWidth;
    }
    });
});

calcInput.addEventListener("keydown", e => {
  eraseErrMsg();
  // Remember that strings are immutable and cannot edit them directly with array index [] 
  // But can instead copy/display their values
  let allowedInputArr = ['0','1','2','3','4','5','6','7','8','9','*','/','+','-', 'Backspace'];

  if(!allowedInputArr.includes(e.key)) {
    e.preventDefault();
  } else {

    let operatorIfUsed = e.key;

    if(e.key == "*") operatorIfUsed = "×";
    else if (e.key == "/") operatorIfUsed = "÷";
    else if (e.key == "-") operatorIfUsed = "–";
  
    if(isEventTargetErrCase(operatorIfUsed)) {
        e.preventDefault();
    } else {
      if(operatorIfUsed.length > 0 && operatorIfUsed != 'Backspace') {
        e.preventDefault();
        calcInput.value += operatorIfUsed;
      } 
      const actualWidth = calcInput.clientWidth;
      calcInput.scrollLeft = calcInput.scrollWidth - actualWidth;
    }
  }
});

enterBtn.addEventListener("click", () => {
  calcInput.value = operation();
  calcInput.scrollLeft = 0;  
});

clearBtn.addEventListener("click", () => calcInput.value = "");

function eraseErrMsg() {
  if(calcInput.value == "Err: ÷ by 0") calcInput.value = "";
}

function isEventTargetErrCase(charRetrieved) {
  if(
  // If charRetrieved is operator and input is empty, set true to prevent leading operator
    pressedArithOperator(charRetrieved) && 
    calcInput.value == "") {
    return true;
  } else if(
  // If charRetrieved is operator and input is empty, set true to prevent trailing operator
    pressedArithOperator(charRetrieved) && 
    pressedArithOperator(calcInput.value[calcInput.value.length - 1])) {
    return true;
  } else if(
  // If charRetrieved is operator and input contains operator before, set true to prevent duplicate adjacent operators
    attemptedExtraArithOperator(calcInput.value) &&
    pressedArithOperator(charRetrieved)) {
    return true;
  } else {
    return false;
  }
}

function pressedArithOperator(character) {
  const arithOperatorsValid = ["×", "÷", "+", "–"]
  return arithOperatorsValid.includes(character) ? true : false;
}

function attemptedExtraArithOperator(calcInputStr) {
  if(
  calcInputStr.includes("×") ||
  calcInputStr.includes("÷") ||
  calcInputStr.includes("+") ||
  calcInputStr.includes("–")) {
    return true;
  }
}

function operation() {
  let numPairArr = extractInputNumPair();
  let operatorUsed = extractUsedOperator();

  if(numPairArr[0] == 0 && numPairArr[1] == 0 && operatorUsed == "÷") return "Err: ÷ by 0";

  if(operatorUsed == "×") return multiply(numPairArr);
  else if(operatorUsed == "÷") return divide(numPairArr);
  else if(operatorUsed == "+") return add(numPairArr);
  else if(operatorUsed == "–") return subtract(numPairArr);
}

function extractInputNumPair() {
  return calcInput.value
  .replaceAll("×", ",")
  .replaceAll("÷", ",")
  .replaceAll("+", ",")
  .replaceAll("–", ",")
  .split(",")
  .map(num => Number(num));
}

function extractUsedOperator() {
  const arithOperatorsValid = ["×", "÷", "+", "–"]
  let operatorUsed = "";

  for(const arithOperator of arithOperatorsValid) {
    if(calcInput.value.indexOf(arithOperator) != -1) {
      return calcInput.value[calcInput.value.indexOf(arithOperator)];
    }
  }
}
// Use const incase the function is ever attempted for some reason to be reassigned    
const multiply = (numPairArr) => numPairArr[0] * numPairArr[1];
const divide = (numPairArr) => numPairArr[0] / numPairArr[1];
const add = (numPairArr) => numPairArr[0] + numPairArr[1];
const subtract = (numPairArr) => numPairArr[0] - numPairArr[1];

