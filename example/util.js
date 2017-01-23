function startTimer(node) {
  const STEP = 1000;
  let current = 0;

  setInterval(() => {
    current += STEP;
    node.innerHTML = current;
  }, STEP);
}

function addIFrame(doc, { src, width = '100%', height = '300px' }) {
  const item = doc.createElement('iframe');

  item.src = src;
  item.width = width;
  item.height = height;

  doc.body.appendChild(item);
}

function callDelayed(callback) {
  setTimeout(() => callback(), Math.random() * 1000 + 1);
}
