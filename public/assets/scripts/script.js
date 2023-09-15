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
    const playWorking = new Audio("./assets/audio/happiness.mp3");
    const workFinished = new Audio("./assets/audio/work-finished.wav");
    const restFinished = new Audio("./assets/audio/rest-finished.wav");

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

    // Timer
    function updateTimer() {
        if (!isPaused) {
            remainingTime--;

            if (remainingTime <= 0) {
                handleTimerCompletion();
            }

            document.title = timerTime.textContent = formatTime(remainingTime);
            updateProgress();
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
            stopPlayer();
        }

        const playAlarm = isWorking ? restFinished : workFinished;
        playAlarm.play();

        isPaused = true;
        fehBody.classList.remove('timer-work-active');
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
