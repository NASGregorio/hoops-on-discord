const { createCanvas } = require('canvas');
const {
	Engine,
	Bodies,
	Body,
	Composite,
	Query,
	Vector,
	Sleeping,
} = require('matter-js');
const Renderer = require('./renderer');

module.exports = class MatterJSGame {
	constructor() {
		this.width = 600;
		this.height = 400;

		this.framerate = 30;
		this.frametime = 1000 / this.framerate;

		this.canvas = createCanvas(this.width, this.height);
		this.ctx = this.canvas.getContext('2d');

		this.engine = Engine.create({
			options: {
				positionIterations: 12 /* default 6 */,
				velocityIterations: 8 /* default 4 */,
			},
		});

		this.renderer = new Renderer(
			this.width,
			this.height,
			this.canvas,
			this.engine
		);

		this.setup();
	}

	setup() {
		this.ball = Bodies.circle(100, 300, 15, {
			restitution: 0.9,
			friction: 0.01,
		});
		this.renderer.addEntity(this.ball.vertices, '#151515', '#CCCCCC');

		this.ground = Bodies.rectangle(300, 400, 600, 30, {
			isStatic: true,
			friction: 0,
		});
		this.renderer.addEntity(this.ground.vertices, '#151515', '#505050');

		let ceiling = Bodies.rectangle(300, 0, 600, 30, {
			isStatic: true,
			friction: 0,
		});
		this.renderer.addEntity(ceiling.vertices, '#151515', '#505050');

		let leftWall = Bodies.rectangle(0, 200, 30, 400, {
			isStatic: true,
			friction: 0,
		});
		this.renderer.addEntity(leftWall.vertices, '#151515', '#505050');

		let rightWall = Bodies.rectangle(600, 200, 30, 400, {
			isStatic: true,
			friction: 0,
		});
		this.renderer.addEntity(rightWall.vertices, '#151515', '#505050');

		Composite.add(this.engine.world, [
			this.ball,
			this.ground,
			ceiling,
			leftWall,
			rightWall,
		]);
	}

	resetBall() {
		Sleeping.set(this.ball, true);
		Body.setPosition(
			this.ball,
			Vector.create(
				50 + Math.floor(Math.random() * 100),
				250 + Math.floor(Math.random() * 100)
			)
		);
		Sleeping.set(this.ball, false);
	}

	prepare(magnitude, angle) {
		let angleRad = (angle * -Math.PI) / 180;
		let initialVel = Vector.rotate(Vector.create(magnitude, 0), angleRad);
		Body.setVelocity(this.ball, initialVel);
	}

	isFinished() {
		if (
			this.ball.position.x < 0 ||
      this.ball.position.x > this.width ||
      this.ball.position.y < 0 ||
      this.ball.position.y > this.height
		)
			return true;

		let cols = Query.collides(this.ball, [this.ground]);
		return cols.length > 0 && Math.abs(this.ball.velocity.y) < 1;
	}

	render() {
		this.renderer.render();
	}

	update() {
		Engine.update(this.engine, this.frametime);
		this.renderer.render();
	}
};
