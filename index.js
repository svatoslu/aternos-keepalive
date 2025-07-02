const mineflayer = require('mineflayer');
const express = require('express');

const SERVER_HOST = 'vanilaservak.aternos.me'; // IP сервера
const SERVER_PORT = 40987;                     // динамічний порт Aternos
const BOT_NAME = 'lohopedra2';                  // Нікнейм бота

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_NAME,
    version: false, // авто-версія клієнта
  });

  bot.on('login', () => {
    console.log(`✅ Бот ${BOT_NAME} підключився до сервера!`);
  });

  // Anti-AFK: бот стрибає кожні 6 секунд
  bot.on('spawn', () => {
    setInterval(() => {
      if (bot.entity?.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
    }, 6000);
  });

  // Автоматичний перезапуск, якщо бот відключається
  bot.on('end', () => {
    console.log('🔁 Бот відключений. Перезапуск через 10 сек...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', err => {
    console.log('❌ Помилка:', err);
  });
}

createBot(); // Старт бота

// ===============================
// 🌐 HTTP-сервер для Render
// ===============================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Бот активний');
});

app.listen(PORT, () => {
  console.log(`🌐 HTTP-сервер запущено на порту ${PORT}`);
});

// 🔁 Самопінг, щоб Render не засинав
setInterval(() => {
  require('https').get('https://aternos-keepalive.onrender.com');
  console.log('🔁 Ping sent to keep Render awake');
}, 5 * 60 * 1000);
