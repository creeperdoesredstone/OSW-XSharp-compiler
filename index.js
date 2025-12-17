const importBtn = document.getElementById("import-btn");
const fileInput = document.getElementById("file-input");
const exportBtn = document.getElementById("export-btn");
const showRPNCheck = document.getElementById("show-rpn");

importBtn.addEventListener("click", () => {
	fileInput.click();
});

const checkRPNState = () => {
	const rpnDisplay = document.getElementById("rpn-output");
	if (!showRPNCheck.checked) rpnDisplay.style = "display: none;";
	else rpnDisplay.style = "";
};

function downloadFile(fn) {
	var textToWrite = document
		.getElementById("code")
		.innerText.replace(" ", " ");
	const fileNameToSaveAs = fn + ".xs";
	const textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });

	const downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
	window.URL.revokeObjectURL(downloadLink.href);
}

fileInput.addEventListener("change", (event) => {
	const output = document.getElementById("code");
	const file = event.target.files[0];
	if (!file) {
		return;
	}

	const reader = new FileReader();

	reader.onload = (e) => {
		const content = e.target.result;
		output.innerText = content.replace("\t", "    ");
	};

	reader.readAsText(file);
});

showRPNCheck.addEventListener("change", checkRPNState);

exportBtn.addEventListener("click", () => {
	downloadFile(document.getElementById("fn").value)
})

checkRPNState();
