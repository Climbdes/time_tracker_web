document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const weeklyGoalHoursInput = document.getElementById('weekly-goal-hours');
    const weeklyGoalMinutesInput = document.getElementById('weekly-goal-minutes');
    const registerBtn = document.getElementById('register-btn');
    const registerScreen = document.getElementById('register-screen');
    const trackerScreen = document.getElementById('tracker-screen');
    const userName = document.getElementById('user-name');
    const weeklyGoalDisplay = document.getElementById('weekly-goal-display');
    const weeklyHoursDisplay = document.getElementById('weekly-hours');
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
  
    const dailyHoursDisplays = {
      monday: document.getElementById('monday-hours'),
      tuesday: document.getElementById('tuesday-hours'),
      wednesday: document.getElementById('wednesday-hours'),
      thursday: document.getElementById('thursday-hours'),
      friday: document.getElementById('friday-hours'),
    };
  
    let timer;
    let elapsedSeconds = 0;
    let isRunning = false;
    let weeklyGoal = 0;
    let weeklyHours = 0;
    let dailyHours = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
    };
  
    // Cargar datos del localStorage
    function loadData() {
      const savedName = localStorage.getItem('name');
      const savedWeeklyGoal = localStorage.getItem('weeklyGoal');
      const savedWeeklyHours = localStorage.getItem('weeklyHours');
      const savedElapsedSeconds = localStorage.getItem('elapsedSeconds');
      const savedDailyHours = localStorage.getItem('dailyHours');
  
      if (savedName) {
        nameInput.value = savedName;
        userName.textContent = savedName;
      }
  
      if (savedWeeklyGoal) {
        weeklyGoal = parseInt(savedWeeklyGoal, 10);
        const goalHours = Math.floor(weeklyGoal / 3600);
        const goalMinutes = Math.floor((weeklyGoal % 3600) / 60);
        weeklyGoalHoursInput.value = goalHours;
        weeklyGoalMinutesInput.value = goalMinutes;
        weeklyGoalDisplay.textContent = `${goalHours} horas ${goalMinutes} minutos`;
      }
  
      if (savedWeeklyHours) {
        weeklyHours = parseInt(savedWeeklyHours, 10);
        updateWeeklyHoursDisplay();
      }
  
      if (savedElapsedSeconds) {
        elapsedSeconds = parseInt(savedElapsedSeconds, 10);
        updateTimerDisplay();
      }
  
      if (savedDailyHours) {
        dailyHours = JSON.parse(savedDailyHours);
        updateDailyHoursDisplay();
      }
  
      if (savedName) {
        registerScreen.style.display = 'none';
        trackerScreen.style.display = 'block';
      }
    }
  
    // Guardar datos en el localStorage
    function saveData() {
      localStorage.setItem('name', nameInput.value.trim());
      localStorage.setItem('weeklyGoal', weeklyGoal);
      localStorage.setItem('weeklyHours', weeklyHours);
      localStorage.setItem('elapsedSeconds', elapsedSeconds);
      localStorage.setItem('dailyHours', JSON.stringify(dailyHours));
    }
  
    registerBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      const goalHours = weeklyGoalHoursInput.value.trim();
      const goalMinutes = weeklyGoalMinutesInput.value.trim();
      if (name && goalHours && goalMinutes) {
        userName.textContent = name;
        weeklyGoal = parseInt(goalHours, 10) * 3600 + parseInt(goalMinutes, 10) * 60;
        weeklyGoalDisplay.textContent = `${goalHours} horas ${goalMinutes} minutos`;
        registerScreen.style.display = 'none';
        trackerScreen.style.display = 'block';
        saveData();
      }
    });
  
    startBtn.addEventListener('click', () => {
      if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
          elapsedSeconds++;
          updateTimerDisplay();
        }, 1000);
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
      }
    });
  
    stopBtn.addEventListener('click', () => {
      if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        const day = getCurrentDay();
        dailyHours[day] += elapsedSeconds;
        weeklyHours += elapsedSeconds;
        elapsedSeconds = 0;
        updateTimerDisplay();
        updateDailyHoursDisplay();
        updateWeeklyHoursDisplay();
        saveData();
        startBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
      }
    });
  
    resetBtn.addEventListener('click', () => {
      clearInterval(timer);
      elapsedSeconds = 0;
      isRunning = false;
      updateTimerDisplay();
      startBtn.style.display = 'inline-block';
      stopBtn.style.display = 'none';
      saveData();
    });
  
    function updateTimerDisplay() {
      const hours = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
      const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
  
    function updateWeeklyHoursDisplay() {
      const hours = Math.floor(weeklyHours / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((weeklyHours % 3600) / 60).toString().padStart(2, '0');
      const seconds = (weeklyHours % 60).toString().padStart(2, '0');
      weeklyHoursDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
  
    function updateDailyHoursDisplay() {
      for (const day in dailyHoursDisplays) {
        const totalSeconds = dailyHours[day];
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        dailyHoursDisplays[day].textContent = `${hours}:${minutes}:${seconds}`;
      }
    }
  
    function getCurrentDay() {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = new Date().getDay();
      return days[today];
    }
  
    loadData();
  });
  