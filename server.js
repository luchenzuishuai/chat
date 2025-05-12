const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.send('server.js');
});

// 添加调试日志
app.use((req, res, next) => {
  console.log('收到请求:', req.url);
  next()
});

io.on('connection', (socket) => {
  console.log('用户连接成功');
  
  // 用户加入
  socket.on('userJoin', (username) => {
    console.log('用户加入:', username);
    socket.username = username;
    io.emit('message', {
      user: 'System',
      text: `${username} 加入了聊天室`
    });
  });

  // 接收消息
  socket.on('chatMessage', (msg) => {
    console.log('收到消息:', msg);
    io.emit('message', {
      user: socket.username,
      text: msg
    });
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    console.log('用户断开连接');
    if(socket.username) {
      io.emit('message', {
        user: 'System',
        text: `${socket.username} 离开了聊天室`
      });
    }
  });
});

http.listen(3000, () => {
  console.log('服务器运行在端口 3000');
});
