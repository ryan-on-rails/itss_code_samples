// Simulate 'background-size: cover' in canvas
// source: http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
export function drawImageCover(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width;
      h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
      ih = img.height,
      r = Math.min(w / iw, h / ih),
      nw = iw * r,   // new prop. width
      nh = ih * r,   // new prop. height
      cx, cy, cw, ch, ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

// INSPIRED BY: https://github.com/jondavidjohn/hidpi-canvas-polyfill
export function getSharpCanvas(context, parentEl) {
   let backingStore, ratio;

  backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;

  // NOTE: Fix this ratio at 2; works for HiDPI and otherwise.
  // ratio = (window.devicePixelRatio || 1) / backingStore;
  ratio = 2;

  if (ratio > 1) {
    context.canvas.width = parentEl.clientWidth * ratio;
    context.canvas.height = parentEl.clientHeight * ratio;
    context.canvas.style.width = parentEl.clientWidth + 'px';
    context.canvas.style.height = parentEl.clientHeight + 'px';
  }
}
