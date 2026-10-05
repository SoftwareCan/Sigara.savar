// "90 saniye" — a short web version of the app's Kriz Bekçisi flow.
// Draws the craving wave over 90 seconds while pacing a 4-4-6 breath.
(() => {
  const DURATION = 90000;
  const BREATH = [
    { key: 'inhale', ms: 4000 },
    { key: 'hold', ms: 4000 },
    { key: 'exhale', ms: 6000 },
  ];
  const CYCLE = BREATH.reduce((sum, p) => sum + p.ms, 0);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-wave-tool]').forEach((tool) => {
    const $ = (sel) => tool.querySelector(sel);
    const path = $('[data-wave-path]');
    const dot = $('[data-wave-dot]');
    const time = $('[data-wave-time]');
    const breathName = $('[data-wave-breath-name]');
    const breathCount = $('[data-wave-breath-count]');
    const phases = [...tool.querySelectorAll('[data-wave-phase]')];
    const startBtn = $('[data-wave-start]');
    const finishBtn = $('[data-wave-finish]');
    const question = $('[data-wave-question]');
    const questionTitle = $('[data-wave-question-title]');
    const result = $('[data-wave-result]');
    const resultTitle = $('[data-wave-result-title]');
    const resultText = $('[data-wave-result-text]');
    const live = $('[data-wave-live]');
    const restartBtn = $('[data-wave-restart]');
    const labels = JSON.parse(tool.dataset.labels || '{}');

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    let start = 0;
    let frame = 0;
    let interval = 0;
    let running = false;
    let progress = 0;
    let activePhase = -1;

    const format = (ms) => {
      const s = Math.max(0, Math.ceil(ms / 1000));
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };

    const setText = (element, value) => {
      if (element.textContent !== value) element.textContent = value;
    };

    const stopTimers = () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
      frame = 0;
      interval = 0;
    };

    const renderVisual = (elapsed) => {
      const p = Math.min(1, elapsed / DURATION);
      progress = elapsed;
      // Reduced motion keeps the entire diagram still. Only the text timer runs.
      dot.style.visibility = reduce.matches ? 'hidden' : '';
      if (reduce.matches) {
        path.style.strokeDashoffset = '0';
        return;
      }
      path.style.strokeDashoffset = `${length * (1 - p)}`;
      const point = path.getPointAtLength(length * p);
      dot.setAttribute('cx', point.x.toFixed(1));
      dot.setAttribute('cy', point.y.toFixed(1));
    };

    const renderText = (elapsed) => {
      const p = Math.min(1, elapsed / DURATION);
      setText(time, format(DURATION - elapsed));
      const active = p < 0.36 ? 0 : p < 0.62 ? 1 : 2;
      if (active !== activePhase) {
        phases.forEach((li, i) => li.classList.toggle('is-active', running && i === active));
        activePhase = active;
      }

      let t = elapsed % CYCLE;
      for (const phase of BREATH) {
        if (t < phase.ms) {
          const name = labels[phase.key];
          setText(breathName, name);
          setText(breathCount, String(Math.ceil((phase.ms - t) / 1000)));
          break;
        }
        t -= phase.ms;
      }
    };

    const reset = () => {
      running = false;
      stopTimers();
      progress = 0;
      activePhase = -1;
      renderVisual(0);
      time.textContent = format(DURATION);
      breathName.textContent = labels.ready;
      breathCount.textContent = '';
      phases.forEach((li) => li.classList.remove('is-active'));
      startBtn.hidden = false;
      finishBtn.hidden = true;
      question.hidden = true;
      result.hidden = true;
    };

    const finish = () => {
      running = false;
      stopTimers();
      renderVisual(DURATION);
      renderText(DURATION);
      phases.forEach((li) => li.classList.remove('is-active'));
      breathName.textContent = labels.done;
      breathCount.textContent = '';
      finishBtn.hidden = true;
      question.hidden = false;
      live.textContent = questionTitle.textContent;
      questionTitle.focus();
    };

    const tickVisual = () => {
      if (!running || document.hidden || reduce.matches) return;
      const elapsed = performance.now() - start;
      renderVisual(elapsed);
      if (elapsed >= DURATION) finish();
      else frame = requestAnimationFrame(tickVisual);
    };

    const tickText = () => {
      if (!running || document.hidden) return;
      const elapsed = performance.now() - start;
      if (elapsed >= DURATION) finish();
      else renderText(elapsed);
    };

    const schedule = () => {
      stopTimers();
      const elapsed = running ? performance.now() - start : progress;
      renderVisual(Math.min(elapsed, DURATION));
      if (!running || document.hidden) return;
      if (elapsed >= DURATION) {
        finish();
        return;
      }
      renderText(elapsed);
      interval = setInterval(tickText, 1000);
      if (!reduce.matches) frame = requestAnimationFrame(tickVisual);
    };

    startBtn.addEventListener('click', () => {
      reset();
      running = true;
      start = performance.now();
      startBtn.hidden = true;
      finishBtn.hidden = false;
      live.textContent = labels.started;
      finishBtn.focus();
      schedule();
    });

    finishBtn.addEventListener('click', finish);

    tool.querySelectorAll('[data-wave-answer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const still = btn.dataset.waveAnswer === 'yes';
        resultTitle.textContent = still ? labels.stillTitle : labels.lessTitle;
        resultText.textContent = still ? labels.stillText : labels.lessText;
        question.hidden = true;
        result.hidden = false;
        live.textContent = `${resultTitle.textContent} ${resultText.textContent}`;
        resultTitle.focus();
      });
    });

    restartBtn.addEventListener('click', () => {
      reset();
      startBtn.focus();
    });

    reduce.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopTimers();
      else schedule();
    });

    reset();
  });
})();
