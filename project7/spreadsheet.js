const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
}

//The regex  passing to infixEval function will match two numbers with an operator between them. 
//The first number will be assigned to arg1 in the callback, the second to arg2, and the operator to operator.
const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => 
                infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));

//this function will account for order of operations, using regular expression to check for any number (\d.) followed by
// a * or / operator, then followed by another number
const highPrecedence = str => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  //now we can evaluate the expression
  const str2 = infixEval(str,regex);
  return str2 === str ? str : highPrecedence(str2);
  }

//this function will allow for numbers to be added together
const sum = nums => nums.reduce((acc, el) => acc + el, 0);

//function for if number is odd or even
const isEven = (num) => num % 2 === 0 ? true : false;

//function that gets the average
const average = (nums) => sum(nums)/nums.length;

//function to calculate the median of an array of numbers

const median = nums => {
    //using slice we create a shallow copy of the array before sorting it.
    //.sort((a,b) => a - b) --this function will take parameters a and b and subtract them, if the result is negative
    // a will be sorted before b, if 0 then no change, if positive then b will be sorted before a
    const sorted = nums.slice().sort((a, b) => a - b);
    const length = sorted.length;
    const middle = length / 2 - 1;
    return isEven(length) ? average([sorted[middle], sorted[middle + 1]]): sorted[Math.ceil(middle)];
  }

  //keep track of all spreadsheet functions 
  const spreadsheetFunctions={
    "": nums => nums,
    sum,
    average,
    median,
    even: nums => nums.filter(isEven),
    firsttwo: nums => nums.slice(0, 2),
    lasttwo: nums => nums.slice(-2),
    has2: nums => nums.includes(2) ? true : false,
    increment: nums => nums.map(num => num + 1),
    someeven: nums => nums.some(isEven),
    everyeven: nums => nums.every(isEven),
    random: ([x, y]) => Math.floor(Math.random() * y + x),
    range: nums => range(...nums),
    nodupes: nums => nums.filter((val,index)=> nums.indexOf(val)=== index),
  };

  //with this function we can start applying function parsing logic to a string.
  const applyFunction = (str) => {
    //handle precedence
    const noHigh = highPrecedence(str);
    //need to evaluate addition and subtraction, just like we did with 
    //multiplication and division in the high precedence function
    const infix = /([\d.]+)([+-])([\d.]+)/;
    const str2 = infixEval(noHigh, infix);
    //This expression will look for function calls like sum(1, 4).
    const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
    const toNumberList = (args) => args.split(',').map(parseFloat);
    //fn parameter will be passed the name of a function, such as "SUM"
    const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
    return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
  }


//first we will need to generate a range of numbers, and will utilize Array() and fill() methods to fill array with the start value
//need to use the .map() method on the .fill() so that all of the values are not the start value
const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index);

//now we can create a range of characters, going from numbers to string (specifically char) thus we will first use .charCodeAt()
//then we will use the String.fromCharCode to convert to string
const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

//In order to run your spreadsheet functions, need to be able to parse and evaluate the input string
const evalFormula = (x, cells) => {
  const idToText = (id) => cells.find((cell) => cell.id === id).value;
  
  //need to be able to match cell ranges in a formula
  //can use a regular expression to match these patterns
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1,num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = num => character =>  idToText(character + num);
  const addCharacters = character1 => character2 => num => charRange(character1, character2).map(elemValue(num));
  const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(addCharacters(char1)(char2)));
  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded,cells);
}


window.onload = () => {
  const container = document.getElementById("container");
  const createLabel = (name) => {
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = name;
    container.appendChild(label);
  }
  //passing this through our char range, the spreadsheet fills the top row with letters A-J
  const letters = charRange("A", "J");
  letters.forEach(createLabel);
  range(1, 99).forEach(number => {
    createLabel(number);

    //This block of code allows us to see the cells of the spreadsheet 
    letters.forEach(letter => {
        const input = document.createElement("input");
        input.type = "text";
        input.id = letter + number;
        input.ariaLabel = letter + number;
        input.onchange = update;
        container.appendChild(input);
    })
})
}

//since update is running as a change event listener, event parameter will be a change event
const update = event => {
  const element = event.target;

  //Because the change event is triggering on an input element, 
  //the element will have a value property that represents the current value of the input.
  //we will use the .replace method to remove all whitespace
  const value = element.value.replace(/\s/g, '');

  //check if the value does not include the id of element and if the value starts with the '=' sign
  if(!value.includes(element.id && value.startsWith('='))){
    element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
  }
}