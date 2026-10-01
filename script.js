const wishes = [
  ["Chúc bạn một mùa Trung Thu thật ấm áp!", "Mong ánh trăng đêm nay soi sáng những ước mơ, và những người bạn thương luôn ở bên cạnh."],
  ["Trăng tròn, lòng vui, vạn sự như ý!", "Chúc bạn có một đêm rằm thật nhiều tiếng cười, thật nhiều bánh ngon và những khoảnh khắc đáng nhớ."],
  ["Chúc bạn luôn rực rỡ như ánh trăng!", "Mong mọi điều tốt đẹp sẽ tìm đến bạn, hôm nay, ngày mai và cả những ngày sau nữa."],
  ["Đoàn viên hạnh phúc, bình an đủ đầy!", "Dù đi đâu, mong bạn luôn có một nơi để trở về và những người luôn chờ bạn bên mâm cỗ trăng rằm."],
  ["Happy Mid-Autumn Festival! 🌕", "Chúc những điều bạn mong ước sẽ dần thành hiện thực. Hãy luôn giữ nụ cười thật đẹp nhé!"]
];

const wishText = document.getElementById("wishText");
const wishSub = document.getElementById("wishSub");
const wishBtn = document.getElementById("wishBtn");
const changeWish = document.getElementById("changeWish");
const toast = document.getElementById("toast");

function showWish() {
  const item = wishes[Math.floor(Math.random() * wishes.length)];
  wishText.animate(
    [{opacity: 0, transform: "translateY(8px)"}, {opacity: 1, transform: "translateY(0)"}],
    {duration: 450, easing: "ease-out"}
  );
  wishText.textContent = item[0];
  wishSub.textContent = item[1];

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
  fireworks();
}

wishBtn.addEventListener("click", () => {
  document.getElementById("about").scrollIntoView({behavior: "smooth"});
  setTimeout(showWish, 500);
});
changeWish.addEventListener("click", showWish);

function fireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const particles = [];
  const cx = innerWidth / 2;
  const cy = innerHeight * .42;

  for (let i = 0; i < 85; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      life: 1,
      size: 1.5 + Math.random() * 2.5,
      hue: 35 + Math.random() * 45
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += .035;
      p.vx *= .985;
      p.vy *= .985;
      p.life -= .016;

      if (p.life > 0) {
        alive = true;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    if (alive) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  frame();
}

// Nút nhạc: dùng Web Audio đơn giản, không cần file mp3.
let audioCtx = null;
let musicOn = false;
let timer = null;
const musicBtn = document.getElementById("musicBtn");

function playTone(freq, start, duration, volume = .035) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.exponentialRampToValueAtTime(.001, start + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

function startMusic() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [392, 440, 523.25, 587.33, 523.25, 440, 392, 349.23];
  let i = 0;

  const loop = () => {
    if (!musicOn) return;
    const now = audioCtx.currentTime;
    notes.forEach((n, k) => playTone(n, now + k * .32, .3));
    timer = setTimeout(loop, notes.length * 320);
  };
  loop();
}

musicBtn.addEventListener("click", async () => {
  musicOn = !musicOn;
  if (musicOn) {
    startMusic();
    musicBtn.innerHTML = "♫ <span>Đang phát</span>";
  } else {
    clearTimeout(timer);
    if (audioCtx) await audioCtx.close();
    musicBtn.innerHTML = "♫ <span>Nhạc</span>";
  }
});

// Tạo sao lấp lánh nhẹ
const stars = document.querySelector(".stars");
for (let i = 0; i < 35; i++) {
  const s = document.createElement("i");
  s.style.position = "absolute";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 85 + "%";
  s.style.width = s.style.height = (1 + Math.random() * 2) + "px";
  s.style.borderRadius = "50%";
  s.style.background = "#fff";
  s.style.opacity = .25 + Math.random() * .7;
  s.style.animation = `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`;
  s.style.animationDelay = Math.random() * 3 + "s";
  stars.appendChild(s);
}

const style = document.createElement("style");
style.textContent = `
@keyframes twinkle {
  0%,100% { transform: scale(.6); opacity:.25 }
  50% { transform: scale(1.8); opacity:1 }
}`;
document.head.appendChild(style);
