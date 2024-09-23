const numberInput = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("output");

//use an algorithim to convert the number entered by the user to roman numerals
//TLDR: if user input is divisible by the number at the current index, add the corresponding roman symbol (quotient) number of times
//then repeat
const convertToRoman = (num) =>{
    //first setup 2 arrays, one for the roman symbols, the second for the corresponding numbers
    const symbols = ["I","IV","V","IX","X","XL","L","XC","C","CD","D","CM","M"];
    const arabicNumbers = [1,4,5,9,10,40,50,90,100,400,500,900,1000];
    let solution = "";
    let div;
    //setup the array index, we start at 12, then end of the arrays then go backwards.
    let arrayIndex = 12;
    //as long as the number is not 0
    while(num >0){
        //we will store the quotient of userinput divided by the number at the current index
        div = Math.floor(num/arabicNumbers[arrayIndex]);
        //then the remainder will become the new number
        num = num%arabicNumbers[arrayIndex];
        //depending on the quotient, will decide how many times the symbol is repeated 
        //(EX: 3000/1000, quotient = 3 thus M will be added 3 times)
        while(div--){
            solution += symbols[arrayIndex];
        }
        //then decrement the array index by 1
        arrayIndex--;
    }
    result.innerText = solution;
}

const checkInput = () =>{ 
    if(numberInput.value === ""){
        result.innerHTML = "Please enter a valid number";
        return;
    }
    if(numberInput.value < 0){
        result.innerHTML = "Please enter a number greater than or equal to 1";
        return;
    }
    if(numberInput.value >= 4000){
        result.innerHTML = "Please enter a number less than or equal to 3999";
        return;
    }
    convertToRoman(numberInput.value);
    numberInput.value = "";
}

convertBtn.addEventListener("click", checkInput);