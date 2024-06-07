const TelegramBot = require("node-telegram-bot-api");
const token = "7356982966:AAFDedgzE5MsKCyQesxQVCF49WQWfXxrC4g";

const bot = new TelegramBot(token, { polling: true });

const bootstrap = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        "Platformada mavjud kurslarni sotib olishingiz mumkin"
      );
    }
  });
};

bootstrap();
