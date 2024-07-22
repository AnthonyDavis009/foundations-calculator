
const clearBtn = document.querySelector("#clr-btn");
const calcInput = document.querySelector("#calc-input");
const calcBtnUsable = document.querySelectorAll(".calc-btn-usable");
const enterBtn = document.querySelector("#enter-btn");

calcBtnUsable.forEach(node => {
    node.addEventListener("click", () => {
    eraseErrMsg();
    if(inputMisuseCase() == "leading operator") {
        calcInput.value = "";
     } else if(inputMisuseCase() == "adjacent operator") {
         calcInput.value = calcInput.value.slice(0, calcInput.value.length - 1);
     }
     calcInput.value += node.textContent;
    });
});

calcInput.addEventListener("keydown", e => {
  eraseErrMsg();

  // Remember that strings are immutable and cannot edit them directly with array index [] 
  // But can instead copy/display their values
  let allowedInputArr = ['0','1','2','3','4','5','6','7','8','9','*','/','+','-', 'Backspace'];
  if(!allowedInputArr.includes(e.key)) {
    e.preventDefault();
  } else if(e.key == "*") {
    e.preventDefault();
    calcInput.value += "×";
  } else if(e.key == "/") {
    e.preventDefault();
    calcInput.value += "÷";
  } else if(e.key == "-") {
    e.preventDefault();
    calcInput.value += "–";
  }
  
  if(inputMisuseCase() == "leading operator") {
     calcInput.value = "";
  } else if(inputMisuseCase() == "adjacent operator") {
      calcInput.value = calcInput.value.slice(0, calcInput.value.length - 1);
  }
});

enterBtn.addEventListener("click", () => {
  let calcInputCurr = calcInput.value;
  let recombinedArr = recombineArrays(obtainNumsUsed(calcInputCurr), obtainArithOperatorsUsed(calcInputCurr));
  calcInput.value = getCalculations(recombinedArr);
});

clearBtn.addEventListener("click", () => calcInput.value = "");

function inputMisuseCase() {
  const arithOperatorsValid = ["×", "÷", "+", "–"]
  if(arithOperatorsValid.includes(calcInput.value[0])) {
    return "leading operator";
  } else if(
    arithOperatorsValid.includes(calcInput.value[calcInput.value.length - 1]) &&
    arithOperatorsValid.includes(calcInput.value[calcInput.value.length - 2])) {
      return "adjacent operator";
  }
}

function obtainNumsUsed(calcInputCurr) {
    // replaceAll is not destructive so assignment must be used to modify numsUsed
      return calcInputCurr
      .replaceAll("×", ",")
      .replaceAll("÷", ",")
      .replaceAll("+", ",")
      .replaceAll("–", ",")
      .split(",")
      .map(num => Number(num));
  }
  
function obtainArithOperatorsUsed(calcInputCurr) {
    let arithOperationsArr = [];
    for(const char of calcInputCurr) {
        if(char == "×" || char == "÷" ||
           char == "+" || char == "–") {
           arithOperationsArr.push(char);
        }
    }
    return arithOperationsArr;
}

function recombineArrays(numsUsed, arithOperators) {
    let numsUsedArr = numsUsed;
    let arithOperationsArr = arithOperators;
    let combinedArr = [];
    for(let i = 0; i < numsUsedArr.length; i++) {
      combinedArr.push(numsUsedArr[i]);
      if(i < numsUsedArr.length - 1) {
        combinedArr.push(arithOperationsArr[i]);
      }
    }
    return combinedArr;
}

function getCalculations(recombinedArr) {
    let calcStringArr = recombinedArr;
    // Multiplication and division
    for(let i = 1; i < calcStringArr.length; i+=2) {
      if(calcStringArr[i] == "×") {
        calcStringArr.splice(i - 1, 3, multiply(calcStringArr, i));
        i -= 2;
      } else if(calcStringArr[i] == "÷") {
        if(calcStringArr[i - 1] == 0 && calcStringArr[i + 1] == 0) {
          return "Err: ÷ by 0";
        } else {
          calcStringArr.splice(i - 1, 3, divide(calcStringArr, i));
          i -= 2;
        }
      }
    }
    // Addition and subtraction
    for(let i = 1; i < calcStringArr.length; i+=2) {
      if(calcStringArr[i] == "+") {
        calcStringArr.splice(i - 1, 3, add(calcStringArr, i));
        i -= 2;
      } else if(calcStringArr[i] == "–") {
        calcStringArr.splice(i - 1, 3, subtract(calcStringArr, i));
        i -= 2;
      }
    }

    if(Number.isInteger(calcStringArr[0])) {
      return calcStringArr[0];
    } else {
      return calcStringArr[0].toFixed(3);
    }
  }
// Use const incase the function is ever attempted for some reason to be reassigned 
const multiply = (calcStringArr, i) => calcStringArr[i-1] * calcStringArr[i+1];
const divide = (calcStringArr, i) => calcStringArr[i-1] / calcStringArr[i+1];
const add = (calcStringArr, i) => calcStringArr[i-1] + calcStringArr[i+1];
const subtract = (calcStringArr, i) => calcStringArr[i-1] - calcStringArr[i+1];

function eraseErrMsg() {
  if(calcInput.value == "Err: ÷ by 0") calcInput.value = "";
}


