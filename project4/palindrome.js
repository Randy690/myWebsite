const input = document.querySelector("#text-input");
const button = document.querySelector("#check-btn");
const result = document.querySelector("#result");

const isPalindrome = () => {
  const cleanInput = input.value
    .toLowerCase()
    .trim()
    .replace(/[^A-Za-z0-9]/g,"");
  if(input.value === ""){
    return alert("Please input a value");
  }
  else{
    if (cleanInput === cleanInput.split('').reverse().join(''))
    {
        result.classList.remove('hide');
        return result.innerHTML = `<p class = "user-input"><strong>${input.value}</strong> is a palindrome</p>`;
    }
    else{
        result.classList.remove('hide');
        return result.innerHTML = `<p class = "user-input"><strong>${input.value}</strong> is <strong>NOT</strong> palindrome</p>`;
    }
  }
}

button.addEventListener("click",isPalindrome);