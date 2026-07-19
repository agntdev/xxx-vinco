import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const HELP =
  "ℹ️ How to use VINCO\n\n" +
  "• Tap Browse Videos to see the latest content\n" +
  "• Tap My Subscription to check your plan\n" +
  "• Free videos are available to everyone\n" +
  "• Premium content requires a subscription\n\n" +
  "Need more help? Reply to this message.";

composer.callbackQuery("support:help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(HELP, {
    reply_markup: inlineKeyboard([
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
