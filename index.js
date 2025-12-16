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
		output.innerText = content; // Display the content
	};

	// Read the file as text (other methods like readAsDataURL also exist)
	reader.readAsText(file);
});
