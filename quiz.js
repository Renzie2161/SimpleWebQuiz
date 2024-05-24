const QuestionContainer = document.getElementById("question-container");
const InputField = document.getElementById("answer-input");
const Feedback = document.getElementById("feedback");
const NextBtn = document.getElementById("next-button");
const Title = document.getElementById("title");
const SubmitBtn = document.getElementById("submit-btn");

let currentQuestion = 0;
let correctAnswers = 0;
let questions = [];
let incorrectAnswers = [];
let startTime;

function Shuffle(array) {
  for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    questions = Shuffle(data.questions);
    startTime = new Date();
    showQuestion();
  })
  .catch((error) => console.error("Error loading questions:", error));

function showQuestion() {
  const currentQ = questions[currentQuestion];
  QuestionContainer.innerHTML = `${currentQuestion + 1}. ${currentQ.question}`;
  InputField.value = "";
  InputField.style.borderColor = "";
  InputField.disabled = false;
  InputField.style.color = "black";
  Feedback.innerText = "";
  Feedback.style.color = "";
  NextBtn.style.display = "none";
  SubmitBtn.style.display = "block";
}

function checkAnswer() {
  const answer = InputField.value.trim();
  const correctAnswer = questions[currentQuestion].answer.trim().toLowerCase();

  SubmitBtn.style.display = "none";

  if (answer.toLowerCase() === correctAnswer) {
    InputField.style.borderColor = "green";
    InputField.style.color = "green";
    Feedback.innerHTML = "<strong>Correct!</strong>";
    Feedback.style.color = "green";
    correctAnswers++;
    setTimeout(nextQuestion, 500);
  } else {
    incorrectAnswers.push({
      question: questions[currentQuestion].question,
      correctAnswer: questions[currentQuestion].answer,
      userAnswer: answer,
    });
    InputField.style.borderColor = "red";
    InputField.style.color = "red";
    InputField.disabled = true;
    Feedback.innerHTML = `Incorrect. The correct answer is <strong>${questions[currentQuestion].answer}</strong>.`;
    Feedback.style.color = "red";
    NextBtn.style.display = "block";
  }
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  const endTime = new Date();
  const timeElapsed = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds
  Title.innerText = "Quiz Completed!";
  const score = (correctAnswers / questions.length) * 100;
  let resultHTML = `
    <strong>You got ${correctAnswers} out of ${questions.length} questions correct!</strong><br>
    <strong>Score: ${score}/100</strong><br>
    <strong>Time Elapsed: ${timeElapsed} seconds</strong><br><br>
  `;
  if (incorrectAnswers.length != 0) {
    resultHTML += `
    <h2>Incorrect Answers:</h2>
    <ul>`;
    incorrectAnswers.forEach((item) => {
      resultHTML += `<li><strong>Question:</strong> ${item.question}<br>
      <strong>Your Answer:</strong> ${item.userAnswer}<br>
      <strong>Correct Answer:</strong> ${item.correctAnswer}</li><br>`;
    });
    resultHTML += `</ul>`;
  }
  QuestionContainer.innerHTML = resultHTML;
  SubmitBtn.style.display = "none";
  InputField.style.display = "none";
  Feedback.style.display = "none";
  NextBtn.style.display = "none";
}

InputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});
SubmitBtn.addEventListener("click", checkAnswer);
NextBtn.addEventListener("click", nextQuestion);
