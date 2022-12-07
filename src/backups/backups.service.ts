import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GetChatMessagesDto, InitializeBackupDto, SaveMessageDto } from "./dto";
import { BackupDocument, Backup } from "./schemas";

@Injectable()
export class BackupsService {
    constructor(@InjectModel(Backup.name) private backupModel: Model<BackupDocument>) {}

    public async initializeBackup({ targetChatId, userId, chatTitle }: InitializeBackupDto) {
        await this.backupModel.create({
            userId,
            targetChatId,
            chatTitle,
            messages: [],
        });
    }

    public async saveMessage({ type, content, chatId, from, timestamp }: SaveMessageDto) {
        await this.backupModel.findOneAndUpdate(
            { targetChatId: chatId },
            {
                $push: { messages: { type, content, timestamp, from } },
            }
        );
    }

    public async getChatMessages({ userId, chatTitle }: GetChatMessagesDto) {
        return await this.backupModel.findOne({ userId, chatTitle }).select({ messages: 1 });
    }

    // public async getUserBackups({ userId }: GetChatMessagesDto) {
    //     return await this.backupModel.find({ userId });
    // }
}
