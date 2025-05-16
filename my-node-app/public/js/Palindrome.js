const textInput = document.getElementById('text-input');
const resultDiv = document.getElementById('result');
const checkBtn = document.getElementById('check-btn');

const checkButton = () => {
  const input = textInput.value;

  if (input === '') {
    alert('Please input a value');
    return;
  }

  resultDiv.replaceChildren();

  const originalInput = input;
  const lowerCaseStr = input.replace(/[^A-Za-z0-9]/gi, '').toLowerCase();
  const isPalindrome = lowerCaseStr === [...lowerCaseStr].reverse().join('');
  const resultMsg = `${originalInput} ${isPalindrome ? 'is' : 'is not'} a palindrome.`;

  const pTag = document.createElement('p');
  pTag.className = 'user-input';
  pTag.innerText = resultMsg;
  resultDiv.appendChild(pTag);

  textInput.value = '';
};

checkBtn.addEventListener('click', checkButton)
