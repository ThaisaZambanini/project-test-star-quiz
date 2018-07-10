;(function ($, window) {
  function Timer (options, finaliza) {
		var defaultOptions = {
        container: 'timer',
        timer: 5
      },
			options = $.extend({}, defaultOptions, options)

			function init() {
				startTimer(options.timer)
			}

			function startTimer(minutes) {
					var seconds = 60;
					var mins = minutes
					function tick() {
							var counter = document.getElementById(options.container);
							var current_minutes = mins-1
							seconds--;
							counter.innerHTML = current_minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
							if( seconds > 0 ) {
									setTimeout(tick, 1000);
							} else {
									if(mins > 1){
											startTimer(mins-1);
									} else {
									   finaliza()
									}
							}
					}
					tick();
			}

			init()
	}

	window.Timer = Timer

}(window.$, window))
