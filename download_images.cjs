const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'assets', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = [
  { url: "https://bsyssolutions.com/wp-content/uploads/2022/08/IT-Consulting-Services.png", name: "sol-erp-icon.png" },
  { url: "https://bsyssolutions.com/wp-content/uploads/2022/08/Software-Development-Services-1.png", name: "hrmetrics-icon.png" },
  { url: "https://images.pexels.com/photos/7108815/pexels-photo-7108815.jpeg?auto=compress&cs=tinysrgb&w=1200", name: "hrmetrics-image.jpg" },
  { url: "https://bsyssolutions.com/wp-content/uploads/2022/08/Mobile-Apps-Development-Services.png", name: "goboat-icon.png" },
  { url: "https://bsyssolutions.com/wp-content/uploads/2022/08/POS-Software-Development-Services.png", name: "faricampus-icon.png" },
  { url: "https://bsyssolutions.com/wp-content/uploads/2022/08/Web-Development-Services.png", name: "chatbot-koya-icon.png" }
];

function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, targetPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(\`Failed to get '\${url}' (\${res.statusCode})\`));
        return;
      }
      const fileStream = fs.createWriteStream(targetPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(targetPath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const img of images) {
    const tgt = path.join(targetDir, img.name);
    console.log(`Downloading ${img.url} -> ${tgt}`);
    try {
      await downloadFile(img.url, tgt);
      console.log(`Downloaded ${img.name}`);
    } catch(e) {
      console.error(`Failed to download ${img.name}:`, e);
    }
  }
}

main();
