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


const labelList = document.getElementById('label-list');
const dataLabelInput = document.getElementById('data-label');
const addLabelButton = document.getElementById('add-label');

/**
 * @param {HTMLElement} labelElement
 */
function changeSelect(labelElement) {
  document.querySelectorAll('.label').forEach(el => el.classList.remove('selected'));
  labelElement.classList.add('selected');
  labelElement.click();   // select this immediately
}

addLabelButton.addEventListener('click', () => {
  const labelText = dataLabelInput.value.trim();
  if (labelText) {
    // if labelText exist
    const labelSameName = Array.from(labelList.childNodes).find((node) => node.textContent === labelText)
    if (labelSameName) {
      bubble.alert("Label already exist")
      changeSelect(labelSameName)
    }
    else {
      const labelElement = document.createElement('div');
      labelElement.textContent = labelText;
      labelElement.className = 'label';
      labelElement.addEventListener('click', () => {
        changeSelect(labelElement)
        // set mode as add point
        controller.setMode(MODELIST.addPoint);
      });
      labelList.appendChild(labelElement);
       changeSelect(labelElement);
    }
    dataLabelInput.value = '';
  }
});

dataLabelInput.addEventListener('keydown', (event)=>{
  if (event.key == 'Enter'){
    addLabelButton.click();
  }
})

// Set up the canvas click event
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  console.log(`Canvas clicked at: (${x}, ${y})`);
  controller.handleCanvasClick(x, y);
});

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  controller.handleCanvasMove(x, y);
})


document.getElementById("add-point").addEventListener("click", () => {
  controller.setMode(MODELIST.addPoint);
  bubble.alert("Click on the canvas to add a data point.");
});

document.getElementById('delete-point').addEventListener('click', () => {
  controller.setMode(MODELIST.deletePoint)
  bubble.alert("Click on the canvas to delete a data point.");
});

document.getElementById('set-x-axis').addEventListener('click', () => {
  controller.setMode(MODELIST.setAxisX)
  bubble.alert("Click on two ticks on the x-axis, then specify the values on the left");
});

document.getElementById('set-y-axis').addEventListener('click', () => {
  controller.setMode(MODELIST.setAxisY)
  bubble.alert("Click on two ticks on the y-axis, then specify the values on the left");
});

document.getElementById('upload-image').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    controller.handleImageUpload(file);
  }
});

window.addEventListener("paste", (event)=>{
    if (!document.getElementById("canvas-container").matches(":hover")){
        return
    }
    event.preventDefault();
    event.stopPropagation();
    let file = event.clipboardData.items[0].getAsFile();
    if (file){
      controller.handleImageUpload(file)
    }
})

document.getElementById('grid-toggle').addEventListener('click', () => {
  controller.toggleGrid()
});

document.getElementById('image-toggle').addEventListener('click', () => {
  controller.toggleImage()
});

document.getElementById('export-data').addEventListener('click', exportData);


document.getElementById('rotation-slider').addEventListener('input', (event) => {
  const angle = event.target.value
  controller.handleImageRotate(angle)
})

document.getElementById('zoom-slider').addEventListener('input', (event) => {
  const zoom = event.target.value / (event.target.max / 10)
  controller.handleImageZoom(zoom)
})

const axisMappings = [
  { axis: 'x', isEnd: 0, elementId: 'x-axis-value-1' },
  { axis: 'x', isEnd: 1, elementId: 'x-axis-value-2' },
  { axis: 'y', isEnd: 0, elementId: 'y-axis-value-1' },
  { axis: 'y', isEnd: 1, elementId: 'y-axis-value-2' },
];

axisMappings.forEach(({ axis, isEnd, elementId }) => {
  document.getElementById(elementId).addEventListener('input', (event) => {
    const value = parseFloat(event.target.value);
    controller.updateRealAxis(axis, isEnd, value);
  });
});

// Initial rendering
view.updateDraw();

function exportData() {
  const csvContent = model.exportData()
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data_points.csv';
  link.click();
}
