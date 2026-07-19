import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

registerMainMenuItem({ label: "🎬 Browse", data: "feed:latest", order: 10 });

const composer = new Composer<Ctx>();

const EMPTY_STATE =
  "🎬 Latest Videos\n\nBrowse our curated collection of videos.\n\nNo videos available yet — check back soon!";

composer.callbackQuery("feed:latest", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(EMPTY_STATE, {
    reply_markup: inlineKeyboard([
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
