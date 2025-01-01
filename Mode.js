class Mode {
    /**
     * Abstract class for mode of canvas.
     * @param {DigitalizerModel} model
     * @param {DigitizerView} view
     */
    constructor(model, view) {
        this.model = model
        this.view = view
    }

    /**
     *
     * @param {Vector2} pos position vector
     */
    onMouseDown(pos) {
        return
    }
    /**
     *
     * @param {Vector2} pos position vector
     */
    onMouseMove(pos) {
        return
    }
    /**
     *
     * @param {Vector2} pos position vector
     */
    onMouseUp(pos) {
        return
    }
    /**
     *
     * @param {Vector2} pos position vector
     */
    onRightClick(pos) {
        return
    }
}


class AxisMode extends Mode {
    /**
     *
     * @param {DigitalizerModel} model
     * @param {DigitizerView} view
     * @param {string} axis 'x' or 'y'
     */
    constructor(model, view, axis) {
        super(model, view)
        this.state = {
            READY: "ready",             // ready to click starting point P1
            SEEKING: "seeking",         // arrow from P1 to
            FINISHED: "finished",
        }

        if (axis !== 'x' | axis !== 'y') {
            throw new Error("Undefined axis")
        }
        this.axis = axis
    }

    /**
     *
     * @param {Vector2} pos
     */
    onMouseDown(pos) {

    }

    /**
     *
     * @param {Vector2} pos
     */
    onMouseMove(pos) {

    }

    /**
     *
     * @param {Vector2} pos
     */
    onMouseUp() {

    }

}

class AddPointMode extends Mode {
    constructor(model, view) {
        super(model, view)
    }

    /**
     *
     * @param {Vector2} pos
     */
    onMouseDown(pos) {
        const label = this.view.getCurrentLabel();
        if (!label) {
            alert("Please set label before adding points")
            throw new Error("Label required")
        }
        this.model.addDataPoint(label, pos);
        console.log(`Adding ${label} at (${x}, ${y})`);
    }
}

class DeletePointMode extends Mode {
    constructor(model, view) {
        super(model, view)
    }

    /**
     *
     * @param {Vector2} pos
     */
    onMouseDown(pos) {
        const threshold = 5; // Pixel threshold for detecting clicks near points

        // get current label. This is to avoid deleting other points within the same range
        const label = this.view.getCurrentLabel()
        this.model.deletePoint(label, pos, threshold)
        return

    }
}
