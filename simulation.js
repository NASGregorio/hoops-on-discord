const fs = require('fs');
const GIFEncoder = require('gifencoder');
const MatterJSGame = require('./game');

exports.captureSingleFrame = function (canvas) {
	let buffer = canvas.toBuffer();
	fs.writeFileSync('setup.png', buffer);
};

exports.runSimulation = function (game, onFinished) {
	let encoder = new GIFEncoder(game.width, game.height);
	encoder.createReadStream().pipe(fs.createWriteStream('result.gif'));
	encoder.start();
	encoder.setRepeat(-1); // 0 for repeat, -1 for no-repeat
	encoder.setDelay(game.frametime); // frame delay in ms
	encoder.setQuality(10); // image quality. 10 is default.

	let refreshId = setInterval(function () {
		game.update();
		encoder.addFrame(game.ctx);

		if (game.isFinished()) {
			clearInterval(refreshId);
			encoder.finish();
			onFinished();
		}
	}, game.frametime);
};

exports.init = function () {
	return new MatterJSGame();
};
