const numberBtns = document.querySelectorAll(".number");
const operationBtns = document.querySelectorAll(".operation");
const decimalBtn = document.querySelector("#decimal");
const resultBtn = document.querySelector("#result");
const clearBtn = document.querySelector("#ce");
const outputRes = document.querySelector("#output");
let memCurNum = 0;
let memNewNum = false;
let memPending = "";

// numberBtns.forEach((btn, index) => {
// 	let number = numberBtns[index];
// 	btn.addEventListener("click", function(e) {
// 		console.log(e);
// 		pressNumber(e.target.textContent);
// 	});
// });

numberBtns.forEach((btn, index) => {
	let number = numberBtns[index];
	btn.addEventListener("click", pressNumber);
});

operationBtns.forEach((btn, index) => {
	let operation = operationBtns[index];
	btn.addEventListener("click", pressOperation);
});

decimalBtn.addEventListener("click", pressNumber);
// resultBtn.addEventListener("click", pressNumber);
clearBtn.addEventListener("click", clear);

function pressNumber(e) {
	console.log(this.value);
	if (outputRes.value === "0") {
		outputRes.value = e.target.textContent;
	} else {
		outputRes.value += e.target.textContent;
	}

	console.log(e.target.textContent);
}

function pressOperation(e) {
	console.log(this.value);
}

function decimal() {

}

function clear() {

}
