const mineflayer = require('mineflayer');
const express = require('express');

const SERVER_HOST = 'vanilaservak.aternos.me'; // твій IP
const SERVER_PORT = 40987;                     // твій порт
const BOT_NAME = 'lohopedra';                 // нікнейм бота

function createBot() {
  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_NAME,
    version: false, // автоматично визначає версію
  });

  // Коли бот приєднується
  bot.on('login', () => {
    console.log(`✅ Бот ${BOT_NAME} увійшов на сервер!`);
  });

  // Анти-AFK: бот буде стрибати
  bot.on('spawn', () => {
    setInterval(() => {
      if (bot.entity && bot.entity.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
    }, 6000); // кожні 6 секунд
  });

  // Якщо бот відключився — створюємо нового
  bot.on('end', () => {
    console.log('🔁 Бот вийшов. Перезапуск через 10 секунд...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ Помилка бота:', err);
  });
}

createBot(); // запускаємо бота

// -------------------------
// Ping-сервер для Render
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Бот запущений і працює!');
});

app.listen(PORT, () => {
  console.log(`🌐 HTTP-сервер запущено на порту ${PORT}`);
});
