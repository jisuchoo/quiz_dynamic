// ===== 퀴즈 데이터 (원하실 때 자유롭게 교체하세요) =====
const quizData = [
  { question: "한화 시그니처 여성 건강보험 3.0의 납입면제형 상품은 가입 후 1년 뒤부터 출산 시 납입면제가 된다", answer: false },
  { question: "'주요순환계Ⅰ' 담보는 '2대질병특정치료비' 담보보다 저렴하게 가입할 수 있어 경쟁력이 높다", answer: false },
  { question: "'하이클래스Ⅱ' 담보는 해외에서 암 치료 시에도 보장이 된다", answer: true },
  { question: "'주요순환계Ⅰ' 담보는 대동막박리(I71.0) 수술 시에 보장이 된다", answer: true },
  { question: "'2대질병특정치료비' 담보는 대동맥동맥류(I71.1~9) 수술 시에 보장이 된다", answer: false },
  { question: "2022년 무배당 333 WELL100 으로 가입한 고객은 더 경증 간편보험으로 가입 시 보험료를 절감할 수 있다", answer: true },
  { question: "'주요순환계질환Ⅱ특정약제치료비' 담보는 유병자 상품으로 가입 시 90일 이내 사고 발생 시 가입금액의 10%를 지급한다", answer: true },
  { question: "'한화 RICH 간병보험3.0' 상품으로 질병후유장해(3-100%) 담보 가입 시, 후유장해로 보상을 받았을 경우 해약환급금이 줄어든다", answer: false },
  { question: "급성뇌경색 환자의 경우 발병 후 병원 도착까지의 시간 상관없이 혈전용해제를 투여할 수 있다", answer: false },
  { question: "유전적으로 알츠하이머 치매에 더 잘 걸릴 수 있는 유전자가 존재한다", answer: true },
];

// ===== 상태 =====
let username = "";
let current = 0;
let score = 0;
const total = quizData.length;

// ===== 엘리먼트 =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const scoreText = document.getElementById("score-text");
const questionLabel = document.getElementById("question-label");
const questionEl = document.getElementById("question");

const buttons = document.querySelectorAll(".quiz-btn");
const finalText = document.getElementById("final-text");

// ===== 이벤트 =====
startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("이름을 입력하세요!");
    return;
  }
  username = name;

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  current = 0;
  score = 0;
  renderQuestion();
});


buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.getAttribute("data-answer") === "true";
    checkAnswer(val);
  });
});

// ===== 함수 =====
function renderQuestion() {
  if (current >= total) {
    return finishQuiz();
  }
  const q = quizData[current];
  questionEl.textContent = q.question;
  questionLabel.textContent = `문제 ${current + 1}`;
  progressText.textContent = `${current + 1} / ${total}`;
  scoreText.textContent = `점수: ${score}`;
  progressFill.style.width = `${(current / total) * 100}%`;
}

function checkAnswer(userAnswer) {
  const correct = quizData[current].answer;
  if (userAnswer === correct) score++;
  current++;

  setTimeout(() => {
    if (current < total) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }, 400);
}

function finishQuiz() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  progressFill.style.width = "100%";
  scoreText.textContent = `점수: ${score}`;
  finalText.textContent = `최종 점수: ${score} / ${total}`;

  // 서버 저장
  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, score, total })
  }).catch(err => console.error("결과 제출 실패:", err));
}
