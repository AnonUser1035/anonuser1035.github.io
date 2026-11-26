// @ts-check
/*
 * Dev build only: a panel for switching each easter egg on and off, so they
 * can be tried and picked. Choices persist in this browser. Never shipped.
 */
(() => {
  const root = document.documentElement;
  const KEY = 'fidgets';
  /** @type {Array<[name: string, title: string, how: string]>} */
  const EGGS = [
    ['ping', 'Ping', 'Click or tap a beat.'],
    ['retrace', 'Retrace', 'Click or tap a beat.'],
    ['gain', 'Gain switch', 'Click the calibration pulse at the far left.'],
    ['calipers', 'Calipers', 'Drag across beats with a mouse.'],
    ['rhythm', 'Pen in rhythm', 'Watch the pen dot once it stops.'],
    ['ink', 'Signature re-ink', 'Click “Ryan”.'],
    ['years', 'Year steps', 'Click a year under the strip, then again.'],
  ];

  /** @param {string[]} names */
  const apply = (names) => {
    root.dataset.fidgets = names.join(' ');
    try {
      localStorage.setItem(KEY, root.dataset.fidgets);
    } catch {}
    document.dispatchEvent(new Event('fidgets'));
  };
  try {
    const saved = localStorage.getItem(KEY);
    if (saved !== null) root.dataset.fidgets = saved;
  } catch {}
  const enabled = () => (root.dataset.fidgets ?? '').split(' ').filter(Boolean);

  const panel = document.createElement('details');
  panel.className = 'fidget-panel';
  panel.open = matchMedia('(min-width: 760px)').matches;

  const summary = document.createElement('summary');
  summary.textContent = 'Easter eggs';
  const note = document.createElement('p');
  note.className = 'fidget-note';
  note.textContent =
    'Dev build only. Switch them on and off, then keep the ones you like.';

  /**
   * @param {string} type
   * @param {string} name
   * @param {string} value
   * @param {boolean} checked
   * @param {string} title
   * @param {string} how
   */
  const option = (type, name, value, checked, title, how) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.value = value;
    input.checked = checked;
    const text = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = title;
    text.append(strong, how ? ` ${how}` : '');
    label.append(input, text);
    return label;
  };

  const now = enabled();
  const reprint = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent =
    'Reprint: click the blinking pen dot (or any beat, with Ping and Retrace off).';
  const style = now.includes('tearoff')
    ? 'tearoff'
    : now.includes('reprint')
      ? 'reprint'
      : '';
  reprint.append(
    legend,
    option('radio', 'reprint', '', style === '', 'Off', ''),
    option('radio', 'reprint', 'reprint', style === 'reprint', 'Plain', ''),
    option('radio', 'reprint', 'tearoff', style === 'tearoff', 'Tear-off', ''),
  );
  const list = document.createElement('div');
  for (const [name, title, how] of EGGS) {
    list.append(option('checkbox', name, name, now.includes(name), title, how));
  }

  panel.addEventListener('change', () => {
    const picked = [...panel.querySelectorAll('input:checked')]
      .map((input) => /** @type {HTMLInputElement} */ (input).value)
      .filter(Boolean);
    apply(picked);
  });

  panel.append(summary, note, reprint, list);
  document.body.append(panel);
})();
