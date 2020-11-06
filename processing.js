var model;

//loading the model
async function loadModel(){
      model = await tf.loadGraphModel('TFJS/model.json')
}

function predictImage() {
	//get image from canvas
	let image = cv.imread(canvas);

	//convert to graysacale
	cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);

	//apply thresholding
	cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

	//find the contours
	let contours = new cv.MatVector();
	let hierarchy = new cv.Mat();
	cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

	//bounding rectangle
	let cnt = contours.get(0);
	let rect = cv.boundingRect(cnt);

	//region of interest method - crop image
	image = image.roi(rect)

	//image height and width
	var height = image.rows;
	var width = image.cols;

	//resize image - mainly shrink the longer edge short edge will shrink accordingly
	if(height > width) {
		height = 20;
		const scaleFactor = image.rows/height;
		width = Math.round(image.cols/scaleFactor);
	}
	else {
		width = 20;
		const scaleFactor = image.cols/width;
		height = Math.round(image.rows/scaleFactor);
	}

	//size of new image
	let newSize = new cv.Size(width, height);

	//resizing image according to MNIST database
	cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

	//add padding on each side to make image to 28x28 pixel format
	const LEFT = Math.ceil(4 + (20 - width)/2);
	const RIGHT = Math.floor(4 + (20 - width)/2);
	const TOP = Math.ceil(4 + (20 - height)/2);
	const BOTTOM = Math.floor(4 + (20 - height)/2);
	const BLACK = new cv.Scalar(0, 0, 0, 0);
	cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

	//find the centre of mass of image using image moments(weighted averages such as mean, median, etc.)
	cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
	cnt = contours.get(0);
	const Moments = cv.moments(cnt, false); //false as image is not a binary image
	const cx = Moments.m10 / Moments.m00; //x coordinate of com
	const cy = Moments.m01 / Moments.m00; //y coordinate of com

	//shift the image to get the centre of mass to centre of image
	const x_shift = Math.round(image.cols/2.0 - cx);
	const y_shift = Math.round(image.rows/2.0 - cy);
	newSize = new cv.Size(image.cols, image.rows);
	const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, x_shift, 0, 1, y_shift]); //transformation matrix of size 2x3 and values [[1, 0, x_shift];[0, 1, y_shift]]
	cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK) //shifting image

	//normalise the pixel values
	let pixelValues = image.data;
	pixelValues = Float32Array.from(pixelValues); //conver array from int to floating point numbers
	pixelValues = pixelValues.map(function(pixel) {
		return pixel / 255.0;
	});

	//create a tensor and make a prediction
	const X = tf.tensor([pixelValues]); //making a 2d tensor
	const result = model.predict(X);
	result.print();

	//get result from model
	const output = result.dataSync()[0];

	//delete objects and tensors - for memory management
	image.delete();
	contours.delete();
	cnt.delete();
	hierarchy.delete();
	M.delete();
	X.dispose();
	result.dispose();

	return output;
}