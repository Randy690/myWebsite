const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

//the /g will tell the pattern to continue looking after it has found a match
//in this case we will be replacing anything that is a + - or a space, to a blank
function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex,"");
}

function isInvalidInput(str) {
    //first we are checking for scientific notation in the input
    // the /i checks for uppercase, [0-9] alternatively \d shorthand character class to match any digit
    
    const regex = /\d+e\d+/i;
    
    //.match() will return an array of match results – containing either the first match, or all matches if the global flag is used.
    
    return str.match(regex);
}
    
function addEntry(){
    //first need to know which category entry goes in, we will get value from entryDropDown
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

    const HTMLString = `<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
                        <input type="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name">
                        <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
                        <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories">`;
    
    //will allow for us to add entries, without the previous entry data being removed/reset
    targetInputContainer.insertAdjacentHTML("beforeend",HTMLString);
}

//e will be an event listener, so the first argument passed will be the browser event
function calculateCalories(e){
    //need to prevent page from reloading when we press submit button
    e.preventDefault();
    isError = false;
    
    //getCaloriesFromInputs takes a node list, which is like an array as an argument,
    //but we use get ELEMENT by id for the budget, thus we pass  the argument in the format below for it to work
    //get the calorie budget set by the user
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    //Need to get values from user entries, input[type=number] returns any number 
    //inputs in the #breakfast element, same thing for lunch and dinner snacks and exercise
    const breakfastNumberInputs = document.querySelectorAll(`#breakfast input[type=number]`);
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    
    if(isError){return;}

    //get and calculate remaining calories
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

    const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

    //display results
    output.innerHTML = `<span class = "${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
                        <hr>
                        <p>${budgetCalories} Calories Budgeted</p>
                        <p>${consumedCalories} Calories Consumed</p>
                        <p>${exerciseCalories} Calories Burned</p>`;
    
    //Since output was initially hidden, we need to remove the hidden attribute.
    output.classList.remove('hide');

}


//getting the calories from the list of inputs from user, need to parse through the node list and access the individual items
function getCaloriesFromInputs(list){
    let calories = 0;
    for (const item of list){
        //clean user input and get the current value of the item and check if the input is valid
        const currVal = cleanInputString(item.value);
        invalidInputMatch = isInvalidInput(currVal);

        //if we find a match for an invalid input, send a browser alert followed by the first value, 
        //then set error flag to true, return null
        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
          }
        calories += Number(currVal);
    }
    return calories;
}

//functionality for reset
function clearForm(){
    //get access to all input containers
    //document.querySelectorAll returns a NodeList, 
    //which is array-like but is not an array. However, the 
    //Array object has a .from() method that accepts an array-like and returns an array
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));

    for(const container of inputContainers){
        container.innerHTML = ``;
      }
      budgetNumberInput.value = '';
      output.innerText = '';
      output.classList.add('hide');
}


addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit",calculateCalories);
clearButton.addEventListener("click",clearForm);