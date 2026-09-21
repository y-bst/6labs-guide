// Recorder timer: counts up while testers play, freezes when they stop.
(() => {
  const story = Guide.stories[0];
  const scenes = story.root.dataset.scenes.split(',');
  const time = document.getElementById('rec-time');
  let timer = null;
  story.root.addEventListener('beat', e => {
    const scene = scenes[e.detail.beat];
    clearInterval(timer);
    timer = null;
    if (scene === 'rec-close') {
      if (time.textContent === '0:00') time.textContent = '0:12';
      return;
    }
    if (scene !== 'rec-play') return;
    let s = 0;
    time.textContent = '0:00';
    timer = setInterval(() => {
      s++;
      time.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }, 1000);
  });
})();
