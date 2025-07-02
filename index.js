const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'vanilaservak.aternos.me',
    port: 25565,
    username: 'lohopedra',
    version: false,
  });

  bot.on('login', () => {
    console.log('✅ Бот увійшов на сервер!');
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