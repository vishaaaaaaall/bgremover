const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const uploadSpinner = document.getElementById('uploadSpinner');
const removeSpinner = document.getElementById('removeSpinner');
const removeBackgroundBtn = document.getElementById('removeBackgroundBtn');
const resetBtn = document.getElementById('resetBtn');
const outputSection = document.getElementById('output');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');

// API key for Remove.bg
const API_KEY = "1eVmq61BtNLvCkaPqCgwEpTn";

// Show file preview only in the upload box
fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Clear any previous preview in the result section
      filePreview.innerHTML = '';

      // Show file preview in the upload box (NOT in the output section)
      filePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; border-radius: 10px;">`;
    };
    reader.readAsDataURL(file);

    // Show upload animation
    uploadSpinner.style.display = 'block';
    setTimeout(() => {
      uploadSpinner.style.display = 'none';
    }, 2000); // Simulate upload animation
  }
});

// Handle background removal
removeBackgroundBtn.addEventListener('click', async function () {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload an image first!");
    return;
  }

  removeSpinner.style.display = 'block';

  const formData = new FormData();
  formData.append('image_file', file);

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to remove background. Please try again.");
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Clear any preview before showing the processed image
    filePreview.innerHTML = ''; // Remove the preview from the upload section

    // Display the processed image in the result section
    resultImage.src = imageUrl;
    outputSection.style.display = 'block';
    removeSpinner.style.display = 'none';

    // Enable the download button
    downloadBtn.addEventListener('click', function () {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'background-removed-image.png';
      link.click();
    });
  } catch (error) {
    alert(`Error: ${error.message}`);
    removeSpinner.style.display = 'none';
  }
});

// Reset the application
resetBtn.addEventListener('click', function () {
  fileInput.value = "";
  filePreview.innerHTML = ""; // Clear the preview in the upload box
  outputSection.style.display = 'none'; // Hide the result section
  removeSpinner.style.display = 'none';
});
