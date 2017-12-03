const numberBtns = document.querySelectorAll(".number");
const operationBtns = document.querySelectorAll(".operation");
const decimalBtn = document.querySelector("#decimal");
const clearBtn = document.querySelector("#clear");
const outputRes = document.querySelector("#output");
const onOffBtn = document.querySelector("#onOff");

let memCurNum = 0;
let memNewNum = false;
let memPending = "";
let intermediateVal = 0;

function onOff() {
	if (onOffBtn.checked) {
		outputRes.style.visibility = "visible";
	} else {
		outputRes.style.visibility = "hidden";
		clear();
	}
}

function onIfButtonPressed() {
	if (!onOffBtn.checked) {
		outputRes.style.visibility = "visible";
		onOffBtn.checked = true;
	}
}

// Output results to display
function showRes(num) {
	let stringNum = num.toString();
	console.log(stringNum + " " + stringNum.length + " " + typeof stringNum);
	if (stringNum.length > 14) {
		if (num > 1) {
			if (stringNum.indexOf(".") === -1) {
				outputRes.value = stringNum.slice(0, 1) + "." + stringNum.slice(1, 10) + "e+" + (stringNum.length - 1);
			} else {
				outputRes.value = stringNum.slice(0, 1) + stringNum.slice(1, 10) + "e+" + (stringNum.length - 1);
			}
		} else {
			console.log(stringNum.search(/[1-9]/));
			let startDecimal = stringNum.search(/[1-9]/);
			outputRes.value = stringNum.slice(startDecimal, startDecimal + 1) + "." + stringNum.slice(startDecimal + 1, 11 + startDecimal) + "e-" + (startDecimal - 1);
		}
	} else {
		outputRes.value = stringNum;
	}
}

function pressNumber(e) {
	onIfButtonPressed();
	if (memNewNum) {
		intermediateVal = this.value;
		showRes(intermediateVal);
		memNewNum = false;
	} else {
		if (outputRes.value === "0") {
			intermediateVal = this.value;
			showRes(intermediateVal);
		} else {
			intermediateVal += this.value;
			showRes(intermediateVal);
		}
	}
}

function pressOperation(e) {
	let memLocalValue = intermediateVal;
	if (memNewNum && memPending !== "=") {
		showRes(intermediateVal);
	} else {
		memNewNum = true;
		if (memPending === "+") {
			memCurNum = (memCurNum * 10 + parseFloat(memLocalValue) * 10) / 10;
		} else if (memPending === "-") {
			memCurNum = (memCurNum * 10 - parseFloat(memLocalValue) * 10) / 10;
		} else if (memPending === "*") {
			memCurNum *= parseFloat(memLocalValue);
		} else if (memPending === "/") {
			memCurNum /= parseFloat(memLocalValue);
		} else {
			memCurNum = parseFloat(memLocalValue);
		}
		intermediateVal = memCurNum;
		memPending = this.value;
		showRes(intermediateVal);
	}
}

function decimal() {
	let memDecimal = intermediateVal;
	onIfButtonPressed();
	console.log(memDecimal + " memDec");
	if (memNewNum) {
		memDecimal = "0.";
		memNewNum = false;
	} else {
		if (memDecimal.toString().indexOf(".") === -1) {
			memDecimal += ".";
		}
	}
	intermediateVal = memDecimal;
	showRes(memDecimal);
}

function clear() {
	outputRes.value = "0";
	intermediateVal = "0";
	memNewNum = true;
	memCurNum = 0;
	memPending = "";
}

onOffBtn.addEventListener("change", onOff);

numberBtns.forEach((btn, index) => {
	btn.addEventListener("click", pressNumber);
});

operationBtns.forEach((btn, index) => {
	btn.addEventListener("click", pressOperation);
});

decimalBtn.addEventListener("click", decimal);
clearBtn.addEventListener("click", clear);
