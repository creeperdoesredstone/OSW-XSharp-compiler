const importBtn = document.getElementById("import-btn");
const fileInput = document.getElementById("file-input");

importBtn.addEventListener("click", () => {
	fileInput.click();
});

fileInput.addEventListener("change", () => {
	const output = document.getElementById("code");
	const file = event.target.files[0];
	if (!file) {
		return;
	}

	const reader = new FileReader();

	reader.onload = (e) => {
		const content = e.target.result;
		output.innerText = content;
	};

	reader.readAsText(file);
});

const checkRPNState = () => {
	const rpnDisplay = document.getElementById("rpn-output");
	if (!showRPNCheck.checked) rpnDisplay.style = "display: none;";
	else rpnDisplay.style = "";
};

const showRPNCheck = document.getElementById("show-rpn");
showRPNCheck.addEventListener("change", checkRPNState);

checkRPNState();
