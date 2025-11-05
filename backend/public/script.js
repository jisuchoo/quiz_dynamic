// ===== 퀴즈 데이터 (원하실 때 자유롭게 교체하세요) =====
const quizData = [
  { question: "한화 시그니처 여성 건강보험 3.0의 납입면제 강화형 상품에서 암 관련 담보들은 '감액'기간이 없다.", answer: true },
  { question: "새로 출시한 '암특정치료비(각연간1회한)' 담보는 모든 상품에서 '감액'기간이 없다.", answer: true },
  { question: "2~40대의 젊은 유방암은 호르몬에 반응하는 'A타입 유방암' 비율이 적다.", answer: true },
  { question: "프리미엄 올인원 플랜에서는 항암호르몬 치료비 담보가 '1천만원'까지 가입 가능하다.", answer: true },
  { question: "유방암은 일반적으로 치료 종료 후 5년이면 완치되었다고 판정한다.", answer: false },
  { question: "40세 미만의 유방암 환자의 경우 10명 중 3명은 10년 내에 재발한다.", answer: true },
  { question: "새로 출시한 '암특정치료비(각연간1회한)' 담보의 '연간1회한'의 뜻은 '암 진단일'을 기점으로 연간으로 보장한다는 말이다.", answer: false },
  { question: "혈뇨와 통증이 동반한다면 방광염보다 방광암을 의심해야 한다.", answer: false },
  { question: "방광암의 가장 큰 원인은 '흡연'이다.", answer: true },
  { question: "방광암은 내시경으로 수술하므로 재발이 거의 없는 암이다.", answer: false },
  { question: "프리미엄 올인원 플랜으로 '암특정치료비(각연간1회한)' 3천만원을 포함하여 보험료 20만원을 판매했다면, 1주차의 시상금은 43만원이다.", answer: true },
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
