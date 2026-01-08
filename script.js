// --- 1. Element Selection ---
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

// Perform null check on canvas before attempting to get context
let ctx = null;
if (canvas) {
    ctx = canvas.getContext("2d");
} else {
    console.error("Initialization Error: Canvas element (id='canvas') not found.");
}

const overlayTop = document.getElementById("overlay-top");
const objects = {
    // Stores references to draggable objects like the circle
    circle: document.getElementById("circle"),
};

// Button references
const captureBtn = document.getElementById("capture");
const saveBtns = document.getElementById("save");
const addButtons = {
    circle: document.getElementById("add-circle"),
};


// --- 2. Camera Access ---
// Request access to the webcam stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        if (video) {
            // Assign the video stream to the video element
            video.srcObject = stream;
        }
    })
    .catch(error => {
        console.error("Error accessing webcam:", error);
        alert("Could not access the camera. Check permissions.");
    });


// --- 3. Core Functionality (Capture and Save Logic) ---
if (captureBtn && saveBtns && video && canvas && ctx) {

    // ** CAPTURE BUTTON LOGIC **
    captureBtn.addEventListener('click', () => {
        // Step 1: Hide the video and show the canvas
        video.style.display = 'none';
        canvas.style.display = 'block';

        // Step 2: Draw the current frame of the video onto the canvas
        // This is the capture action
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Optionally, stop the video stream or pause it
        video.pause();

        console.log("Photo captured successfully onto the canvas!");
    });

    // ** SAVE BUTTON LOGIC **
    saveBtns.addEventListener('click', () => {
        // Step 1: Convert the canvas image data to a URL (PNG format)
        const imageURL = canvas.toDataURL('image/png');

        // Step 2: Create a temporary <a> element to trigger the download
        const link = document.createElement('a');
        link.href = imageURL;
        // Set a unique file name
        link.download = 'webcam-capture-' + new Date().toISOString().slice(0, 10) + '.png';

        // Step 3: Programmatically click the link and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Photo saved!");

        // Optional: Reset view back to video stream after saving
        video.play();
        video.style.display = 'block';
        canvas.style.display = 'none';
    });

} else {
    console.error("Cannot fully initialize application: Missing required elements or context.");
}




// Function to enable/show the draggable object
function enableObject(name) {
    const obj = objects[name];
    if (obj) {
        obj.style.display = "block";
        // 'animationPlayState' suggests you might have CSS animations defined for it
        obj.style.animationPlayState = "running";
    } else {
        console.warn(`Object with name '${name}' not found.`);
    }
}

// Event listener for adding the circle
if (addButtons.circle) {
    addButtons.circle.addEventListener('click', () => {
        enableObject('circle');
    });
}

