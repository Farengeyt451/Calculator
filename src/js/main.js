const numberBtns = document.querySelectorAll(".number");
const operationBtns = document.querySelectorAll(".operation");
const decimalBtn = document.querySelector("#decimal");
const clearBtn = document.querySelector("#clear");
const outputRes = document.querySelector("#output");
const onOffBtn = document.querySelector("#onOff");
const valueMemBtn = document.querySelector("#value-mem");
const useMemBtn = document.querySelector("#use-mem");
const cleanMemBtn = document.querySelector("#clean-mem");

let memCurNum = 0;
let memNewNum = false;
let memPending = "";
let intermediateVal = 0;
let memoryVal;

function onOff() {
	if (onOffBtn.checked) {
		outputRes.style.visibility = "visible";
	} else {
		outputRes.style.visibility = "hidden";
		clearDisplay();
		clearMemValue();
	}
}

function onIfButtonPressed() {
	if (!onOffBtn.checked) {
		outputRes.style.visibility = "visible";
		onOffBtn.checked = true;
	}
}

function clearDisplay() {
	outputRes.value = "0";
	intermediateVal = "0";
	memNewNum = true;
	memCurNum = 0;
	memPending = "";
}

function pressNumber(e) {
	onIfButtonPressed();
	if (memNewNum) {
		intermediateVal = this.value;
		memNewNum = false;
		showRes(intermediateVal);
	} else {
		if (outputRes.value === "0") {
			intermediateVal = this.value;
			showRes(intermediateVal);
			if (intermediateVal.length > 14) return;
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

function pressDecimal() {
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

function showRes(num) {
	let stringNum = num.toString();
	console.log(stringNum + " " + stringNum.length + " " + typeof stringNum);
	if (stringNum.length > 14) {
		outputRes.value = stringNum.slice(0, 14);
	} else {
		outputRes.value = stringNum;
	}
}

function copyMemValue() {
	memoryVal = intermediateVal;
	console.log(`В памяти ${memoryVal}`);
}

function pasteMemValue() {
	if (memoryVal) {
		intermediateVal = memoryVal;
		memNewNum = false;
		showRes(intermediateVal);
	}
	return;
}

function clearMemValue() {
	memoryVal = 0;
}

onOffBtn.addEventListener("change", onOff);

clearBtn.addEventListener("click", clearDisplay);

numberBtns.forEach(btn => {
	btn.addEventListener("click", pressNumber);
});

operationBtns.forEach(btn => {
	btn.addEventListener("click", pressOperation);
});

decimalBtn.addEventListener("click", pressDecimal);

valueMemBtn.addEventListener("click", copyMemValue);

useMemBtn.addEventListener("click", pasteMemValue);

cleanMemBtn.addEventListener("click", clearMemValue);
