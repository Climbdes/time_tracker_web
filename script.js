import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');
  const showRegisterBtn = document.getElementById('show-register-btn');
  const registerUsername = document.getElementById('register-username');
  const registerPassword = document.getElementById('register-password');
  const registerWeeklyGoal = document.getElementById('register-weekly-goal');
  const registerBtn = document.getElementById('register-btn');
  const showLoginBtn = document.getElementById('show-login-btn');
  const loginScreen = document.getElementById('login-screen');
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

  function updateDisplay() {
    updateTimerDisplay();
    updateWeeklyHoursDisplay();
    updateDailyHoursDisplay();
  }

  function updateTimer() {
    elapsedSeconds++;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(elapsedSeconds);
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secondsFormatted = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secondsFormatted}`;
  }

  function updateWeeklyHoursDisplay() {
    weeklyHoursDisplay.textContent = formatTime(weeklyHours);
  }

  function updateDailyHoursDisplay() {
    for (const day in dailyHoursDisplays) {
      dailyHoursDisplays[day].textContent = formatTime(dailyHours[day]);
    }
  }

  async function saveData(uid) {
    try {
      await setDoc(doc(db, 'users', uid), {
        weeklyGoal,
        dailyHours
      });
      console.log('Datos guardados correctamente');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  }

  async function loadUserData(uid) {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        weeklyGoal = data.weeklyGoal;
        weeklyGoalDisplay.textContent = formatTime(weeklyGoal);
        dailyHours = data.dailyHours;
        weeklyHours = Object.values(dailyHours).reduce((acc, hours) => acc + hours, 0);
        updateDisplay();
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  }

  loginBtn.addEventListener('click', () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (username && password) {
      signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          const user = userCredential.user;
          userName.textContent = username;
          loadUserData(user.uid);
          loginScreen.style.display = 'none';
          trackerScreen.style.display = 'block';
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
        });
    } else {
      alert('Por favor, introduce un nombre de usuario y una contraseña válidos.');
    }
  });

  registerBtn.addEventListener('click', () => {
    const username = registerUsername.value.trim();
    const password = registerPassword.value.trim();
    const weeklyGoalHours = parseInt(registerWeeklyGoal.value) || 0;

    if (username && password && weeklyGoalHours > 0) {
      createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return setDoc(doc(db, 'users', user.uid), {
            weeklyGoal: weeklyGoalHours * 3600,
            dailyHours: {
              monday: 0,
              tuesday: 0,
              wednesday: 0,
              thursday: 0,
              friday: 0
            }
          });
        })
        .then(() => {
          alert('Usuario registrado exitosamente');
          showLoginBtn.click();
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
        });
    } else {
      alert('Por favor, introduce un nombre de usuario, una contraseña y un objetivo semanal válido.');
    }
  });

  showRegisterBtn.addEventListener('click', () => {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'block';
  });

  showLoginBtn.addEventListener('click', () => {
    registerScreen.style.display = 'none';
    loginScreen.style.display = 'block';
  });

  startBtn.addEventListener('click', () => {
    if (!isRunning) {
      timer = setInterval(updateTimer, 1000);
      isRunning = true;
    }
  });

  stopBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
      dailyHours[today] += elapsedSeconds;
      weeklyHours += elapsedSeconds;
      elapsedSeconds = 0;
      updateDisplay();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          saveData(user.uid);
        }
      });
    }
  });

  resetBtn.addEventListener('click', () => {
    if (!isRunning) {
      elapsedSeconds = 0;
      updateTimerDisplay();
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userName.textContent = user.email;
      loadUserData(user.uid);
      loginScreen.style.display = 'none';
      trackerScreen.style.display = 'block';
    }
  });
});




