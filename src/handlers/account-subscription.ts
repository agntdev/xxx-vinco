import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import {
  registerMainMenuItem,
  inlineButton,
  inlineKeyboard,
} from "../toolkit/index.js";

registerMainMenuItem({
  label: "⭐ My Subscription",
  data: "account:subscription",
  order: 20,
});

const composer = new Composer<Ctx>();

const SUBSCRIPTION_TEXT =
  "⭐ Subscription Status\n\n" +
  "You're on the Free plan.\n\n" +
  "Free plan includes:\n" +
  "• Access to free videos\n" +
  "• Basic features\n\n" +
  "Upgrade to Premium for full access!";

const UPGRADE_TEXT =
  "⭐ Premium Plan\n\n" +
  "Unlock all content with Premium:\n" +
  "• All premium videos\n" +
  "• Early access to new releases\n" +
  "• Ad-free experience\n\n" +
  "Choose a plan:";

composer.callbackQuery("account:subscription", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(SUBSCRIPTION_TEXT, {
    reply_markup: inlineKeyboard([
      [inlineButton("Upgrade to Premium", "subscription:upgrade")],
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

composer.callbackQuery("subscription:upgrade", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(UPGRADE_TEXT, {
    reply_markup: inlineKeyboard([
      [inlineButton("$4.99/month", "pay:monthly")],
      [inlineButton("$49.99/year (save 17%)", "pay:yearly")],
      [inlineButton("⬅️ Back", "account:subscription")],
    ]),
  });
});

export default composer;
