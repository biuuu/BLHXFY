// 1. 引入所有需要的原生模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // 用于执行命令行

// --- 配置区 ---
const PORT = 15945; // 服务器监听的端口
const PUBLIC_DIR = './dist/'; // 静态文件所在的根目录
const URL_TO_OPEN = `http://127.0.0.1:${PORT}/blhxfy/extension.user.js`; // 启动后要打开的URL

// 2. 创建一个 MIME 类型映射表，用于设置正确的 Content-Type
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.csv': 'text/plain',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// 3. 创建 HTTP 服务器
const server = http.createServer((request, response) => {
  console.log(`收到请求: ${request.method} ${request.url}`);

  // 设置 CORS 跨域头，允许所有来源访问
  response.setHeader('Access-Control-Allow-Origin', '*');

  // 4. 构建安全的文件路径
  // 解析请求的路径，例如从 "/blhxfy/script.js?v=1" 变为 "/blhxfy/script.js"
  const requestedUrl = new URL(request.url, `http://${request.headers.host}`);
  let filePath = path.join(process.cwd(), PUBLIC_DIR, requestedUrl.pathname);

  // 防止目录遍历攻击，确保最终路径仍在 public 目录下
  const publicDirResolved = path.resolve(process.cwd(), PUBLIC_DIR);
  const filePathResolved = path.resolve(filePath);
  if (!filePathResolved.startsWith(publicDirResolved)) {
      response.writeHead(403, { 'Content-Type': 'text/plain' });
      response.end('403 Forbidden: Access denied.');
      return;
  }

  // 如果请求的是根目录，默认提供 index.html
  if (requestedUrl.pathname === '/') {
    filePath = path.join(filePath, 'index.html');
  }

  // 5. 检查文件是否存在并提供服务
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // 如果文件不存在 (ENOENT) 或其他错误
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('404 Not Found');
      return;
    }

    if (stats.isDirectory()) {
      // 如果是个目录，可以进一步处理（比如返回目录列表或默认文件），这里我们同样返回404
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('404 Not Found: This is a directory, not a file.');
      return;
    }

    // 6. 根据文件扩展名设置 MIME 类型
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream'; // 默认使用通用的二进制流类型

    // 7. 读取文件并发送响应
    response.writeHead(200, { 'Content-Type': contentType });

    // 使用 stream.pipe() 的方式发送文件内容，性能更好
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(response);
  });
});

// 8. 启动服务器并自动打开浏览器
server.listen(PORT, () => {
  console.log(`本地服务器已启动: http://127.0.0.1:${PORT}`);

  // 根据不同的操作系统执行不同的打开命令
  let command;
  switch (process.platform) {
    case 'darwin': // macOS
      command = `open "${URL_TO_OPEN}"`;
      break;
    case 'win32': // Windows
      command = `start "" "${URL_TO_OPEN}"`; // start 命令的奇怪语法
      break;
    default: // Linux, etc.
      command = `xdg-open "${URL_TO_OPEN}"`;
      break;
  }

  // 执行命令
  exec(command, (err) => {
    if (err) {
      console.error(`自动打开浏览器失败: ${err.message}`);
      console.log(`请手动访问: ${URL_TO_OPEN}`);
    } else {
      console.log(`已在浏览器中打开: ${URL_TO_OPEN}`);
    }
  });
});