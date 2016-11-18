export function getPanelPercent(e) {
  let windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  let offsetX = this.getWorkspaceNode().offsetLeft;
  let clientX = e.clientX || e.touches[0].clientX; // account for touch events

  return ((clientX - offsetX) / (windowWidth - offsetX)) * 100;
}

export function getWorkspaceNode() {
  return document.querySelector('.act-workspace__area--right');
}

export function escapeRegExp(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function flattenArray(a, b) {
  return a.concat(b);
}
