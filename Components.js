class Component {
    /**
     * A component to draw on canvas
     */
    constructor() {
        this.visible = true
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        throw new Error("Draw method must be implemented by subclass.");
    }

    update(data) {
        throw new Error("Update method must be implemented by subclass.")
    }

    /**
     *
     * @param {boolean} state State of visibility
     */
    setVisible(state) {
        this.visible = state
    }
}

class OriginComponent extends Component {
    /**
     *
     * @param {HTMLCanvasElement} canvas The canvas
     * @param {Vector2} pos Origin Point
     */
    constructor(pos) {
        super()
        this.origin = pos
        this.visible = true // default invisible
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.origin.x, this.origin.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     *
     * @param {Vector2} pos Origin position in Vector2
     */
    update(pos) {
        this.origin = pos
    }
}

class GridComponent extends Component {
    /**
     *
     * @param {number} step Step to render for grid
     */
    constructor(step = 20) {
        super()
        this.step = step
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        const step = this.step;
        for (let x = 0; x < ctx.canvas.width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < ctx.canvas.height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        }
    }

    update() {
        return
    }
}

class ImageComponent extends Component {
    /**
     *
     * @param {CanvasRenderingContext2D} canvas
     * @param {HTMLImageElement} image HTML Image Element.
     */
    constructor(image) {
        super()
        this.visible = false
        this.image = image
        this.angle = 0
    }

    update(data) {
        if (data.image) {
            this.image = data.image;
        }
        if (data.angle != undefined){
            this.angle = data.angle
        }
        if (data.zoom != undefined){
            this.zoom = data.zoom
        }
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (this.image) {
            let width_ratio = ctx.canvas.width / this.image.width
            let height_ratio = ctx.canvas.height / this.image.height
            let scale_factor  = Math.min(width_ratio, height_ratio) * this.zoom;

            // let image_translation = new Vector2(0,0)

            // // move down to center align height
            // image_translation.y = (ctx.canvas.height - this.image.height * scale_factor)
            // image_translation.x = (ctx.canvas.width - this.image.width * scale_factor)
            ctx.save()



            // rotation
            ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2)
            ctx.rotate(this.angle * Math.PI / 180)
            ctx.scale(scale_factor, scale_factor);
            ctx.drawImage(this.image, -this.image.width / 2, - this.image.height / 2);
            ctx.scale(1/scale_factor, 1/scale_factor)

            ctx.restore()
        }
    }
}

class AxisComponent extends Component {
    /**
     * Axis is defined by assigning two points on the canvas, with one typically being the origin.
     * @param {string} axis_type Type of axis. Either x or y
     * @param {Vector2} start_pos Start position of axis assignment
     * @param {Vector2} end_pos End position of axis assignment
     */
    constructor(axis_type, start_pos, end_pos) {
        super()
        if (axis_type != "x" & axis_type != "y"){
            throw new Error("Must be either x or y axis")
        }
        this.visible = false
        this.axis_type = axis_type
        this.startPos = start_pos
        this.endPos = end_pos
    }
    /**
     *
     * @param {Vector2} pos
     */
    setStartPos(pos){
        this.startPos = pos
        this.setVisible(true)
    }

    /**
     *
     * @param {Vector2} pos
     */
    setEndPos(pos){
        this.endPos = pos
    }
    drawArrow(ctx, fromPos, toPos) {
        if (!fromPos | !toPos) return
        const {x: fromX, y: fromY} = fromPos
        const {x: toX, y: toY} = toPos
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        // Draw the line
        ctx.save()
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineWidth = 4
        ctx.stroke();

        // Draw the arrowhead
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(toX, toY);
        ctx.fill();
        ctx.restore()
    }

    draw(ctx) {
        this.drawArrow(ctx, this.startPos, this.endPos)

    }
}

class DataPointComponent extends Component{
    /**
     *
     * @param {string} label Label of point
     * @param {Vector2} pos Coordinate of point
     * @param {string} color Color to draw
     */
    constructor(label, pos, color) {
       super()
       this.pos = pos
       this.label = label
       this.color = color
       this.visible = true
    }

    draw(ctx) {
      ctx.fillStyle = this.color ; // Optionally: use a label-specific color
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    /**
     *
     * @param {Vector2} pos New position for this point
     */
    update(pos) {
       this.pos = pos
       this.visible = true
    }
}