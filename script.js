//@ts-check

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('digitizer-canvas');
const ctx = canvas.getContext('2d');
/**@type {HTMLImageElement} */
let img = null;


const colors = ["blue", "green", "orange", "purple", "brown", "pink", "cyan", "magenta"];

// Main Script

let model = new DigitalizerModel()
let view = new DigitizerView(canvas, model)
let controller = new DigitizerController(model, view)
const bubble = new BubbleAlert();

// Set up the canvas click event
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(`Canvas clicked at: (${x}, ${y})`);
    controller.handleCanvasClick(x, y);
});

// Example button listeners (optional)
document.getElementById("set-origin").addEventListener("click", () => {
    controller.setMode("origin");
    bubble.alert("Click on the canvas to set the origin.");
});

document.getElementById("add-point").addEventListener("click", () => {
    controller.setMode("points");
   bubble.alert("Click on the canvas to add a data point.");
});
document.getElementById('upload-image').addEventListener('change', (event)=>{
    const file = event.target.files[0];
    if (file) {
        controller.handleImageUpload(file);
    }
document.getElementById('grid-toggle').addEventListener('click', ()=>{
    controller.toggleGrid()
});
});

// Initial rendering
view.updateDraw();



// document.getElementById('set-origin').addEventListener('click', () => setMode('origin'));
// document.getElementById('set-scale').addEventListener('click', () => setMode('scale'));
// document.getElementById('add-point').addEventListener('click', () => setMode('points'));
// document.getElementById('export-data').addEventListener('click', exportData);
// document.getElementById('confirm-x-axis').addEventListener('click', confirmXAxis);
// document.getElementById('confirm-y-axis').addEventListener('click', confirmYAxis);
// document.getElementById('delete-point').addEventListener('click', () => {
// deleteMode = true;
// });
// canvas.addEventListener('click', handleCanvasClick);




// Create an instance of the BubbleAlert class






// function handleImageUpload(event) {
// const file = event.target.files[0];
// if (!file) return;

// const reader = new FileReader();
// reader.onload = () => {
//     img = new Image();
//     img.onload = () => {
//     canvas.width = img.width;
//     canvas.height = img.height;
//     drawCanvas();
//     };
//     img.src = reader.result;
// };
// reader.readAsDataURL(file);
// }

// function setMode(mode) {
// currentMode = mode;
// if (mode === 'origin') {
//     bubble.alert('Click on the canvas to set the origin.');
// } else if (mode === 'scale') {
//     bubble.alert('Click on a point on the x or y axis to set the scale. Then enter the axis value.');
//     document.getElementById('scale-inputs').classList.remove('hidden');
// } else if (mode === 'points') {
//     deleteMode = false
//     currentLabel = document.getElementById('data-label').value.trim();
//     if (!currentLabel) {
//     bubble.alert('Please enter a label for the data points.');
//     return;
//     }
//     if (!labelColors[currentLabel]) {
//     labelColors[currentLabel] = colors[Object.keys(labelColors).length % colors.length];
//     }
//     bubble.alert(`Adding points for label: ${currentLabel}`);
// }
// }



// function handleCanvasClick(event) {
// const rect = canvas.getBoundingClientRect();
// const x = event.clientX - rect.left;
// const y = event.clientY - rect.top;

// if (deleteMode) {
//     if (!origin || !scale.x || !scale.y) {
//     bubble.alert('Please set the origin and scale before deleting points.');
//     return;
//     }
//     const threshold = 5; // Pixel threshold for detecting clicks near points
//     let pointIndex = -1;

//     dataPoints.forEach((point, index) => {
//     const screenX = origin.x + point.x * scale.x;
//     const screenY = origin.y - point.y * scale.y; // Corrected for proper direction
//     if (Math.abs(screenX - x) < threshold && Math.abs(screenY - y) < threshold) {
//         pointIndex = index;
//     }
//     });

//     if (pointIndex !== -1) {
//     dataPoints.splice(pointIndex, 1);
//     drawCanvas();
//     bubble.alert('Point deleted.');
//     }
// } else if (currentMode === 'origin') {
//     origin = { x, y };
//     drawCanvas();
// } else if (currentMode === 'scale') {
//     if (!scale.x || !scale.y) {
//     scalePoint = { x, y };
//     bubble.alert('Now enter the value of this point in the input fields on the right.');
//     }
// } else if (currentMode === 'points') {
//     if (!origin || !scale.x || !scale.y) {
//     bubble.alert('Please set the origin and scale before adding points.');
//     return;
//     }
//     const transformedX = (x - origin.x) / scale.x;
//     const transformedY = (origin.y - y) / scale.y; // Corrected for proper direction
//     dataPoints.push({ x: transformedX, y: transformedY, label: currentLabel });
//     drawCanvas();
// }
// }


// function confirmXAxis() {
// const xValue = parseFloat(document.getElementById('x-axis-value').value);
// if (!isNaN(xValue) && scalePoint.x !== null) {
//     scale.x = Math.abs(scalePoint.x - origin.x) / xValue;
//     drawCanvas();
//     bubble.alert(`X-axis scale set: 1 unit = ${scale.x.toFixed(2)} pixels.`);
// }
// }

// function confirmYAxis() {
// const yValue = parseFloat(document.getElementById('y-axis-value').value);
// if (!isNaN(yValue) && scalePoint.y !== null) {
//     scale.y = Math.abs(origin.y - scalePoint.y) / yValue;
//     drawCanvas();
//     bubble.alert(`Y-axis scale set: 1 unit = ${scale.y.toFixed(2)} pixels.`);
// }
// }

// function drawCanvas() {
// ctx.clearRect(0, 0, canvas.width, canvas.height);
// if (img) ctx.drawImage(img, 0, 0);

// if (gridVisible) drawGrid();

// if (origin) {
//     ctx.fillStyle = 'red';
//     ctx.beginPath();
//     ctx.arc(origin.x, origin.y, 5, 0, Math.PI * 2);
//     ctx.fill();
// }

// dataPoints.forEach(point => {
//     const screenX = origin.x + point.x * scale.x;
//     const screenY = origin.y - point.y * scale.y; // Corrected for proper direction
//     ctx.fillStyle = labelColors[point.label];
//     ctx.beginPath();
//     ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
//     ctx.fill();
// });
// }

// function drawGrid() {
// ctx.strokeStyle = '#ddd';
// const step = 20;
// for (let x = 0; x < canvas.width; x += step) {
//     ctx.beginPath();
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, canvas.height);
//     ctx.stroke();
// }
// for (let y = 0; y < canvas.height; y += step) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
// }
// }

// function toggleGrid() {
// gridVisible = !gridVisible;
// drawCanvas();
// }

// function exportData() {
// const csvContent = "x,y,label\n" +
//     dataPoints.map(p => `${p.x},${p.y},${p.label}`).join("\n");
// const blob = new Blob([csvContent], { type: 'text/csv' });
// const link = document.createElement('a');
// link.href = URL.createObjectURL(blob);
// link.download = 'data_points.csv';
// link.click();
// }
