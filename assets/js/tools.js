// Araçlar: breathing pacer and the personal crisis plan (stored only in this browser).
(() => {
  // ---------------------------------------------------------- breathing
  const breath = document.querySelector('[data-breath]');
  if (breath) {
    const fill = breath.querySelector('[data-breath-fill]');
    const phaseEl = breath.querySelector('[data-breath-phase]');
    const countEl = breath.querySelector('[data-breath-count]');
    const metaEl = breath.querySelector('[data-breath-meta]');
    const toggle = breath.querySelector('[data-breath-toggle]');
    const radios = [...breath.querySelectorAll('input[name="teknik"]')];
    const labels = JSON.parse(breath.dataset.labels || '{}');
    const SMALL = 0.45;
    let timer = 0;
    let running = false;
    let cycle = 0;

    const technique = () => {
      const r = radios.find((x) => x.checked) || radios[0];
      return {
        inhale: Number(r.dataset.inhale),
        hold: Number(r.dataset.hold),
        exhale: Number(r.dataset.exhale),
      };
    };

    const setScale = (scale, seconds) => {
      fill.style.transitionDuration = `${seconds}s`;
      fill.style.transform = `scale(${scale})`;
    };

    const stop = () => {
      running = false;
      clearTimeout(timer);
      setScale(SMALL, 0.6);
      phaseEl.textContent = '';
      countEl.textContent = '';
      metaEl.textContent = labels.ready;
      toggle.textContent = labels.start;
      toggle.setAttribute('aria-pressed', 'false');
    };

    const runPhase = (steps, index) => {
      if (!running) return;
      if (index >= steps.length) {
        cycle += 1;
        metaEl.textContent = labels.cycle.replace('{n}', cycle + 1);
        runPhase(steps, 0);
        return;
      }
      const step = steps[index];
      phaseEl.textContent = labels[step.key];
      if (step.key === 'inhale') setScale(1, step.seconds);
      if (step.key === 'exhale') setScale(SMALL, step.seconds);
      let left = step.seconds;
      countEl.textContent = String(left);
      const second = () => {
        if (!running) return;
        left -= 1;
        if (left > 0) {
          countEl.textContent = String(left);
          timer = setTimeout(second, 1000);
        } else {
          runPhase(steps, index + 1);
        }
      };
      timer = setTimeout(second, 1000);
    };

    const start = () => {
      const t = technique();
      const steps = [{ key: 'inhale', seconds: t.inhale }];
      if (t.hold > 0) steps.push({ key: 'hold', seconds: t.hold });
      steps.push({ key: 'exhale', seconds: t.exhale });
      running = true;
      cycle = 0;
      metaEl.textContent = labels.cycle.replace('{n}', 1);
      toggle.textContent = labels.stop;
      toggle.setAttribute('aria-pressed', 'true');
      runPhase(steps, 0);
    };

    toggle.addEventListener('click', () => {
      if (running) stop();
      else start();
    });
    radios.forEach((r) => r.addEventListener('change', () => {
      if (running) {
        clearTimeout(timer);
        start();
      }
    }));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && running) stop();
    });
    stop();
  }

  // ------------------------------------------------------- crisis plan
  const plan = document.querySelector('[data-plan]');
  if (plan) {
    const KEY = 'sigarasavar.crisisPlan.v1';
    const fields = [...plan.querySelectorAll('textarea')];
    const status = plan.querySelector('[data-plan-status]');
    const printBtn = plan.querySelector('[data-plan-print]');
    const clearBtn = plan.querySelector('[data-plan-clear]');
    let timer = 0;
    let armed = 0;

    const read = () => {
      try {
        return JSON.parse(localStorage.getItem(KEY) || '{}');
      } catch {
        return {};
      }
    };
    const save = () => {
      const data = Object.fromEntries(fields.map((f) => [f.name, f.value]));
      try {
        if (fields.some((f) => f.value.trim())) localStorage.setItem(KEY, JSON.stringify(data));
        else localStorage.removeItem(KEY);
        status.textContent = plan.dataset.saved;
      } catch {
        status.textContent = '';
      }
    };

    const saved = read();
    fields.forEach((f) => {
      if (typeof saved[f.name] === 'string') f.value = saved[f.name];
      f.addEventListener('input', () => {
        status.textContent = '';
        clearTimeout(timer);
        timer = setTimeout(save, 400);
      });
    });
    // Leaving mid-sentence must not lose the last keystrokes.
    window.addEventListener('pagehide', () => {
      if (timer) {
        clearTimeout(timer);
        save();
      }
    });

    printBtn.addEventListener('click', () => {
      document.documentElement.classList.add('print-plan-only');
      window.print();
    });
    window.addEventListener('afterprint', () => document.documentElement.classList.remove('print-plan-only'));

    clearBtn.addEventListener('click', () => {
      if (!armed) {
        clearBtn.textContent = plan.dataset.confirm;
        armed = setTimeout(() => {
          armed = 0;
          clearBtn.textContent = plan.dataset.clear;
        }, 4000);
        return;
      }
      clearTimeout(armed);
      armed = 0;
      clearBtn.textContent = plan.dataset.clear;
      fields.forEach((f) => { f.value = ''; });
      try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
      status.textContent = '';
      fields[0].focus();
    });
  }
})();
