
var game;


function UserInputService() {
	Entity.call(this, game);

	this.create_canvas();
}
UserInputService.prototype = Object.create(Entity.prototype);
UserInputService.prototype.update = function(game) {
	Entity.prototype.update.call(this, game);

	if (game.is_mouse_pressed()) {
		// game.add_entity(this.ent = new Scribble(game.mouse_game_position.px, game.mouse_game_position.py));
		// drag it until the player releases the mouse button
		var fromfrom = game.mouse_game_position;
		var from = game.mouse_game_position;
		var to = game.mouse_game_position;
		this.until(() => !game.mouse1_state, () => {
			this.render_scribble(fromfrom, from, to, game.mouse_game_position);
			fromfrom = from;
			from = to;
			to = game.mouse_game_position;
			// this.ent.points.push({ px: game.mouse_game_position.px, py: game.mouse_game_position.py });
			// this.interacting_ent.px = game.mouse_game_position.px + delta.px;
			// this.interacting_ent.py = game.mouse_game_position.py + delta.py;
		});
	}

	this.redraw_canvas(5 * game.deltatime, 0);

	// if (game.is_key_pressed('=')) {
	// 	if (this.interacting_ent) {
	// 		this.interacting_ent.value = Math.abs(this.interacting_ent.value);
	// 	}
	// } else if (game.is_key_pressed('-')) {
	// 	if (this.interacting_ent) {
	// 		this.interacting_ent.value = -Math.abs(this.interacting_ent.value);
	// 	}

};
UserInputService.prototype.create_canvas = function() {
	this.buffer_canvas = document.createElement('canvas');
	this.buffer_canvas.width = game.canvas.width;
	this.buffer_canvas.height = game.canvas.height;
	this.true_offset_x = 0;
	this.true_offset_y = 0;
};
UserInputService.prototype.redraw_canvas = function(dx, dy) {
	this.true_offset_x += dx;
	this.true_offset_y += dy;

	var dx2 = this.true_offset_x - this.true_offset_x % 0.5;
	this.true_offset_x = this.true_offset_x % 0.5;
	var dy2 = this.true_offset_y - this.true_offset_y % 0.5;
	this.true_offset_y = this.true_offset_y % 0.5;

	var new_buffer_canvas = document.createElement('canvas');
	new_buffer_canvas.width = game.canvas.width;
	new_buffer_canvas.height = game.canvas.height;
	var new_buffer_context = new_buffer_canvas.getContext('2d');
	new_buffer_context.drawImage(this.buffer_canvas, dx2, dy2);
	this.buffer_canvas = new_buffer_canvas;
};
UserInputService.prototype.draw = function(ctx) {
	ctx.drawImage(this.buffer_canvas, 0, 0);
};
UserInputService.prototype.render_scribble = function(prev, from, to, next) {
	var d = dist(from, to);
	var d1 = unit_mul(unit_vector(vector_delta(prev, from)), 100);
	var d2 = unit_mul(unit_vector(vector_delta(next, to)), 100);
	var davg = avgp(d1,d2);

	var ctx = this.buffer_canvas.getContext('2d');
	ctx.save();
	ctx.fillStyle = '#d82';
	ctx.strokeStyle = '#fc4';
	ctx.moveTo(from.px, from.py);
	// ctx.bezierCurveTo(from.px + davg.px, from.py + davg.py, to.px + davg.px, to.py + davg.py, to.px, to.py);
	ctx.bezierCurveTo(from.px + d1.px, from.py + d1.py, to.px + d2.px, to.py + d2.py, to.px, to.py);
	ctx.stroke();
	ctx.restore();
};
// UserInputService.prototype.save_data = function () {
// 	var data = game.query_entities(NumberCircle).map(n => [n.value, Math.round(n.px), Math.round(n.py)]);
// 	console.log("data:", JSON.stringify(data));
// 	return data;
// };
// UserInputService.prototype.reload_data = function (data) {
// 	// console.log("data:", data);
// 	game.remove_entities(game.query_entities(NumberCircle));
// 	game.remove_entities(game.query_entities(CircleConnector));
// 	game.add_entities(data.map(d => new NumberCircle(d[1],d[2], d[0])));
// };

function Scribble(px, py, points) {
	ScreenEntity.call(this, game, px, py, 32, 32, undefined);
	this.scratch_canvas = 
	this.points = [];
}
Scribble.prototype = Object.create(ScreenEntity.prototype);
Scribble.prototype.draw = function (ctx) {
	ctx.save();
	ctx.strokeStyle = '#fc4';
	ctx.moveTo(this.px, this.py);
	var lastx = this.px;
	var lasty = this.py;
	var dx = 1;
	var dy = 1;
	for (var p of this.points) {
		ctx.bezierCurveTo(lastx, lasty, p.px, p.py, p.px, p.py);
	}
	ctx.stroke();
	ctx.restore();
};




function main () {
	var canvas = document.querySelector('#game_canvas');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = true;

	nlo.load.load_all_assets({
		images: {
			ufo: 'assets/img/ufo.png',
		},
	}, loaded_assets => {
		game = new GameSystem(canvas, loaded_assets);
		game.background_color = '#333';

		// initialize all systems
		game.game_systems.user_input_service = new UserInputService(game);


		game.run_game(ctx, 60);
	});
}

window.addEventListener('load', main);
