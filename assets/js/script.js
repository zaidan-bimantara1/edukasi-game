const startCard = document.getElementById("start-card");
const welcomeCard = document.getElementById("welcome-card");
const questionCard = document.getElementById("question-card");
const scoreLeaderboardCard = document.getElementById("score-leaderboard-card");

const startButton = document.getElementById("start-button");
const playButton = document.getElementById("play-button");
const questionText = document.getElementById("question-text");
const optionButtons = document.querySelectorAll(".option-button");
const resultText = document.getElementById("result-text");
const leaderboardButton = document.getElementById("leaderboard-link");
const backButton = document.getElementById("back-button");
const nameInput = document.getElementById("initials");
const scoreText = document.getElementById("score-text");
const nextButton = document.getElementById("next-button");
const finishButton = document.getElementById("finish-button");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const gameQuizLink = document.querySelector('a[href="index.html"]');

// Tambahkan event listener pada link "GAME QUIZ"
gameQuizLink.addEventListener('click', (e) => {
  // Mencegah perilaku default link
  e.preventDefault();

  // Sembunyikan start card dan leaderboard card
  startCard.style.display = 'none';
  document.getElementById('score-leaderboard-card').style.display = 'none';
  document.getElementById('question-card').style.display = 'none';

  // Tampilkan welcome card
  welcomeCard.style.display = 'block';
});

//welcome function
playButton.addEventListener("click", function() {
  welcomeCard.style.display = "none";
  startCard.style.display = "block";
});

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Fetch question data from file
  fetch('assets/data/questions.json')
    .then(response => response.json())
    .then(data => {
      questions = data;
    })
    .catch(error => console.error('Error:', error));

  startButton.addEventListener('click', function() {
      if (nameInput.value.trim() === "") {
          alert("Nama lengkap harus diisi sebelum memulai kuis.");
          nameInput.focus();
      } else {
          // Shuffle questions before starting the quiz
          shuffleArray(questions);
          // Start quiz
          startQuiz();
      }
  });

  // Event listener for the Next button
  nextButton.addEventListener('click', function() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  });

  // Event listener for the Finish button
  if (finishButton) {
    finishButton.addEventListener('click', function() {
      endQuiz(); // Call the function to end the quiz
    });
  }
});

// Ambil elemen header
const header = document.querySelector('header'); // Sesuaikan selector ini dengan elemen header Anda jika diperlukan

// Function to start the quiz
function startQuiz() {
  const userName = nameInput.value.trim(); // Get the user's name
  if (userName === "") {
    alert("Nama lengkap harus diisi sebelum memulai kuis.");
    nameInput.focus();
    return;
  }
  currentQuestionIndex = 0;
  score = 0; // Reset score
  
  // Select random questions from the questions array
  const randomQuestions = [...questions];

  // Shuffle the selected questions
  shuffleArray(randomQuestions);
  
  // Update the questions array with the selected 10 questions
  questions = randomQuestions;
  
  // Tambahkan animasi saat startCard menghilang dan questionCard muncul
  startCard.classList.add("animate-fade-out");
  questionCard.classList.add("animate-fade-in");
  
  // Tunggu animasi selesai sebelum mengubah display
  setTimeout(() => {
    startCard.style.display = "none";
    questionCard.style.display = "block";
    
    // Tambahkan kelas animasi ke header
    header.classList.add('header-slide-up'); // Menambahkan animasi "naik ke atas"
    
    // Tunggu animasi selesai sebelum menyembunyikan header
    setTimeout(() => {
      header.style.display = 'none'; // Menyembunyikan header setelah animasi selesai
    }, 500); // Sesuaikan waktu dengan durasi animasi
    
    showQuestion();
  }, 500); // Sesuaikan waktu dengan durasi animasi
  
  
  // Hapus kelas animasi setelah animasi selesai
  setTimeout(() => {
    startCard.classList.remove("animate-fade-out");
    questionCard.classList.remove("animate-fade-in");
  }, 500);
}

