const intro = document.querySelector("#intro");
const flowerScreen = document.querySelector("#flowerScreen");
const chooseCatButtons = [...document.querySelectorAll(".choose-cat")];
const catChoices = [...document.querySelectorAll(".cat-choice")];
const choiceCats = [...document.querySelectorAll(".choice-cat")];
const wishEyebrow = document.querySelector("#wishEyebrow");
const flowerTitle = document.querySelector("#flower-title");
const petals = [...document.querySelectorAll(".petal")];
const flower = document.querySelector(".flower");
const messageCard = document.querySelector("#messageCard");
const messageText = document.querySelector("#messageText");
const progressText = document.querySelector("#progressText");
const dots = [...document.querySelectorAll(".dots i")];
const restartButton = document.querySelector("#restartButton");
const wishCloud = document.querySelector("#wishCloud");
const birthdayCat = document.querySelector("#birthdayCat");
const petalReveal = document.querySelector("#petalReveal");
const revealMessage = document.querySelector("#revealMessage");
const roseRain = document.querySelector("#roseRain");
const letterFinale = document.querySelector("#letterFinale");
const envelope = document.querySelector("#envelope");
const envelopeHint = document.querySelector("#envelopeHint");
const finaleRestart = document.querySelector("#finaleRestart");
const letterIntro = document.querySelector("#letterIntro");
const letterNote = document.querySelector("#letterNote");
let selectedCount = 0;
let catTimer;
let finalePending = false;
const speechTimers = new WeakMap();
const guideMessages = {
  dusbere: [
    "Dilediğin güzellikler seni hiç beklemediğin anlarda bulsun.",
    "Her günün içinde yüzünü gülümsetecek küçük ama çok güzel bir sürpriz saklansın.",
    "Gülüşün hiç eksilmesin; yeni yaşındaki her güzel an kalbinde sıcacık bir iz bıraksın.",
    "Tıpkı mis kokulu bir gül gibi, bulunduğun her yere neşe ve güzellik katmaya devam et."
  ],
  bozbas: [
    "Yeni yaşın sana bolca huzur, güzel haberler ve kendinle gurur duyacağın anlar getirsin.",
    "Her günün, küçük bir mutluluğu fark edip gülümseyeceğin kadar güzel geçsin.",
    "Papatyalar kadar içten, güneşli bir sabah kadar ferah mutluluklar seninle olsun.",
    "Gönlünden geçen güzel dilekler, zamanı geldiğinde birer birer gerçeğe dönüşsün."
  ]
};

const introSequenceTimers = [];
introSequenceTimers.push(window.setTimeout(() => {
  positionCatSpeech(catChoices[0]);
  catChoices[0].classList.add("speaking");
}, 450));
introSequenceTimers.push(window.setTimeout(() => {
  catChoices[0].classList.remove("speaking");
  positionCatSpeech(catChoices[1]);
  catChoices[1].classList.add("speaking");
}, 4750));
introSequenceTimers.push(window.setTimeout(() => catChoices[1].classList.remove("speaking"), 9050));

choiceCats.forEach((cat, index) => {
  cat.addEventListener("click", () => showCatSpeech(catChoices[index]));
});

function showCatSpeech(choice) {
  introSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  positionCatSpeech(choice);
  catChoices.forEach((item) => {
    if (item !== choice) item.classList.remove("speaking");
  });
  window.clearTimeout(speechTimers.get(choice));
  choice.classList.remove("speaking");
  void choice.offsetWidth;
  choice.classList.add("speaking");
  speechTimers.set(choice, window.setTimeout(() => choice.classList.remove("speaking"), 4300));
}

function positionCatSpeech(choice) {
  const cat = choice.querySelector(".choice-cat");
  const speech = choice.querySelector(".choice-speech");
  const rect = cat.getBoundingClientRect();
  const safeLeft = Math.min(window.innerWidth - 180, Math.max(180, rect.left + rect.width / 2));
  speech.style.setProperty("--mobile-speech-left", `${safeLeft}px`);
  speech.style.setProperty("--mobile-speech-top", `${Math.max(150, rect.top - 10)}px`);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let i = 0; i < 10; i += 1) createFallingRose(i * 700);
  window.setInterval(() => createFallingRose(0), 950);
}

chooseCatButtons.forEach((button) => button.addEventListener("click", () => {
  const guide = button.dataset.guide;
  petals.forEach((petal, index) => { petal.dataset.message = guideMessages[guide][index]; });
  birthdayCat.classList.toggle("dusbere", guide === "dusbere");
  birthdayCat.classList.toggle("bozbas", guide === "bozbas");
  petalReveal.classList.toggle("rose-reveal", guide === "dusbere");
  petalReveal.classList.toggle("daisy-reveal", guide === "bozbas");
  if (guide === "dusbere") {
    letterIntro.textContent = "Düşbere'den gül kokulu son bir not…";
    letterNote.textContent = "Yeni yaşın, açan güller kadar renkli ve güzel olsun. İyi ki varsın!";
  } else {
    letterIntro.textContent = "Bozbaş'tan papatyalı son bir not…";
    letterNote.textContent = "Her papatya yaprağı sana başka bir güzel gün getirsin. İyi ki doğdun!";
  }
  flowerScreen.classList.toggle("rose-mode", guide === "dusbere");
  flowerScreen.classList.toggle("daisy-mode", guide === "bozbas");
  wishEyebrow.textContent = guide === "dusbere" ? "Düşbere'nin dilek gülleri" : "Bozbaş'ın dilek papatyası";
  flowerTitle.textContent = guide === "dusbere" ? "Her gül yaprağında sana bir dileğim var." : "Her papatya yaprağında sana bir dileğim var.";
  intro.classList.remove("active");
  intro.setAttribute("aria-hidden", "true");
  flowerScreen.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    flowerScreen.classList.add("active");
    petals[0].focus({ preventScroll: true });
  }, 80);
}));

