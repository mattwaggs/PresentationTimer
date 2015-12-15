

function startTheTimer() {

	var __min = Number(document.getElementById('min_time').value) || 18;
	var __max = Number(document.getElementById('max_time').value) || 20;

	var elm = document.getElementById("form");
	elm.parentNode.removeChild(elm);

	

	var Timer = function() {
		
		var SECONDS_CONSTANT = 60;
		var MILISECONDS_CONSTANT = 1000;

		var MAX_TIME = __max * SECONDS_CONSTANT * MILISECONDS_CONSTANT;
		var MIN_TIME = __min * SECONDS_CONSTANT * MILISECONDS_CONSTANT;

		var timer = this;

		var listeners = [];

		function pulse() {
			for(fn in listeners) {
				listeners[fn](timer.currentTimeElapsed);
			}
		}

		this.Start = function() {

			timer.currentTimeElapsed = 0;
			timer.timerRunning = true;
			timer.StartTime = Date.now();

			setInterval(function() {

				if(timer.timerRunning) {
					timer.currentTimeElapsed = Date.now() - timer.StartTime;
					pulse();
				}

			}, MILISECONDS_CONSTANT);

		}

		this.Stop = function() {
			timer.timerRunning = false;
			timer.ClearListeners();
		}

		this.AddListener = function(fn) {
			listeners.push(fn);
		}

		this.ClearListeners = function() {
			listeners = [];
		}

		this.MAX_TIME = MAX_TIME;
		this.MIN_TIME = MIN_TIME;

	}

	var t = new Timer();

	// draw it with canvas.
	var Canvas = function() {

		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.bar_y_pos = Math.floor(this.height*0.60);
		this.bar_height = Math.floor(this.height*0.10);
		this.bar_x_pos = Math.floor(this.width*0.10);
		this.bar_width = Math.floor((this.width*0.80));

		this.max_time = 1000;
		this.min_time = 1000;

		this.time = 0;

		this.getPercentageComplete = function() {
			return (self.time / self.max_time);
		}

		this.time_y_pos = Math.floor(this.height*0.25);
		this.time_x_pos = Math.floor(this.width*0.50);


		this.bg_color = '#333';
		this.fg_color = '#dedede';
		this.bar_good_color = '#55B74E';

		this.canvas = document.getElementById('timer');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.context = this.canvas.getContext('2d');

		var self = this;

		this.showTimeAsText = function() {
			var _seconds = Math.floor(self.time / (1000));
			var seconds_display = _seconds % 60;

			var minutes = Math.floor((_seconds - seconds_display) / 60);

			if(minutes < 10) {
				minutes = "0" + minutes;
			}
			if(seconds_display < 10) {
				seconds_display = "0" + seconds_display;
			}

			return minutes + ":" + seconds_display;

		}

		function render() {

			if(self.time > self.max_time) {
				return;
			}
			var ctx = self.context;
			// clear the canvas
			ctx.fillStyle = self.bg_color;
			ctx.fillRect(0,0, self.width, self.height);

			// draw the time...
			ctx.fillStyle = self.fg_color;
			ctx.font = "100pt monospace"
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillText(self.showTimeAsText(), self.time_x_pos, self.time_y_pos);

			// draw the progress bar
			ctx.strokeStyle = self.fg_color;
			ctx.rect(self.bar_x_pos, self.bar_y_pos, self.bar_width, self.bar_height);
			ctx.stroke();

			// fill in the progress bar
			if(self.time <= self.max_time && self.time > self.min_time) {
				ctx.fillStyle = self.bar_good_color;
			}else{
				ctx.fillStyle = self.fg_color;
			}
			ctx.fillRect(self.bar_x_pos, self.bar_y_pos, (self.bar_width*self.getPercentageComplete()), self.bar_height);

			// for debugging
			console.log(self);
		}

		this.setMaxTime = function(mt) {
			self.max_time = mt;
		}

		this.setMinTime = function(mt) {
			self.min_time = mt;
		}

		this.setTime = function(ct) {
			self.time = ct;
		}

		this.render = render;
	}





	var c = new Canvas();

	c.setMaxTime(t.MAX_TIME);
	c.setMinTime(t.MIN_TIME);
	c.setTime(0);

	t.AddListener(function(time) {

		c.setTime(time);
		c.render();

	});

	t.Start();
}



