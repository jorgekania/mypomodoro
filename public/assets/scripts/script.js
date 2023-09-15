(function () {
    // Elementos do DOM
    const fehBody = document.body;
    const workDurationInput = document.getElementById("work-duration");
    const restDurationInput = document.getElementById("rest-duration");
    const circleProgress = document.querySelector(".circle-progress");
    const timerTime = document.getElementById("feh-timer-time");
    const btnToggleSettings = document.getElementById('feh-toggle-settings');
    const btnCloseSettings = document.getElementById('feh-close-settings');
    const playerButtons = document.getElementById("feh-player-buttons");
    const labelPlayer = document.getElementById("player-label");
    const playerPlay = document.getElementById("player-play-btn");
    const playerPause = document.getElementById("player-pause-btn");
    const playerStop = document.getElementById("player-stop-btn");
    const btnOpenHelp = document.getElementById('feh-toggle-help');
    const btnCloseHelp = document.getElementById('feh-toggle-help-hover');
    const feeHelp = document.getElementById('feh-help');
    const completedSessionsElement = document.getElementById("feh-completed-sessions");

    // Durações e estados
    let workDuration = parseInt(workDurationInput.value) * 60;
    let restDuration = parseInt(restDurationInput.value) * 60;
    let remainingTime = workDuration;
    let isPaused = true;
    let isWorking = true;
    let intervalId;
    let completedSessions = 0;

    // Áudios
    const workFinished = new Audio("./assets/audios/sounds/work-finished.wav");
    const restFinished = new Audio("./assets/audios/sounds/rest-finished.wav");

	// Managing songs in the default folder
	const audioFolder = "./assets/audios/songs/";
	const audioFiles = [
		"dreams.mp3",
		"hey.mp3",
		"energy.mp3",
		"punky.mp3",
        "happiness.mp3",
		"memories.mp3",
    ];

	let currentAudioIndex = 0;

	// Current audio
    const currentAudio = new Audio(audioFolder + audioFiles[currentAudioIndex]);

	const playWorkingFunctions = {
		playing: () => currentAudio.play(),
		paused: () => currentAudio.pause(),
		stopped: () => currentAudio.pause()
	};

	// Play next song
    function playNextAudio() {
        currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
        currentAudio.src = audioFolder + audioFiles[currentAudioIndex];
        currentAudio.play();
    }

	// When a song ends, play the next one
    currentAudio.addEventListener("ended", playNextAudio);


    // const playWorking = new Audio("./assets/audios/songs/happiness.mp3");

    // Pomodoro overlay screen
    window.addEventListener("load", () => {
        fehBody.classList.add('page-loaded');
    });

    // Div Help
    btnOpenHelp.addEventListener("click", () => {
        feeHelp.style.display = "block";
    });

    btnCloseHelp.addEventListener("click", () => {
        feeHelp.style.display = "none";
    });

    // Toggle settings screen
    function setBodySettings() {
        fehBody.classList.toggle('settings-active');
    }

    function toggleSettings(event) {
        if (event.type === 'click' || (event.type === 'keydown' && event.keyCode === 27)) {
            setBodySettings();
        }
    }

    btnToggleSettings.addEventListener('click', toggleSettings);
    btnCloseSettings.addEventListener('click', toggleSettings);
    document.addEventListener('keydown', toggleSettings);

    // Play button is clicked + start timer
    function handleStartButtonClick() {
        isPaused = false;
        fehBody.classList.add('timer-running');
        playerButtons.style.display = "grid";

        if (isWorking) {
            fehBody.classList.remove('timer-paused');
            startPlayer();
        } else {
            fehBody.classList.add('rest-mode');
            fehBody.classList.remove('timer-paused');
        }

        if (!intervalId) {
            intervalId = setInterval(updateTimer, 1000);
        }
    }

    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", handleStartButtonClick);

    // Pause button is clicked
    function handlePauseButtonClick() {
        isPaused = true;
        fehBody.classList.remove('timer-running');
        fehBody.classList.add('timer-paused');
        document.title = "Pomodoro Pausado";
    }

    const pauseBtn = document.getElementById("pause-btn");
    pauseBtn.addEventListener("click", handlePauseButtonClick);

    // Music Player button is clicked	
    function updatePlayerState(state) {
		const states = {
			playing: "Tocando",
			paused: "Pausado",
			stopped: "Parado"
		};
	
		labelPlayer.innerText = states[state];
		
		if (state === "stopped") {
			currentAudio.pause()
			currentAudio.currentTime = 0;
		} else {
			playWorkingFunctions[state]();
		}
	
		playerPlay.disabled = state === "playing";
		playerPlay.classList.toggle('player-active', state === "playing");
		playerPlay.classList.toggle('player-deactivate', state !== "playing");
	
		playerPause.disabled = state === "paused";
		playerPause.classList.toggle('player-active', state === "paused");
		playerPause.classList.toggle('player-deactivate', state !== "paused");
	
		playerStop.disabled = state === "stopped";
		playerStop.classList.toggle('player-active', state === "stopped");
		playerStop.classList.toggle('player-deactivate', state !== "stopped");
	}
	
	function startPlayer() {
		updatePlayerState("playing");
	}
	
	function pausePlayer() {
		updatePlayerState("paused");
	}
	
	function stopPlayer() {
		updatePlayerState("stopped");
	}

    playerPlay.addEventListener("click", startPlayer);
    playerPause.addEventListener("click", pausePlayer);
    playerStop.addEventListener("click", stopPlayer);

    // Get work / rest times from settings
    function updateDurations() {
        workDuration = parseInt(workDurationInput.value) * 60;
        restDuration = parseInt(restDurationInput.value) * 60;
        remainingTime = isWorking ? workDuration : restDuration;
        updateProgress();
    }

    workDurationInput.addEventListener("change", updateDurations);
    restDurationInput.addEventListener("change", updateDurations);

	// Lowers the volume to highlight alert sounds
	let nextSoundDuration = 0;

	function decreaseVolume() {
        if (remainingTime === 1) {
            playWorking.volume = 0.1;
        }
    }

    // Restore playWorking music volume
    function restoreVolume() {
        playWorking.volume = 1;
    }

	 // Calculate the duration of the next sound
	 function calculateNextSoundDuration() {
        const nextSound = isWorking ? workFinished : restFinished;
        nextSoundDuration = (nextSound.duration + 1) * 1000;
    }
	

    // Timer
    function updateTimer() {	
        if (!isPaused) {
            remainingTime--;

            if (remainingTime <= 0) {
                handleTimerCompletion();
            }

            document.title = timerTime.textContent = formatTime(remainingTime);
            updateProgress();
			decreaseVolume();
        }
    }

    function handleTimerCompletion() {
        isWorking = !isWorking;
        remainingTime = isWorking ? workDuration : restDuration;

        if (!isWorking) {
            fehBody.classList.add('rest-mode');
            fehBody.classList.remove('timer-running');
            completedSessions++;
            completedSessionsElement.textContent = completedSessions;
        } else {
            fehBody.classList.remove('rest-mode');
            fehBody.classList.remove('timer-running');  
			nextSoundDuration = 0;          
        }

		calculateNextSoundDuration();

        const playAlarm = isWorking ? restFinished : workFinished;
        playAlarm.play();

        isPaused = true;
        fehBody.classList.remove('timer-work-active');
		setTimeout(restoreVolume, nextSoundDuration); 
    }

    // Update circle progress
    function updateProgress() {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const totalDuration = isWorking ? workDuration : restDuration;
        const dashOffset = circumference * remainingTime / totalDuration;
        circleProgress.style.strokeDashoffset = dashOffset;
        timerTime.textContent = formatTime(remainingTime);
    }

    // Format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    updateDurations();
})();
