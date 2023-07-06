const question = document.getElementById("question");
const options = document.querySelector(".quiz-options");
const checkBtn = document.getElementById("check-answer");
const playAgainBtn = document.getElementById("play-again");
const result = document.getElementById("result");
const correctScoreCount = document.getElementById("correct-score");
const totalQuestionCount = document.getElementById("total-question");
const lifeLineCount = document.getElementById("correct-lifeline");

let correctAnswer = "";
let correctScore = (askedCount = 0);
let totalQuestion = 10;
let lifeLine = 3;

// load question from API
const loadQuestion = async (id) => {
  const APIUrl = `https://opentdb.com/api.php?amount=10&category=${id}`;
  const response = await fetch(`${APIUrl}`);
  const data = await response.json();
  result.innerHTML = "";
  console.log("api fetched");
  showQuestion(data.results[0]);
};

// event listeners
const eventListeners = () => {
  checkBtn.addEventListener("click", checkAnswer);
  playAgainBtn.addEventListener("click", restartQuiz);
};

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion(randomId(9, 32));
  eventListeners();
  totalQuestionCount.textContent = totalQuestion;
  correctScoreCount.textContent = correctScore;
});

// display question and options
const showQuestion = (data) => {
  checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  options.innerHTML = `
          ${optionsList
            .map(
              (option, index) => `
              <li> ${index + 1}. <span>${option}</span> </li>
          `
            )
            .join("")}
      `;
  selectOption();
};

// options selection
const selectOption = () => {
  options.querySelectorAll("li").forEach((option) => {
    //check here
    option.addEventListener("click", () => {
      if (options.querySelector(".selected")) {
        const activeOption = options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
};

// answer checking
const checkAnswer = () => {
  checkBtn.disabled = true;
  if (options.querySelector(".selected")) {
    let selectedAnswer = options.querySelector(".selected span").textContent;
    if (selectedAnswer === HTMLDecode(correctAnswer)) {
      //   if (selectedAnswer === correctAnswer) {
      //check here
      correctScore++;
      //   document.querySelector(".quiz-options > li:active").style.background =
      //     "green";
      result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
    } else {
      result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
      lifeLine--;
      lifeLineCount.textContent = lifeLine;
    }
    checkCount();
  } else {
    result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
    checkBtn.disabled = false;
  }
};

// to convert html entities into normal text of correct answer if there is any
const HTMLDecode = (textString) => {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
};

const checkCount = () => {
  askedCount++;
  setCount();
  if (askedCount === totalQuestion || lifeLine === 0) {
    //   if (askedCount === totalQuestion) {
    setTimeout(() => {
      console.log("game end");
    }, 5000);

    result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
    playAgainBtn.style.display = "block";
    checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion(randomId(9, 32));
    }, 600);
  }
};

const setCount = () => {
  totalQuestionCount.textContent = totalQuestion;
  correctScoreCount.textContent = correctScore;
};

const restartQuiz = () => {
  correctScore = askedCount = 0;
  lifeLine = 3;
  lifeLineCount.textContent = lifeLine;
  playAgainBtn.style.display = "none";
  checkBtn.style.display = "block";
  checkBtn.disabled = false;
  setCount();
  loadQuestion(randomId(9, 32));
};

const randomId = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
