const submitBtn = document.getElementById('submit-btn');

const outputDetails = () =>{
    const inputName = document.getElementById('name').value;
    const inputAge = document.getElementById('age').value;
    const output = document.getElementById('output');

    if(inputName === '' || inputName === ' '){
        alert('Please enter your name');
    } else if(inputAge === '' || inputAge === '0'){
        alert('Please enter a valid age');
    } else{
        const outputName = document.createElement('p');
        const outputAge = document.createElement('p');

        outputName.textContent = `Your name is ${inputName}`;
        outputAge.textContent = `Your age is ${inputAge}`;

        output.appendChild(outputName);
        output.appendChild(outputAge);
    }
}

submitBtn.addEventListener('click', outputDetails);