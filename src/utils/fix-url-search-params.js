
try { if (new URLSearchParams({q:'+'}).get('+') !== '+' || new URLSearchParams('q=%2B').get('q') !== '+') throw {}; }
catch (error) {
  window.URLSearchParams = void 0;
}