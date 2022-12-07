import { IBackupMessage } from "src/app.types";

export class SaveMessageDto implements IBackupMessage {
    type: "text" | "audio" | "video" | "photo" | "voice";
    content: any;
    from: { id: number; username: string };
    chatId: number;
    timestamp: Date;
}
