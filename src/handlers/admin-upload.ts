import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

const UPLOAD_START =
  "📤 Upload Video\n\nSend me the video URL or file to upload.";

composer.command("admin_upload", async (ctx) => {
  ctx.session.step = "awaiting_upload_url";
  await ctx.reply(UPLOAD_START, {
    reply_markup: {
      force_reply: true,
      selective: false,
      input_field_placeholder: "Paste the video URL…",
    },
  });
});

composer.on("message:text", async (ctx, next) => {
  if (ctx.session.step !== "awaiting_upload_url") return next();

  const url = ctx.message.text.trim();
  if (!url.startsWith("http")) {
    await ctx.reply(
      "That doesn't look like a valid URL. Please send a video URL starting with http:// or https://",
    );
    return;
  }

  ctx.session.upload = { url };
  ctx.session.step = "awaiting_upload_title";
  await ctx.reply("What's the title for this video?", {
    reply_markup: {
      force_reply: true,
      selective: false,
      input_field_placeholder: "Enter video title…",
    },
  });
});

composer.on("message:text", async (ctx, next) => {
  if (ctx.session.step !== "awaiting_upload_title") return next();

  const title = ctx.message.text.trim();
  if (title.length < 2) {
    await ctx.reply("Title too short — try again.");
    return;
  }

  ctx.session.upload!.title = title;
  ctx.session.step = "awaiting_upload_visibility";
  await ctx.reply("Who can see this video?", {
    reply_markup: inlineKeyboard([
      [inlineButton("Free", "upload:visibility:free")],
      [inlineButton("Premium only", "upload:visibility:paid")],
    ]),
  });
});

composer.callbackQuery("upload:visibility:free", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.upload!.visibility = "free";
  ctx.session.step = "awaiting_upload_schedule";
  await ctx.editMessageText("When should this video be published?", {
    reply_markup: inlineKeyboard([
      [inlineButton("Publish now", "upload:schedule:now")],
      [inlineButton("Schedule for later", "upload:schedule:later")],
    ]),
  });
});

composer.callbackQuery("upload:visibility:paid", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.upload!.visibility = "paid";
  ctx.session.step = "awaiting_upload_schedule";
  await ctx.editMessageText("When should this video be published?", {
    reply_markup: inlineKeyboard([
      [inlineButton("Publish now", "upload:schedule:now")],
      [inlineButton("Schedule for later", "upload:schedule:later")],
    ]),
  });
});

composer.callbackQuery("upload:schedule:now", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.upload!.publishTime = "now";
  ctx.session.step = "idle";

  await ctx.editMessageText(
    `✅ Video uploaded successfully!\n\n` +
      `Title: ${ctx.session.upload!.title}\n` +
      `Visibility: ${ctx.session.upload!.visibility === "free" ? "Free" : "Premium"}\n` +
      `Published: Now`,
    {
      reply_markup: inlineKeyboard([
        [inlineButton("⬅️ Back to menu", "menu:main")],
      ]),
    },
  );

  ctx.session.upload = undefined;
});

composer.callbackQuery("upload:schedule:later", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "awaiting_upload_publish_time";
  await ctx.reply(
    "When should this video be published?\n\nSend a date and time (e.g. 2026-07-20 14:00):",
    {
      reply_markup: {
        force_reply: true,
        selective: false,
        input_field_placeholder: "YYYY-MM-DD HH:MM",
      },
    },
  );
});

composer.on("message:text", async (ctx, next) => {
  if (ctx.session.step !== "awaiting_upload_publish_time") return next();

  const timeStr = ctx.message.text.trim();
  if (!/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(timeStr)) {
    await ctx.reply(
      "Please use the format YYYY-MM-DD HH:MM (e.g. 2026-07-20 14:00)",
    );
    return;
  }

  ctx.session.upload!.publishTime = timeStr;
  ctx.session.step = "idle";

  await ctx.reply(
    `✅ Video scheduled!\n\n` +
      `Title: ${ctx.session.upload!.title}\n` +
      `Visibility: ${ctx.session.upload!.visibility === "free" ? "Free" : "Premium"}\n` +
      `Published: ${timeStr}`,
    {
      reply_markup: inlineKeyboard([
        [inlineButton("⬅️ Back to menu", "menu:main")],
      ]),
    },
  );

  ctx.session.upload = undefined;
});

export default composer;
