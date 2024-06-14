const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

// const token = "7258802100:AAHQ8w4C7Q2erItu9VKRRwEsdxlp00b0HC4"; // for production
const token = "7028220149:AAGw6GJmj7F9CXk3oohScQgDB3Y0crVOl0M"; // for test

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

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
  console.log(msg.web_app_data);
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

app.post("/web-data", async (req, res) => {
  const { queryId, products } = req.body;

  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Muvaffaqiyatli xarid qildingiz",
      input_message_content: {
        message_text: `Xaridingiz uchun tashakkur, siz jami${products
          .reduce((a, c) => a + c.price * c.quantity, 0)
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })} shuncha summadagi kurslarni sotib oldingiz. ${products
          .map((c) => `${c.title} ${c.quantity}x`)
          .join(", ")}`,
      },
    });
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({});
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running");
});
