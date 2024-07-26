document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name');
  const weeklyGoalHoursInput = document.getElementById('weekly-goal-hours');
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

  function loadData() {
    const savedName = localStorage.getItem('userName');
    const savedWeeklyGoal = JSON.parse(localStorage.getItem('weeklyGoal'));
    const savedWeeklyHours = JSON.parse(localStorage.getItem('weeklyHours'));
    const savedDailyHours = JSON.parse(localStorage.getItem('dailyHours'));
    const savedTimerData = JSON.parse(localStorage.getItem('timerData'));
    const savedWeekStartDate = localStorage.getItem('weekStartDate');

    console.log('Cargando datos...');
    console.log('savedName:', savedName);
    console.log('savedWeeklyGoal:', savedWeeklyGoal);
    console.log('savedWeeklyHours:', savedWeeklyHours);
    console.log('savedDailyHours:', savedDailyHours);
    console.log('savedTimerData:', savedTimerData);
    console.log('savedWeekStartDate:', savedWeekStartDate);

    if (savedName) {
      userName.textContent = savedName;
      nameInput.value = savedName;
    }

    if (savedWeeklyGoal) {
      weeklyGoal = savedWeeklyGoal;
      weeklyGoalDisplay.textContent = `${Math.floor(weeklyGoal / 3600)}:00:00`;
    }

    if (savedWeeklyHours) {
      weeklyHours = savedWeeklyHours;
      updateWeeklyHoursDisplay();
    }

    if (savedDailyHours) {
      dailyHours = savedDailyHours;
      updateDailyHoursDisplay();
    }

    if (savedTimerData) {
      elapsedSeconds = savedTimerData.elapsedSeconds;
      isRunning = savedTimerData.isRunning;
      const startTime = savedTimerData.startTime ? new Date(savedTimerData.startTime) : null;

      if (isRunning) {
        const now = new Date();
        const secondsPassed = Math.floor((now - startTime) / 1000);
        elapsedSeconds += secondsPassed;
        timer = setInterval(updateTimer, 1000);
      }

      updateTimerDisplay();
    }

    if (savedWeekStartDate) {
      const lastWeekStartDate = new Date(parseInt(savedWeekStartDate));
      const now = new Date();

      if (!isSameWeek(lastWeekStartDate, now)) {
        resetWeeklyData();
      }
    } else {
      localStorage.setItem('weekStartDate', new Date().getTime());
    }
  }

  function saveData() {
    console.log('Guardando datos...');
    console.log('userName:', nameInput.value);
    console.log('weeklyGoal:', weeklyGoal);
    console.log('weeklyHours:', weeklyHours);
    console.log('dailyHours:', dailyHours);
    console.log('timerData:', {
      elapsedSeconds,
      isRunning,
      startTime: isRunning ? (new Date()).toISOString() : null
    });
    
    localStorage.setItem('userName', nameInput.value);
    localStorage.setItem('weeklyGoal', JSON.stringify(weeklyGoal));
    localStorage.setItem('weeklyHours', JSON.stringify(weeklyHours));
    localStorage.setItem('dailyHours', JSON.stringify(dailyHours));
    localStorage.setItem('timerData', JSON.stringify({
      elapsedSeconds,
      isRunning,
      startTime: isRunning ? (new Date()).toISOString() : null
    }));
    localStorage.setItem('weekStartDate', new Date().getTime());
  }

  function isSameWeek(date1, date2) {
    const startOfWeek1 = new Date(date1.setDate(date1.getDate() - date1.getDay()));
    const startOfWeek2 = new Date(date2.setDate(date2.getDate() - date2.getDay()));

    return startOfWeek1.getTime() === startOfWeek2.getTime();
  }

  function resetWeeklyData() {
    weeklyHours = 0;
    dailyHours = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
    };
    updateWeeklyHoursDisplay();
    updateDailyHoursDisplay();
  }

  function updateTimer() {
    elapsedSeconds++;
    updateTimerDisplay();
    saveData();
  }

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

  registerBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const weeklyGoalHours = parseInt(weeklyGoalHoursInput.value) || 0;

    if (name && weeklyGoalHours > 0) {
      userName.textContent = name;
      weeklyGoal = weeklyGoalHours * 3600;
      weeklyGoalDisplay.textContent = `${weeklyGoalHours.toString().padStart(2, '0')}:00:00`;
      registerScreen.style.display = 'none';
      trackerScreen.style.display = 'block';
      saveData();
    } else {
      alert('Por favor, introduce un nombre y un objetivo semanal válido.');
    }
  });

  startBtn.addEventListener('click', () => {
    if (!isRunning) {
      timer = setInterval(updateTimer, 1000);
      isRunning = true;
      saveData();
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
    }
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    elapsedSeconds = 0;
    isRunning = false;
    updateTimerDisplay();
    saveData();
  });

  loadData();
});


  