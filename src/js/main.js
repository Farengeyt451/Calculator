const numberBtns = document.querySelectorAll(".number");
const operationBtns = document.querySelectorAll(".operation");
const decimalBtn = document.querySelector("#decimal");
const clearBtn = document.querySelector("#clear");
const outputRes = document.querySelector("#output");
const onOffBtn = document.querySelector("#onOff");

let memCurNum = 0;
let memNewNum = false;
let memPending = "";

function onOff() {
	if (onOffBtn.checked) {
		outputRes.style.visibility = "visible";
	} else {
		outputRes.style.visibility = "hidden";
		clear();
	}
}

function checkLength(value) {
	return outputRes.value.length < 14;
}

function pressNumber(e) {
	if (!onOffBtn.checked) {
		outputRes.style.visibility = "visible";
		onOffBtn.checked = true;
	}
	if (memNewNum) {
		outputRes.value = this.value;
		memNewNum = false;
	} else {
		if (outputRes.value === "0") {
			outputRes.value = this.value;
		} else {
			if (checkLength(outputRes.value)) outputRes.value += this.value;
		}
	}
}

function pressOperation(e) {
	let memLocalValue = outputRes.value;
	if (memNewNum && memPending !== "=") {
		// outputRes.value = memCurNum;
		if (memCurNum.toString().length > 14) {
			console.info("> 14");
			outputRes.value = memCurNum.toString().slice(0, 1) + "." + memCurNum.toString().slice(1, 10) + "e+" + (memCurNum.toString().length - 1);
			console.log(memCurNum);
			console.log(memCurNum.toString().length);
		} else {
			console.info("< 14");
			outputRes.value = memCurNum;
		}
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
		if (memCurNum.toString().length > 14) {
			console.info("> 14");
			outputRes.value = memCurNum.toString().slice(0, 1) + "." + memCurNum.toString().slice(1, 10) + "e+" + (memCurNum.toString().length - 1);
			console.log(memCurNum);
			console.log(memCurNum.toString().length);
		} else {
			console.info("< 14");
			outputRes.value = memCurNum;
		}
		memPending = this.value;
	}
}

function decimal() {
	let memDecimal = outputRes.value;
	if (memNewNum) {
		memDecimal = "0.";
		memNewNum = false;
	} else {
		if (memDecimal.indexOf(".") === -1) {
			memDecimal += ".";
		}
	}
	outputRes.value = memDecimal;
}

function clear() {
	outputRes.value = "0";
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
