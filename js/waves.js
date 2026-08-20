const canvas = document.getElementById('waveCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  let lastW = 0, lastH = 0;

  function resize() {
    const DPR = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const newW = Math.round(rect.width * DPR);
    const newH = Math.round(rect.height * DPR);

    if (newW === lastW && newH === lastH) return;
    lastW = newW;
    lastH = newH;

    canvas.width = newW;
    canvas.height = newH;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  window.addEventListener('resize', resize);

  const LINES = 24;
  let time = 0;

  function drawWave(offsetY, amplitude, color, opacity, speedOffset) {
    ctx.beginPath();

    const w = canvas.getBoundingClientRect().width;

    for (let x = 0; x <= w; x += 2) {
      const normalizedX = x / w;
      if (normalizedX < 0.30) continue;

      const y =
        offsetY +
        Math.sin(x * 0.008 + time + speedOffset) * amplitude +
        Math.sin(x * 0.003 + time * 0.6) * (amplitude * 0.35);

      if (x === Math.floor(w * 0.30)) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = 3;
    ctx.shadowColor = color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < LINES; i++) {
      const y = canvas.height * 0.05 + i * 18;

      drawWave(
        y,
        24,
        i % 5 === 0 ? 'rgba(255,107,0,0.9)' : 'rgba(0,212,255,0.9)',
        0.05 + i * 0.012,
        i * 0.18
      );
    }

    time += 0.008;
    requestAnimationFrame(animate);
  }

  animate();
}
