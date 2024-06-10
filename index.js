const TelegramBot = require("node-telegram-bot-api");
const token = "7356982966:AAFDedgzE5MsKCyQesxQVCF49WQWfXxrC4g";

const bot = new TelegramBot(token, { polling: true });

const bootstrap = () => {
  bot.setMyCommands([
    { command: "/start", description: "Botni ishga tushirish" },
    { command: "/courses", description: "Kurslar ro'yhatini ko'rish" },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        `Assalomu Alaykum sizni ko'rib turganimizdan hursandmiz janob ${msg.chat.first_name}, biz sizga sifatli kurslarni tavsiya qilamiz`,
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Kurslarni ko'rish",
                  web_app: {
                    url: "https://web-bot-client.vercel.app",
                  },
                },
              ],
            ],
          },
        }
      );
    }

    if (text === "/courses") {
      await bot.sendMessage(
        chatId,
        "Platformada mavjud kurslarni sotib olishingiz mumkin",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Kurslarni ko'rish",
                  web_app: {
                    url: "https://web-bot-client.vercel.app",
                  },
                },
              ],
            ],
          },
        }
      );
    }

    if (msg.web_app_data?.data) {
      try {
        const data = JSON.parse(msg.web_app_data?.data);

        await bot.sendMessage(chatId, "Sotib olingan kurslar: ");

        for (const item of data) {
          await bot.sendPhoto(chatId, item.Image, {
            caption: `*Kurs nomi:* ${item.title}\n*Kurs soni:* ${item.quantity}x\n*Kurs narxi:* \$${item.price}`,
            parse_mode: "Markdown",
          });
        }

        await bot.sendMessage(
          chatId,
          `*💲Umumiy narx: *  ${data
            .reduce((a, c) => a + c.price * c.quantity, 0)
            .toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}`,
          { parse_mode: "Markdown" }
        );
      } catch (error) {
        console.log(error);
      }
    }
  });
};

bootstrap();
