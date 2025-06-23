let score = 0;
let timeLeft = 60;
let lives = 4;
let droplets = 0;
let gameInterval;
let timerInterval;

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const livesEl = document.getElementById("lives");
const container = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");
const overlay = document.getElementById("start-overlay");
const resetBtn = document.getElementById("reset-btn");
const confettiContainer = document.getElementById("confetti-container");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

function startGame() {
  score = 0;
  timeLeft = 60;
  lives = 4;
  droplets = 0;
  updateUI();
  overlay.style.display = "none";
  confettiContainer.innerHTML = "";

  timerInterval = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame(droplets >= 30);
    }
  }, 1000);

  gameInterval = setInterval(() => {
    createDrop();
  }, 800);
}

function updateUI() {
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  livesEl.innerHTML = '🚒️ '.repeat(lives);
  const fill = document.getElementById("water-fill");
  if (fill) {
    fill.style.height = `${score}%`;
  }
}

function createDrop() {
  const drop = document.createElement("div");
  const isGood = Math.random() > 0.3;
  drop.classList.add("water-drop");
  drop.classList.add(isGood ? "good" : "bad");
  const size = isGood ? (Math.random() > 0.5 ? 60 : 40) : (Math.random() > 0.5 ? 60 : 40);
  drop.style.width = size + "px";
  drop.style.height = size + "px";
  drop.style.left = Math.random() * (container.offsetWidth - size) + "px";

  drop.addEventListener("click", () => handleClick(drop, isGood, size));
  drop.addEventListener("animationend", () => drop.remove());

  container.appendChild(drop);
}

function handleClick(drop, isGood, size) {
  drop.remove();
  if (isGood) {
    score += size === 60 ? 10 : 5;
    droplets++;
    playSound("splash");
    if (droplets >= 30) {
      endGame(true);
    }
  } else {
    if (size === 60) {
      lives--;
    } else {
      score = Math.max(0, score - 10);
    }
    playSound("mud");
    if (lives <= 0) {
      endGame(false);
    }
  }
  updateUI();
}

function endGame(won) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  if (won) {
    showConfetti();
    setTimeout(() => {
      alert("Congratulations! You just helped in collecting water for those who don’t have access.");
    }, 500);
  } else {
    alert("Game Over. Try again!");
  }
  overlay.style.display = "flex";
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 60;
  lives = 4;
  droplets = 0;
  updateUI();
  overlay.style.display = "flex";
  confettiContainer.innerHTML = "";
  // Remove all drops
  document.querySelectorAll('.water-drop').forEach(d => d.remove());
}

function playSound(type) {
  const audio = new Audio(type === "splash" ? "splash.mp3" : "mud.mp3");
  audio.play();
}

function showConfetti() {
  confettiContainer.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random() * 100 + '%';
    conf.style.background = `hsl(${Math.random()*360}, 80%, 60%)`;
    conf.style.animationDelay = (Math.random() * 0.5) + 's';
    confettiContainer.appendChild(conf);
  }
  setTimeout(() => { confettiContainer.innerHTML = ''; }, 2500);
}