// Quick script to save a placeholder or test image
const fs = require('fs');
const https = require('https');

// For testing, save a sample coffee maker image
const sampleImageUrl = 'https://m.media-amazon.com/images/I/71t9u3URJxL._AC_SL1500_.jpg';

https.get(sampleImageUrl, (res) => {
  const dest = fs.createWriteStream('assets/coffee-maker-sample.jpg');
  res.pipe(dest);
  dest.on('finish', () => {
    console.log('✅ Sample image downloaded to assets/coffee-maker-sample.jpg');
    console.log('   Update your product to use: /assets/coffee-maker-sample.jpg');
  });
}).on('error', (err) => {
  console.error('❌ Failed to download:', err.message);
});
