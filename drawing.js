const Background_Colour = '#000';
const line_colour = '#fff';
const line_width = 15;
var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;
var canvas;
var context;

function draw() {
	context.beginPath();
	context.moveTo(previousX, previousY);
	context.lineTo(currentX, currentY);
	context.closePath();
	context.stroke();
}

function prepareCanvas() {
	console.log('Preparing Canvas');
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	var drawing = false;

	context.fillStyle = Background_Colour;
	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.strokeStyle = line_colour;
	context.lineWidth = line_width;
	context.lineJoin = "round";

	// For mouse events
	document.addEventListener('mousedown', function (event) {
		drawing = true;
		currentX = event.clientX - canvas.offsetLeft;
		currentY = event.clientY - canvas.offsetTop;

	});

	document.addEventListener('mousemove', function (event) {
		if(drawing){
			previousX = currentX;
			currentX = event.clientX - canvas.offsetLeft;
			previousY = currentY;
			currentY = event.clientY - canvas.offsetTop;
			draw();
		}
	});

	document.addEventListener('mouseup', function (event) {
		drawing = false;
	});

	canvas.addEventListener('mouseleave', function (event) {
		drawing = false;
	});

	// For touch events
	canvas.addEventListener('touchstart', function (event) {
		drawing = true;
		currentX = event.touches[0].clientX - canvas.offsetLeft;
		currentY = event.touches[0].clientY - canvas.offsetTop;

	});

	canvas.addEventListener('touchmove', function (event) {
		if(drawing){
			previousX = currentX;
			currentX = event.touches[0].clientX - canvas.offsetLeft;
			previousY = currentY;
			currentY = event.touches[0].clientY - canvas.offsetTop;
			draw();
		}
	});

	canvas.addEventListener('touchcancel', function (event) {
		drawing = false;
	});

	canvas.addEventListener('touchend', function (event) {
		drawing = false;
	});
}

function clearCanvas() {
	currentX = 0;
	currentY = 0;
	previousX = 0;
	previousY = 0;
	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}