// Function to show a question
function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.questionText;
  optionButtons.forEach((button, index) => {
    button.textContent = currentQuestion.options[index];
    button.classList.remove("selected", "correct", "incorrect");
    button.disabled = false; // Enable buttons
  });
  resultText.textContent = "";
  nextButton.style.display = "none"; // Hide Next button initially

  // Ensure explanation is hidden when showing a new question
  const explanationText = document.getElementById("explanation-text");
  explanationText.style.display = "none";
  document.getElementById("explanation-div").classList.remove("show"); // Remove show class
}

// Function to handle option selection
optionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    checkAnswer(event);
  });
});

// Function to check the answer
function checkAnswer(event) {
  const correctSound = document.getElementById('correct-sound');
  const incorrectSound = document.getElementById('incorrect-sound');

  const optionButton = event.target;
  const currentQuestion = questions[currentQuestionIndex];

  if (optionButton.textContent === currentQuestion.answer) {
    optionButton.classList.add("correct"); // Add correct class
    resultText.textContent = "BENAR";
    resultText.style.color = "green";
    score++;
    correctSound.play();  // Play correct answer sound
  } else {
    optionButton.classList.add("incorrect"); // Add incorrect class
    resultText.textContent = "SALAH";
    resultText.style.color = "red";
    incorrectSound.play();  // Play incorrect answer sound
  }

  // Disable buttons after selecting an answer
  optionButtons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === currentQuestion.answer) {
      button.classList.add("correct"); // Mark the correct answer
    }
  });

  // Show Next button
  nextButton.style.display = "block";

  // Show explanation
  const explanationText = document.getElementById("explanation-text");
  explanationText.textContent = currentQuestion.explanation;
  explanationText.style.display = "block";
  document.getElementById("explanation-div").classList.add("show");
}

let highscoreList = [];

