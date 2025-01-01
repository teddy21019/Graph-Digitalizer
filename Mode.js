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
    onMouseClick(pos) {
        return
    }
    /**
     *
     * @param {Vector2} pos position vector
     */
    onMouseMove(pos) {
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
        this.stateList = {
            READY: "ready",             // ready to click starting point P1
            SEEKING: "seeking",         // arrow from P1 to
            FINISHED: "finished",
        }

        if (axis !== 'x' & axis !== 'y') {
            throw new Error("Undefined axis")
        }

        this.axis = axis
        /** @type {AxisComponent} */
        this.axisComponent = this.model.components[axis+"Axis"] //xAxis or yAxis
        this.state = this.stateList.READY
    }

    /**
     *
     * @param {Vector2} pos
     */
    onMouseClick(pos) {
        // set axis starting point
        switch (this.state){
            case this.stateList.READY:
                this.axisComponent.setStartPos(pos)
                this.state = this.stateList.SEEKING
                break
            case this.stateList.SEEKING:
                this.axisComponent.setEndPos(pos)
                this.state = this.stateList.FINISHED
                break
            case this.stateList.FINISHED:
                this.state = this.stateList.READY
        }
        this.view.updateDraw()
    }

    /**
     *
     * @param {Vector2} pos
     */
    onMouseMove(pos) {
        if (this.state !== this.stateList.SEEKING) return

        this.axisComponent.setEndPos(pos)

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
    onMouseClick(pos) {
        const label = this.view.getCurrentLabel();
        if (!label) {
            alert("Please set label before adding points")
            throw new Error("Label required")
        }
        this.model.addDataPoint(label, pos);
        console.log(`Adding ${label} at (${pos.x}, ${pos.y})`);
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
    onMouseClick(pos) {
        const threshold = 5; // Pixel threshold for detecting clicks near points

        // get current label. This is to avoid deleting other points within the same range
        const label = this.view.getCurrentLabel()
        this.model.deletePoint(label, pos, threshold)
        return

    }
}
