function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch(operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case 'x':
      return multiply(a, b);
    case '/':
      return divide(a, b);
  }
}

function getResults() {
  if (operations.length < 3) return '';
  
  const num1 = operations[0];
  const operator = operations[1];
  const num2 = operations[2];

  if (!isFinite(num1) || !isFinite(num2)) return '';

  if (operator === '/' && Number(num2) === 0) return 'Division by zero';

  const result = operate(operator, num1, num2);
    
  const decimalCount = countDecimals(num1) + countDecimals(num2);

  const precision = decimalCount > 4 ? decimalCount : 4;
  
  return isFinite(result) ? parseFloat(result.toFixed(precision)).toString() : '';
}
  
function resetAll() {
  operations = [];
  results = '';
  userInput.textContent = '';
  resultOnDisplay.textContent = '';
}

function addNumber(arr, number) {
  const lastIndex = arr.length - 1;

  if (!arr.length || !isFinite(arr[lastIndex]) && isFinite(arr[lastIndex - 1])) { 
    if (arr[lastIndex] === '.') {
      arr[lastIndex] += number;
      return;
    }
    arr.push(number);
  
  } else {      
    arr[lastIndex] += number;
  }
}

function addOperator(arr, operator) {
  const lastIndex = arr.length - 1;
  
  if (!arr.length) {
    if (operator === '-') {  
      arr.push(operator);
      return true;
    }
    return false;
  
  } else {
    if (arr[lastIndex].includes('.')) decimalButton.disabled = false;
    
    if (arr[lastIndex] === operator) return false;
    
    if (isFinite(arr[lastIndex])) {
      arr.push(operator);
    
    } else {
      if ('x/'.indexOf(arr[lastIndex]) >= 0) {
        if (operator !== '-'){
          arr[lastIndex] = operator;
        
        } else {
          arr.push(operator)
        }
      
      } else {
        if (arr.length === 1) return false;
        if (!isFinite(arr[lastIndex]) && !isFinite(arr[lastIndex - 1])) {
          operations.pop();
          return true;
        }
        arr[lastIndex] = operator;
      }
    }
    return true;
  }
}

function updateDisplay() {
  userInput.textContent = operations.join('');

  if (!results) {
    resultOnDisplay.textContent = '';
    adjustFontSize(userInput);
  
  } else {
    resultOnDisplay.textContent = results;
    adjustFontSize(userInput);
    adjustFontSize(resultOnDisplay);
  } 
}

function adjustFontSize(elem) {
  let fontSize = parseInt(getComputedStyle(elem).getPropertyValue('font-size'));
  let widthOverflow = elem.scrollWidth > elem.parentNode.offsetWidth;

  while (!widthOverflow) {
    if (elem.scrollHeight >= elem.parentNode.offsetHeight || !elem.textContent) return;
    fontSize++;
    elem.style.fontSize = `${fontSize}px`;
    widthOverflow = elem.scrollWidth > elem.parentNode.offsetWidth;
  }

  while (widthOverflow) {
    fontSize--;
    elem.style.fontSize = `${fontSize}px`;
    widthOverflow = elem.scrollWidth > elem.parentNode.offsetWidth;
  }
}

function countDecimals(num) {
  num = num.toString();
  if (!num.includes('.')) return 0;
  
  const str = num.split('.');
  if (str[1] === (0).toString()) return 0;
  
  return str[1].length;
}

function toggleDecimalButton() {
  if (operations.length) {
    if(operations[operations.length - 1].includes('.')) {
      decimalButton.disabled = true;
    
    } else {
      decimalButton.disabled = false;
    }
  }
}

function handleNumberInput(str) {
  addNumber(operations, str);

  toggleDecimalButton();

  results = getResults();
  if (results === 'Division by zero') results = '';

  updateDisplay();
}

function handleOperatorInput(str) {
  if (operations.length >= 3 && isFinite(operations[operations.length - 1])) {
    operations = [];
    operations.push(results);
  }

  const success = addOperator(operations, str);
  if (!success) return;

  toggleDecimalButton();

  results = getResults();
  if (results === 'Division by zero') results = '';

  updateDisplay();
}

function handleEqualsInput() {
  if (getResults() === 'Division by zero') {
    results = 'Very funny';
    updateDisplay();
  }
  
  if (!resultOnDisplay.textContent) return;
  
  userInput.textContent = resultOnDisplay.textContent;
  resultOnDisplay.textContent = '';
  adjustFontSize(userInput);
}

function handleBackspaceInput() {
  const lastIndex = operations.length - 1;
  if (!operations[lastIndex]) return;
    
  operations[lastIndex] = operations[lastIndex].slice(0,-1);
  
  if (!operations[lastIndex]) operations.pop();
  
  toggleDecimalButton();
  
  results = getResults();
  if (results === 'Division by zero') results = '';

  updateDisplay();
}

function handleKeyboardInput(event) {
  const key = event.code;
  const button = document.querySelector(`button[data-code='${key}']`);
  if (!button) return;
  if (key === 'NumpadDivide') event.preventDefault();
  
  if ('0123456789.'.indexOf(button.textContent) >= 0) handleNumberInput(button.textContent);

  if ('/x-+'.indexOf(button.textContent) >= 0) handleOperatorInput(button.textContent);

  if (button.textContent === '=') handleEqualsInput();

  if (button.textContent === 'BACK') handleBackspaceInput();

  if (button.textContent === 'AC') resetAll();
}

let operations = [];
let results = '';
const userInput = document.querySelector('.input div');
const resultOnDisplay = document.querySelector('.result div');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const decimalButton = document.querySelector('.decimal');
const equalsButton = document.querySelector('.equals');
const backspaceButton = document.querySelector('.backspace');
const clearButton = document.querySelector('.clear');

numberButtons.forEach(button => button.addEventListener('click', (e) => handleNumberInput(e.currentTarget.textContent)))

operatorButtons.forEach(button => button.addEventListener('click', (e) => handleOperatorInput(e.currentTarget.textContent)))

equalsButton.addEventListener('click', handleEqualsInput)

backspaceButton.addEventListener('click', handleBackspaceInput)

clearButton.addEventListener('click', resetAll);

document.addEventListener('keydown', (e) => handleKeyboardInput(e))
