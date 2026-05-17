await new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = '/dist/tesseract.min.js';
  script.onload = resolve;
  script.onerror = () => reject(new Error('Failed to load /dist/tesseract.min.js'));
  document.head.appendChild(script);
});
