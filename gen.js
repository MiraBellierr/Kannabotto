const arr = [0, 0, 0, 0, 0, 0];

while (arr[0] + arr[1] + arr[2] + arr[3] + arr[4] + arr[5] !== 21) {
	arr[0] = getRandomArbitrary(1, 10);
	arr[1] = getRandomArbitrary(1, 10);
	arr[2] = getRandomArbitrary(1, 10);
	arr[3] = getRandomArbitrary(1, 10);
	arr[4] = getRandomArbitrary(1, 10);
	arr[5] = getRandomArbitrary(1, 10);
}

console.log(arr);


function getRandomArbitrary(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