petals.forEach((petal) => {
  petal.addEventListener("click", () => {
    if (petal.classList.contains("chosen")) return;

    flower.classList.add("interacted");
    petal.classList.add("chosen");
    petal.disabled = true;
    petal.setAttribute("aria-label", `${petal.getAttribute("aria-label")} — seçildi`);
    selectedCount += 1;
    messageText.textContent = petal.dataset.message;
    showPetalMessage(petal.dataset.message);
    wishCloud.classList.remove("pop");
    void wishCloud.offsetWidth;
    wishCloud.classList.add("pop");
    birthdayCat.classList.remove("happy");
    void birthdayCat.offsetWidth;
    birthdayCat.classList.add("happy");
    window.clearTimeout(catTimer);
    catTimer = window.setTimeout(() => birthdayCat.classList.remove("happy"), 1100);
    progressText.textContent = `${selectedCount} / 4 dilek keşfedildi`;
    dots[selectedCount - 1].classList.add("on");

    messageCard.classList.remove("reveal");
    void messageCard.offsetWidth;
    messageCard.classList.add("reveal");

    if (selectedCount === petals.length) {
      finalePending = true;
    }
  });
});

petalReveal.addEventListener("click", hidePetalMessage);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && petalReveal.classList.contains("show")) hidePetalMessage();
});

function showPetalMessage(message) {
  revealMessage.textContent = message;
  petalReveal.setAttribute("aria-hidden", "false");
  petalReveal.classList.add("show");
}

function hidePetalMessage() {
  petalReveal.classList.remove("show");
  petalReveal.setAttribute("aria-hidden", "true");
  if (finalePending) {
    finalePending = false;
    window.setTimeout(showLetterFinale, 350);
  }
}

function showLetterFinale() {
  letterFinale.setAttribute("aria-hidden", "false");
  letterFinale.classList.add("show");
  window.setTimeout(() => envelope.focus({ preventScroll: true }), 450);
}

envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  envelope.setAttribute("aria-label", "Açılmış mektup: Seni hâlâ seviyorum");
  envelopeHint.textContent = "Bu not hep senin için…";
  window.setTimeout(() => {
    finaleRestart.hidden = false;
    celebrate();
  }, 1150);
});

finaleRestart.addEventListener("click", resetExperience);

restartButton.addEventListener("click", () => {
  resetExperience();
});

function resetExperience() {
  hidePetalMessage();
  finalePending = false;
  letterFinale.classList.remove("show");
  letterFinale.setAttribute("aria-hidden", "true");
  envelope.classList.remove("open");
  envelope.setAttribute("aria-label", "Mektubu aç");
  envelopeHint.textContent = "Açmak için zarfa dokun";
  finaleRestart.hidden = true;
  selectedCount = 0;
  petals.forEach((petal) => {
    petal.classList.remove("chosen");
    petal.disabled = false;
    petal.setAttribute("aria-label", petal.getAttribute("aria-label").replace(" — seçildi", ""));
  });
  flower.classList.remove("interacted");
  dots.forEach((dot) => dot.classList.remove("on"));
  progressText.textContent = "0 / 4 dilek keşfedildi";
  messageText.textContent = "İlk yaprağını seç…";
  flowerScreen.classList.remove("active");
  flowerScreen.setAttribute("aria-hidden", "true");
  intro.setAttribute("aria-hidden", "false");

  window.setTimeout(() => {
    intro.classList.add("active");
    chooseCatButtons[0].focus({ preventScroll: true });
  }, 80);
}

function celebrate() {
  const colors = ["#e87863", "#f4bd55", "#78956c", "#d9a8b3", "#ffffff"];
  for (let i = 0; i < 55; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--duration", `${2.8 + Math.random() * 2.2}s`);
    piece.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    piece.style.animationDelay = `${Math.random() * .5}s`;
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function createFallingRose(delay = 0) {
  const rose = document.createElement("span");
  rose.className = "falling-rose";
  rose.textContent = "🌹";
  rose.style.setProperty("--rose-left", `${Math.random() * 96}%`);
  rose.style.setProperty("--rose-size", `${15 + Math.random() * 15}px`);
  rose.style.setProperty("--rose-speed", `${7 + Math.random() * 6}s`);
  rose.style.setProperty("--rose-delay", `${delay}ms`);
  rose.style.setProperty("--rose-drift", `${-90 + Math.random() * 180}px`);
  rose.style.setProperty("--rose-spin", `${-260 + Math.random() * 520}deg`);
  roseRain.appendChild(rose);
  rose.addEventListener("animationend", () => rose.remove());
}
