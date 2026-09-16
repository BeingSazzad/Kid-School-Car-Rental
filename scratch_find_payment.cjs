const fs = require('fs');
const files = ['app.js', 'index.html', 'mvp-driver.js', 'mvp-walkshare.js', 'auth-experience.js'];
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  content.split('\n').forEach((line, i) => {
    if (line.includes('paymentHandle') || line.includes('advancePaymentHandle') || line.includes('revokePaymentHandle')) {
      console.log(`${f}:${i+1}: ${line.trim()}`);
    }
  });
});
