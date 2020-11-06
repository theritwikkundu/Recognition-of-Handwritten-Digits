var answer;

function nextQuestion() {
	const num1 = Math.floor(Math.random() * 5);
	document.getElementById('n1').innerHTML = num1;
	const num2 = Math.floor(Math.random() * 6);
	document.getElementById('n2').innerHTML = num2;
	answer = num1 + num2;
}

function checkAnswer() {
	const prediction = predictImage();
	if(prediction == answer){
		alert("CONGRATULATIONS! YOUR ANSWER IS CORRECT.");
	}
	else{
		alert("YOUR ANSWER IS WRONG! BETTER LUCK NEXT TIME.");
	}
}