//@ts-check

// Model
class DigitalizerModel {
  constructor() {

    this.origin = new Vector2(null, null)
    /**
     * @type {Object<string, Component>}
     */
    this.components = {
      "image": new ImageComponent(null),
      "origin": new OriginComponent(new Vector2(0, 0)),
      "grid": new GridComponent(),
    }

    // Default components
    // this.components.push(new AxisComponent("x"));
    // this.components.push(new AxisComponent("y"));

    /**
     * @type {Object<string, DataPointComponent[]>}
     */
    this.dataPoints = {};
    this.colors = ["blue", "green", "orange", "purple", "brown", "pink", "cyan", "magenta"];
  }

  /**
   *  Update the origin point
   * @param {Vector2} pos
   */
  updateOrigin(pos) {
    this.components['origin'].update(pos)
    this.components['origin'].setVisible(true)
  }

  updateScale(param) {
    return
  }

  updateImage(image) {
    const imageComponent = this.components['image'];
    if (imageComponent) {
      imageComponent.update({ image });
      imageComponent.setVisible(true)
    }
  }
  // Add a data point to the model
  addDataPoint(x, y, label) {
    if(!this.dataPoints[label]){
      this.dataPoints[label] = []
    }
    const label_key = Object.keys(this.dataPoints).findIndex(v => v == label)
    const color = this.colors[label_key]
    this.dataPoints[label].push(new DataPointComponent(label, new Vector2(x, y), color))
    // update points render
    // this.updateComponent("points", { data: this.dataPoints });
  }

  // Get the list of components
  getComponents() {
    return this.components;
  }
}

// View
class DigitizerView {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {DigitalizerModel} model
   */
  constructor(canvas, model) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.model = model;
  }

  updateDraw() {
    const components = this.model.getComponents();
    this.clearCanvas();
    Object.keys(components).forEach((name) => {
        let current_comp = components[name]
        if ( current_comp.visible ) current_comp.draw(this.ctx)
    }
    )

    // foreach datapoint in this.dataPoints
    const dataGroups = this.model.dataPoints
    Object.keys(dataGroups).forEach( (label) => {
      dataGroups[label].forEach(el => el.draw(this.ctx))
    });


  }


  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   *  Get the current label from DOM
   * @returns {string} current label string
   */
  getCurrentLabel(){
    /** @type {HTMLTextAreaElement} */
    const labelElement = document.querySelector("#data-label")
    // future work: get the element with class "current-label"
    // user click to change label
    let label = labelElement ? labelElement.value.trim() : ""
    return label
  }
}

/**
 * Function to be called when canvas was clicked. Each mode has its respective callback function
 * @callback ModeCallBack
 * @param {number} x
 * @param {number} y
 * @returns {null}
 */


// Controller
class DigitizerController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.currentMode = null;

    /**
     * @type {Object<string, ModeCallBack>}
     */
    this.modeHandlers = {
      delete: this.handleDeleteMode.bind(this),
      origin: this.setOrigin.bind(this),
      scale: this.setScalePoint.bind(this),
      points: this.addPoint.bind(this),
    };
  }

  /**
   *  Sets current mode for controller. Called by listening events.
   * @param {string} mode Mode to set
   */
  setMode(mode) {
    if (this.modeHandlers[mode]) {
      this.currentMode = mode;
    } else {
      console.error(`Mode ${mode} is not supported.`);
    }
  }


  /**
   * @param {any} x
   * @param {any} y
   */
  handleDeleteMode(x, y) {
    const threshold = 5; // Pixel threshold for detecting clicks near points

    // get current label. This is to avoid deleting other points within the same range
    const label = this.view.getCurrentLabel()

    this.model.deletePoint(label, new Vector2(x, y), threshold)

    return
  }


  /**
   * Called when click on canvas. Action depends on current mode, which corresponds to respective callback in class
   * @param {number} x x coord of canvas
   * @param {number} y y coord of canvas
   */
  handleCanvasClick(x, y) {

    // call handler based on mode
    if (this.currentMode && this.modeHandlers[this.currentMode]) {
      this.modeHandlers[this.currentMode](x,y);
    } else {
      console.error(`No handler defined for mode: ${this.currentMode}`);
    }
    this.view.updateDraw()
  }

  /**
   * Called by on image change
   * @param {Blob} file
   */
  handleImageUpload(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        this.model.updateImage(img); // Pass the image to the model
        this.view.updateDraw(); // Trigger a redraw
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }

  addPoint(x, y) {
    const label = this.view.getCurrentLabel();
    if (!label){
      alert("Please set label before adding points")
      throw new Error("Label required")
    }
    this.model.addDataPoint(x, y, label);
    console.log(`Adding ${label} at (${x}, ${y})`);
  }

  setOrigin(x, y) {
    console.log(`Setting origin at (${x}, ${y})`);
    this.model.updateOrigin(new Vector2(x, y));
  }

  setScalePoint(x, y) {
    console.log(`Setting scale point at (${x}, ${y})`);
    this.model.updateScale({ x, y });
  }

  toggleGrid() {
    /**
     * @type {GridComponent}
     */
    let grid_comp = this.model.components['grid']
    let visibility = grid_comp.visible
    grid_comp.setVisible(!visibility)
    this.view.updateDraw()
  }
}

class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class BubbleAlert {
  constructor() {
      // Create the bubble element
      this.bubble = document.createElement('div');
      this.bubble.style.position = 'fixed';
      this.bubble.style.top = '20px';
      this.bubble.style.left = '50%';
      this.bubble.style.transform = 'translateX(-50%)';
      this.bubble.style.padding = '10px 20px';
      this.bubble.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this.bubble.style.color = 'white';
      this.bubble.style.borderRadius = '10px';
      this.bubble.style.fontSize = '16px';
      this.bubble.style.zIndex = '1000';
      this.bubble.style.display = 'none';  // Initially hidden

      // Add it to the body
      document.body.appendChild(this.bubble);
  }

  // Function to show the bubble with a given message
  alert(message) {
      this.bubble.textContent = message;
      this.bubble.style.display = 'block'; // Show the bubble

      // Hide the bubble after 3 seconds
      setTimeout(() => {
      this.bubble.style.display = 'none';
      }, 3000);
  }
  }