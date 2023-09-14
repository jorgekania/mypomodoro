(function () {

	/******************************************************************************** 
	* Declare vars
	********************************************************************************/

	const fehBody = document.body;
	const workDurationInput = document.getElementById("work-duration");
	const restDurationInput = document.getElementById("rest-duration");
	const circleProgress = document.querySelector(".circle-progress");
	const timerTime = document.getElementById("feh-timer-time");
	
	const btnToggleSettings = document.getElementById('feh-toggle-settings');
	const btnCloseSettings = document.getElementById('feh-close-settings');
   const playerButtons = document.getElementById("feh-player-buttons");
   const labelPlayer = document.getElementById("player-label");
   const playWorking = new Audio("./assets/audio/mountains.mp3");
   const playerPlay = document.getElementById("player-play-btn");
   const playerPause = document.getElementById("player-pause-btn");
   const playerStop = document.getElementById("player-stop-btn");

	let workDuration = parseInt(workDurationInput.value) * 60;
	let restDuration = parseInt(restDurationInput.value) * 60;
	let remainingTime = workDuration;
	let isPaused = true;
	let isWorking = true;
	let intervalId;
	
	const completedSessionsElement = document.getElementById("feh-completed-sessions");
	let completedSessions = 0;
		
	
	/******************************************************************************** 
	* Pomodoro overlay screen
	********************************************************************************/

	window.addEventListener("load", () => {
		fehBody.classList.add('page-loaded');
	});
	
	
	/******************************************************************************** 
	* Toggle settings screen
	********************************************************************************/
	
	function setBodySettings() {
		fehBody.classList.contains('settings-active') ? fehBody.classList.remove('settings-active') : fehBody.classList.add('settings-active');
	}

	function toggleSettings() {
		if (event.type === 'click') {
			setBodySettings();
		}
		else if((event.type === 'keydown' && event.keyCode === 27)) {
			fehBody.classList.remove('settings-active');
		}
	}

	btnToggleSettings.addEventListener('click', toggleSettings);
	btnCloseSettings.addEventListener('click', toggleSettings);
	document.addEventListener('keydown', toggleSettings);
	
	
	/******************************************************************************** 
	* Play button is clicked + start timer
	********************************************************************************/

	const startBtn = document.getElementById("start-btn");
	startBtn.addEventListener("click", () => {
		isPaused = false;

		fehBody.classList.add('timer-running');
      playerButtons.style.display = "grid";

		/** 
		* Is work timer
		*/
		if (isWorking) {
			fehBody.classList.remove('timer-paused');
         startPlayer();
		}
		/** 
		* or rest timer
		*/
		else {
			fehBody.classList.add('rest-mode');
			fehBody.classList.remove('timer-paused');
		}

		if (!intervalId) {
			intervalId = setInterval(updateTimer, 1000);
		}
	});
	
	
	/******************************************************************************** 
	* Pause button is clicked 
	********************************************************************************/
	
	const pauseBtn = document.getElementById("pause-btn");
	pauseBtn.addEventListener("click", () => {
		isPaused = true;

		fehBody.classList.remove('timer-running');
		fehBody.classList.add('timer-paused');

		document.title = "Pomodoro Pausado";
	});


   /******************************************************************************** 
	* Music Player button is clicked 
	********************************************************************************/
   function startPlayer() {

      labelPlayer.innerText = "Tocando";

      playWorking.play();
      playerPlay.disabled = true;
      playerPlay.classList.add('player-active');
      playerPlay.classList.remove('player-deactivate');
      
      playerPause.disabled = false;
      playerPause.classList.remove('player-active');
      playerPause.classList.add('player-deactivate');

      playerStop.disabled = false;
      playerStop.classList.remove('player-active');
      playerStop.classList.add('player-deactivate');
  }

  function pausePlayer() {

      labelPlayer.innerText = "Pausado";

      playWorking.pause();
      playerPlay.disabled = false;
      playerPlay.classList.remove('player-active');
      playerPlay.classList.add('player-deactivate');

      playerPause.disabled = true;
      playerPause.classList.add('player-active');
      playerPause.classList.remove('player-deactivate');

      playerStop.disabled = false;
      playerStop.classList.remove('player-active');
      playerStop.classList.add('player-deactivate');
  }

  function stopPlayer() {

      labelPlayer.innerText = "Parado";

      playWorking.pause();
      playWorking.currentTime = 0;

      playerPlay.disabled = false;
      playerPlay.classList.add('player-deactivate');
      playerPlay.classList.remove('player-active');

      playerPause.disabled = false;
      playerPause.classList.add('player-deactivate');
      playerPause.classList.remove('player-active');

      playerStop.disabled = true;
      playerStop.classList.add('player-active');
      playerStop.classList.remove('player-deactivate');
  }

  playerPlay.addEventListener("click", () => {
      startPlayer();
  });

  playerPause.addEventListener("click", () => {
      pausePlayer();
  });

  playerStop.addEventListener("click", () => {
      stopPlayer();
  });


	/******************************************************************************** 
	* Get work / rest times from settings
	********************************************************************************/

	workDurationInput.addEventListener("change", () => {
		workDuration = parseInt(workDurationInput.value) * 60;
		if (isWorking) {
			remainingTime = workDuration;
			updateProgress();
		}
	});

	restDurationInput.addEventListener("change", () => {
		restDuration = parseInt(restDurationInput.value) * 60;
		if (!isWorking) {
			remainingTime = restDuration;
			updateProgress();
		}
	});
	
	
	/******************************************************************************** 
	* Timer
	********************************************************************************/

	function updateTimer() {

		const workFinished = new Audio("./assets/audio/bell.mp3");
		const restFinished = new Audio("./assets/audio/final.mp3");

		if (!isPaused) {
			remainingTime--;

			/** 
			* When timer stops running
			*/
			if (remainingTime <= 0) {
				isWorking = !isWorking;
				remainingTime = isWorking ? workDuration : restDuration;

				/** 
				* Check what timer (work/rest) has just finished
				*/
				if(!isWorking) {               
					/** 
					* Increment the completed sessions counter and update the display
					*/
					fehBody.classList.add('rest-mode');
					fehBody.classList.remove('timer-running');

					completedSessions++;
					completedSessionsElement.textContent = completedSessions;
										
				} 
				else {               

					fehBody.classList.remove('rest-mode');
					fehBody.classList.remove('timer-running'); 
               stopPlayer();
				}

				/** 
				* Switch alarm depending on pomodoro or rest period
				*/
				playAlarm = isWorking ? restFinished : workFinished;
				playAlarm.play();

				/** 
				* Timer has finished
				*/
				isPaused = true;
				fehBody.classList.remove('timer-work-active');
			}

			document.title = timerTime.textContent = formatTime(remainingTime);

			updateProgress();

		}
	}
	
	
	/******************************************************************************** 
	* Update circle progress
	********************************************************************************/

	function updateProgress() {

		const radius = 45;
		const circumference = 2 * Math.PI * radius;

		const totalDuration = isWorking ? workDuration : restDuration;
		const dashOffset = circumference * remainingTime / totalDuration;
		
		circleProgress.style.strokeDashoffset = dashOffset;
		timerTime.textContent = formatTime(remainingTime);
	}

	/******************************************************************************** 
	* Format time
	********************************************************************************/

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	}
	
	updateProgress();
	

})();