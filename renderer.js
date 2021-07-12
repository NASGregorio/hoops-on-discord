module.exports = class Render {
	constructor(width, height, canvas, engine) {
		this.width = width;
		this.height = height;

		this.engine = engine;

		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

		this.entities = [];
	}

	testme() {
		console.log(this.width);
	}

	addEntity(vertices, stroke, fill) {
		this.entities.push({ vertices: vertices, stroke: stroke, fill: fill });
	}

	render() {
		// background
		this.ctx.fillStyle = '#252525';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.entities.forEach((entity) => {
			this.ctx.lineWidth = 1;

			this.ctx.beginPath();
			this.ctx.moveTo(entity.vertices[0].x, entity.vertices[0].y);

			for (let j = 1; j < entity.vertices.length; j++) {
				this.ctx.lineTo(entity.vertices[j].x, entity.vertices[j].y);
			}

			this.ctx.lineTo(entity.vertices[0].x, entity.vertices[0].y);
			this.ctx.closePath();

			this.ctx.strokeStyle = entity.stroke;
			this.ctx.stroke();

			this.ctx.fillStyle = entity.fill;
			this.ctx.fill();
		});
	}
};
