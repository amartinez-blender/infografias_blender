(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  canvas.className = 'blender-topo-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);
  document.body.classList.add('blender-topo-ready');

  if (document.querySelector('.app')) {
    document.body.classList.add('blender-infografia-bg');
    const homeLink = document.createElement('a');
    homeLink.className = 'blender-home-link';
    homeLink.href = '../../index.html';
    homeLink.textContent = 'REGRESAR';
    homeLink.setAttribute('aria-label', 'Regresar al Home');
    document.body.appendChild(homeLink);
  }

  const ctx = canvas.getContext('2d');
  const labels = [
    { x: .12, y: .22, text: 'N 20.6721  W 103.3470', delay: 0 },
    { x: .76, y: .18, text: 'ELEV 1486.20', delay: 2.7 },
    { x: .18, y: .74, text: 'GRID 07-24', delay: 4.1 },
    { x: .68, y: .66, text: 'AZ 314.08', delay: 6.4 },
    { x: .84, y: .82, text: 'X 245.82  Y 091.43', delay: 8.3 }
  ];

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawLine(yBase, index, time, color, alpha, lineWidth) {
    const amplitude = 18 + (index % 5) * 6;
    const frequency = 130 + (index % 6) * 20;
    const drift = time * (color === 'yellow' ? 9 : 6);

    ctx.beginPath();
    for (let x = -80; x <= width + 80; x += 18) {
      const y = yBase
        + Math.sin((x + drift + index * 51) / frequency) * amplitude
        + Math.sin((x - drift * .7 + index * 23) / (frequency * .55)) * (amplitude * .34);

      if (x === -80) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = color === 'yellow'
      ? `rgba(255, 214, 0, ${alpha})`
      : `rgba(92, 92, 92, ${alpha})`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function drawLabels(time) {
    ctx.save();
    ctx.font = '600 11px Inter, Arial, sans-serif';
    ctx.letterSpacing = '0px';
    labels.forEach((label) => {
      const pulse = (Math.sin(time * .55 + label.delay) + 1) / 2;
      const opacity = Math.max(0, Math.min(.28, (pulse - .22) * .45));
      ctx.fillStyle = `rgba(22, 22, 22, ${opacity})`;
      ctx.fillText(label.text, label.x * width, label.y * height);
    });
    ctx.restore();
  }

  function render(now = 0) {
    const time = now / 1000;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const spacing = Math.max(58, Math.min(92, width / 15));
    const offset = reduceMotion ? 0 : (time * 6) % spacing;
    const total = Math.ceil(height / spacing) + 5;

    for (let i = -2; i < total; i += 1) {
      const y = i * spacing + offset;
      drawLine(y, i + 14, time, 'gray', .22, 1.35);
      if ((i + 2) % 4 === 0) drawLine(y + spacing * .35, i + 31, time, 'yellow', .34, 1.55);
    }

    drawLabels(time);

    if (!reduceMotion) {
      window.requestAnimationFrame(render);
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  render();
})();
