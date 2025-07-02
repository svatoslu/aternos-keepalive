const mineflayer = require('mineflayer');
const express = require('express');

const SERVER_HOST = 'vanilaservak.aternos.me'; // IP сервера
const SERVER_PORT = 40987;                     // динамічний порт Aternos
const BOT_NAME = 'lohopedra';                  // Нік бота

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_NAME,
    version: false,
  });

  bot.on('login', () => {
    console.log(`✅ Бот ${BOT_NAME} увійшов на сервер`);
  });

  // Anti-AFK — стрибає кожні 6 секунд
  bot.on('spawn', () => {
    setInterval(() => {
      if (bot.entity?.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
    }, 6000);
  });

  // Коли бот кікнутий — вивести причину
  bot.on('kicked', (reason) => {
    console.log('❌ Бота кікнули:', reason);
  });

  // Якщо бот просто вийшов — перезапуск
  bot.on('end', () => {
    console.log('⚠️ Бот вийшов. Перезапуск через 10 сек...');
    setTimeout(createBot, 10000);
  });

  // Якщо бот вилетів з помилкою — перезапуск
  bot.on('error', (err) => {
    console.log('❌ Помилка бота:', err);
    console.log('🔁 Перезапуск через 10 сек...');
    setTimeout(createBot, 10000);
  });
}

createBot(); // Старт бота

// 🌐 HTTP-сервер для Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Бот активний!');
});

app.listen(PORT, () => {
  console.log(`🌐 HTTP-сервер слухає на порту ${PORT}`);
});

// 🔁 Самопінг кожні 5 хвилин (щоб Render не вимикав)
setInterval(() => {
  require('https').get('https://aternos-keepalive.onrender.com');
  console.log('🔁 Пінг до Render (keep-alive)');
}, 5 * 60 * 1000);
