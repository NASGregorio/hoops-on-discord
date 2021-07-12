const Simulation = require('./simulation');
const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

let sim = Simulation.init();

const states = {
	READY: 'READY',
	SHOOT: 'SHOOT',
	HOLD: 'HOLD',
};
let state = states.READY;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
	if (msg.content === '!h ready') {
		if (state != states.READY) return;

		state = states.SHOOT;
		sim.resetBall();
		sim.render();
		Simulation.captureSingleFrame(sim.canvas);
		msg.channel.send({
			files: ['./setup.png'],
		});
	} else if (msg.content.startsWith('!h shoot')) {
		if (state != states.SHOOT) return;
		state = states.HOLD;
		let parts = msg.content.split(' ');
		if (parts.length == 4) {
			const mag = parseInt(parts[2]);
			if (mag > 50) {
				msg.reply('not so fast buddy!');
				state = states.SHOOT;
				return;
			}
			sim.prepare(parseInt(parts[2]), parseInt(parts[3]));
			Simulation.runSimulation(sim, () => {
				msg.channel.send({
					files: ['./result.gif'],
				});
				state = states.READY;
			});
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
