const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="screen-bookingDetails"')) {
    console.log('Found screen-bookingDetails on line:', i + 1);
  }
});
