const fs = require('fs');
const js = fs.readFileSync('app.js', 'utf8');
const lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes('renderBookingDetails') || l.includes('detailStatusBadge') || l.includes('detailPassengersWrap')) {
    console.log(`app.js:${i+1}: ${l.trim()}`);
  }
});
