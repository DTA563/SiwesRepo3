const number = document.getElementById('number');
const convertBtn = document.getElementById('convert-btn');
const output = document.getElementById('output')

const converter = () => {
    const num = number.value

    if (num === ''){
        output.innerHTML = `<div class="alert">
            Please enter a valid number
        </div>`
    }else if (num < 1){
        output.innerHTML = `<div class="alert">
            Please enter a number greater than or equal to 1
        </div>`
    } else if(num >= 4000){
        output.innerHTML = `<div class="alert">
            Please enter a number less than or equal to 3999
        </div>`
    } else{
        const romanNumeral = toRoman(Number(num));
        output.innerHTML = `<div class="output">
            <strong>${romanNumeral}</strong>
        </div>`
    };
};

const toRoman = (num) => {
    const lookup = [
      { value: 1000, symbol: 'M' },
      { value: 900, symbol: 'CM' },
      { value: 500, symbol: 'D' },
      { value: 400, symbol: 'CD' },
      { value: 100, symbol: 'C' },
      { value: 90, symbol: 'XC' },
      { value: 50, symbol: 'L' },
      { value: 40, symbol: 'XL' },
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' },
    ];

    let result = '';
    for (let i = 0; i < lookup.length; i++) {
        while (num >= lookup[i].value) {
            result += lookup[i].symbol;
            num -= lookup[i].value;
        }
    }
    return result;
};

convertBtn.addEventListener('click', converter)

number.addEventListener('keydown', (e) =>{
  if(e.key === 'Enter'){
    e.preventDefault();
    converter()
  }
})