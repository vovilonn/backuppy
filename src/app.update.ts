import { reverse, sortedIndex, sortedIndexBy } from "lodash";
import { Command, InjectBot, On, Start, Update } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { Context } from "./app.types";
import { BackupsService } from "./backups";

@Update()
export class AppUpdate {
    constructor(
        @InjectBot() private readonly bot: Telegraf<Context>,
        private readonly backupsService: BackupsService
    ) {}

    @Start()
    async startCommand(ctx: Context) {
        await ctx.reply(
            'Добавь этого бота в чаты и сделай админом\nЭкспортируй историю с помощью команды "/export название чата"'
        );
    }

    @Command("export")
    async export(ctx: Context, next) {
        if (!("text" in ctx.message)) return next();
        const chatTitle = ctx.message.text.split("/export")[1].trim();

        const backup = await this.backupsService.getChatMessages({
            chatTitle: chatTitle,
            userId: ctx.message.from.id,
        });
        if (!backup) {
            return await ctx.reply("бекап не найден");
        }
        if (!backup.messages.length) {
            return await ctx.reply("В чате пока нет сообщений");
        }

        const messages = backup.messages.sort((i, j) => {
            if (i.timestamp > j.timestamp) {
                return 1;
            }
            if (i.timestamp < j.timestamp) {
                return -1;
            }
            return 0;
        });

        for (const { from, type, content, timestamp } of messages) {
            const preMessage = `@${from.username} <code>${from.id}</code> ${new Date(timestamp).toLocaleString()}\n\n`;
            if (type === "text") {
                await ctx.reply(preMessage + content, { parse_mode: "HTML" });
            }
            if (type === "voice") {
                await ctx.replyWithVoice(content, {
                    caption: preMessage,
                    parse_mode: "HTML",
                });
            }
            if (type === "video") {
                await ctx.replyWithVideo(content, {
                    caption: preMessage,
                    parse_mode: "HTML",
                });
            }
            if (type === "audio") {
                await ctx.replyWithAudio(content, {
                    caption: preMessage,
                    parse_mode: "HTML",
                });
            }
            if (type === "photo") {
                await ctx.replyWithPhoto(content, {
                    caption: preMessage,
                    parse_mode: "HTML",
                });
            }
        }
    }

    @On("audio")
    async onAudio(ctx: Context, next) {
        if (!("audio" in ctx.message)) return next();
        const { id, username } = ctx.message.from;
        try {
            await this.backupsService.saveMessage({
                chatId: ctx.message.chat.id,
                type: "audio",
                content: ctx.message.audio.file_id,
                from: {
                    id,
                    username,
                },
                timestamp: new Date(),
            });
        } catch (err) {
            console.log(err);
        }
    }

    @On("voice")
    async onVoice(ctx: Context, next) {
        if (!("voice" in ctx.message)) return next();
        const { id, username } = ctx.message.from;
        try {
            await this.backupsService.saveMessage({
                chatId: ctx.message.chat.id,
                type: "voice",
                content: ctx.message.voice.file_id,
                from: {
                    id,
                    username,
                },
                timestamp: new Date(),
            });
        } catch (err) {
            console.log(err);
        }
    }

    @On("text")
    async onText(ctx: Context, next) {
        if (!("text" in ctx.message)) return next();
        const { id, username } = ctx.message.from;
        try {
            await this.backupsService.saveMessage({
                chatId: ctx.message.chat.id,
                type: "text",
                content: ctx.message.text,
                from: {
                    id,
                    username,
                },
                timestamp: new Date(),
            });
        } catch (err) {
            console.log(err);
        }
    }

    @On("photo")
    async onPhoto(ctx: Context, next) {
        if (!("photo" in ctx.message)) return next();
        const { id, username } = ctx.message.from;
        try {
            await this.backupsService.saveMessage({
                chatId: ctx.message.chat.id,
                type: "photo",
                content: ctx.message.photo[0].file_id,
                from: {
                    id,
                    username,
                },
                timestamp: new Date(),
            });
        } catch (err) {
            console.log(err);
        }
    }

    @On("video")
    async onVideo(ctx: Context, next) {
        if (!("video" in ctx.message)) return next();
        const { id, username } = ctx.message.from;
        try {
            await this.backupsService.saveMessage({
                chatId: ctx.message.chat.id,
                type: "video",
                content: ctx.message.video.file_id,
                from: {
                    id,
                    username,
                },
                timestamp: new Date(),
            });
        } catch (err) {
            console.log(err);
        }
    }

    @On("my_chat_member")
    async onChatMember(ctx: Context, next) {
        // ctx.botInfo.can_read_all_group_messages;
        if (!("my_chat_member" in ctx.update)) return next();
        if (!("title" in ctx.update.my_chat_member.chat)) return next();

        const chatTitle = ctx.update.my_chat_member.chat.title;
        const userId = ctx.update.my_chat_member.from.id;
        const targetChatId = ctx.update.my_chat_member.chat.id;

        try {
            await this.backupsService.initializeBackup({
                targetChatId,
                userId,
                chatTitle,
            });
            await ctx.telegram.sendMessage(userId, `Чат ${chatTitle} успешно добавлен`);
        } catch (err) {
            console.log(err);
        }
    }
}
