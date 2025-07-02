const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'vanilaservak.aternos.me',
    port: 40987,
    username: 'lohopedra',
    version: false,
  });

  bot.on('login', () => {
    console.log('✅ Бот увійшов на сервер!');

    // Почати стрибати кожні 3 секунди
    setInterval(() => {
      if (bot.entity && bot.entity.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => {
          bot.setControlState('jump', false);
        }, 500); // тримає кнопку jump натиснутою 0.5 сек
      }
    }, 3000);
  });

  bot.on('end', () => {
    console.log('🔁 Бот вийшов. Перезапуск через 10 сек...');
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('❌ Помилка:', err);
  });
}

createBot();
