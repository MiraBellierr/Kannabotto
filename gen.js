// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