// Function to end the quiz
function endQuiz() {
  // Add animation classes to the cards
  questionCard.classList.add("animate-fade-out");
  scoreLeaderboardCard.classList.add("animate-fade-in");

  // Wait for the animation to complete before hiding/showing the cards
  setTimeout(() => {
    questionCard.style.display = "none";
    scoreLeaderboardCard.style.display = "block";
    scoreText.textContent = `${score}`; // Display the final score
    
    // Tampilkan header dengan animasi "turun ke bawah"
    header.style.display = 'block'; // Menampilkan header
    header.classList.add('header-slide-down'); // Menambahkan animasi "turun ke bawah"
    
   // Inisialisasi canvas untuk confetti
   const canvas = document.getElementById('confetti-canvas');
   canvas.width = scoreLeaderboardCard.clientWidth;
   canvas.height = scoreLeaderboardCard.clientHeight;

   // Panggil efek confetti
   const confetti = (canvas) => {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#FF0', '#0F0', '#00F', '#F00', '#F0F', '#0FF'];

    // Fungsi untuk menghasilkan partikel baru
    const createParticle = () => {
        particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height, // Mulai dari bagian bawah canvas
            radius: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: {
                x: Math.random() * 2 - 1,
                y: Math.random() * -3 - 1
            }
        });
    };

    // Loop animasi
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Menghasilkan partikel baru secara terus-menerus
        createParticle();

        particles.forEach((particle, index) => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            // Menghapus partikel yang sudah keluar dari canvas
            if (particle.y < 0) {
                particles.splice(index, 1);
            }
        });

        requestAnimationFrame(animate); // Memanggil fungsi animate untuk frame berikutnya
      };

      animate(); // Memulai animasi
  };

   confetti(canvas); // Panggil fungsi confetti

  }, 500); // adjust the timeout duration to match the animation duration

  // Remove the animation classes after the animation is complete
  setTimeout(() => {
    questionCard.classList.remove("animate-fade-out");
    scoreLeaderboardCard.classList.remove("animate-fade-in");
  }, 500);

  // Create a new high score object
  const userName = nameInput.value.trim();
  const userScore = score;

  // Periksa apakah nama pengguna sudah ada di daftar peringkat tinggi
  const existingHighscoreIndex = highscoreList.findIndex((highscore) => highscore.name === userName);

  if (existingHighscoreIndex !== -1) {
    // Jika sudah ada, perbarui nilai peringkat jika nilai baru lebih tinggi
    if (userScore > highscoreList[existingHighscoreIndex].score) {
      highscoreList[existingHighscoreIndex].score = userScore;
    }
  } else {
    // Jika belum ada, tambahkan peringkat baru
    const newHighscore = { name: userName, score: userScore };
    highscoreList.push(newHighscore);
  }

  // Sort the high score list in descending order
  highscoreList.sort((a, b) => b.score - a.score);

  // Get the user's ranking
  const userRanking = highscoreList.findIndex((highscore) => highscore.name === userName) + 1;

  // Display the sorted high score list
  const highscoreListElement = document.getElementById("highscore-list");
  highscoreListElement.innerHTML = "";
  highscoreList.forEach((highscore) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${highscore.name} - ${highscore.score}`;
    highscoreListElement.appendChild(listItem);
  });
}

// Function to show the leaderboard
function showLeaderboard() {
  // Tampilkan daftar peringkat tinggi yang diurutkan
  const highscoreListElement = document.getElementById("highscore-list");
  highscoreListElement.innerHTML = "";

  // Periksa apakah daftar peringkat tinggi sudah dibuat
  if (highscoreList.length > 0) {
    highscoreList.forEach((highscore) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${highscore.name} - ${highscore.score}`;
      highscoreListElement.appendChild(listItem);
    });
  } else {
    // Jika daftar peringkat tinggi belum dibuat, tampilkan pesan kosong
    const listItem = document.createElement("li");
    listItem.textContent = "Belum ada peringkat tinggi";
    highscoreListElement.appendChild(listItem);
  }

  welcomeCard.style.display = "none"; // Sembunyikan kartu selamat datang
  startCard.style.display = "none";
  questionCard.style.display = "none";
  scoreLeaderboardCard.style.display = "block";
}

// Fungsi untuk kembali ke menu utama dari leaderboard
backButton.addEventListener("click", () => {
  // Add animation classes to the cards
  scoreLeaderboardCard.classList.add("animate-fade-out");
  startCard.classList.add("animate-fade-in");
  
  // Wait for the animation to complete before hiding/showing the cards
  setTimeout(() => {
    scoreLeaderboardCard.style.display = "none";
    startCard.style.display = "block";
    welcomeCard.style.display = "none"; 
    questionCard.style.display = "none";
    scoreText.textContent = "";
  }, 500); // adjust the timeout duration to match the animation duration

  // Remove the animation classes after the animation is complete
  setTimeout(() => {
    scoreLeaderboardCard.classList.remove("animate-fade-out");
    startCard.classList.remove("animate-fade-in");
  }, 500);
});

const backsound = document.getElementById('backsound');
const playPauseButton = document.getElementById('play-pause-backsound');

// Backsound Play/Pause Control
playPauseButton.addEventListener('click', function() {
  if (backsound.paused) {
    backsound.play();
    playPauseButton.textContent = '';
    playPauseButton.innerHTML = '<i class="fas fa-volume-up"></i> ';
  } else {
    backsound.pause();
    playPauseButton.textContent = '';
    playPauseButton.innerHTML = '<i class="fas fa-volume-mute"></i> ';
  }
});

// Putar backsound otomatis saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  backsound.play();
});


// Tambahkan kode JavaScript ini di file script.js
document.getElementById('leaderboard-link').addEventListener('click', function() {
  document.getElementById('welcome-card').style.display = 'none';
  document.getElementById('start-card').style.display = 'none';
  document.getElementById('question-card').style.display = 'none';
  document.getElementById('score-leaderboard-card').style.display = 'block';
});