const mineflayer = require('mineflayer');
const express = require('express');

const SERVER_HOST = 'vanilaservak.aternos.me'; // IP
const SERVER_PORT = 40987; // Заміни на актуальний порт Aternos
const BOT_NAME = 'lohopedra';

function createBot() {
  console.log('⏳ Підключення бота...');

  const bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_NAME,
    version: false,
  });

  bot.on('login', () => {
    console.log(`✅ Бот ${BOT_NAME} увійшов на сервер`);
  });

  bot.on('spawn', () => {
    console.log('🟢 Бот заспавнився. Стрибає кожні 6 сек.');
    setInterval(() => {
      if (bot.entity?.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }
    }, 6000);
  });

  bot.on('kicked', (reason) => {
    console.log('❌ Бота кікнули:', reason);
    restartWithDelay();
  });

  bot.on('end', () => {
    console.log('⚠️ З’єднання закрито. Перезапуск...');
    restartWithDelay();
  });

  bot.on('error', (err) => {
    console.log('❌ Помилка бота:', err.message || err);
    if (err.code === 'ECONNRESET') {
      console.log('🔁 Сервер скинув з’єднання. Чекаємо 60 сек...');
    }
    restartWithDelay();
  });
}

function restartWithDelay() {
  setTimeout(() => {
    createBot();
  }, 60000); // 60 секунд паузи перед новим з’єднанням
}

createBot();

// Необов'язковий Express-сервер для Render
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('✅ Бот активний'));
app.listen(PORT, () => console.log(`🌐 HTTP сервер на порту ${PORT}`));

// Пінгати себе кожні 5 хвилин (тільки якщо Render Web Service)
setInterval(() => {
  require('https').get('https://aternos-keepalive.onrender.com');
  console.log('🔁 Пінг Render (keep-alive)');
}, 5 * 60 * 1000);
