import { IBackup } from "./../../app.types";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IBackupMessage } from "src/app.types";

export type BackupDocument = HydratedDocument<Backup>;

@Schema()
export class Backup implements IBackup {
    @Prop({ required: true })
    userId: number;

    @Prop({ required: true, unique: true })
    targetChatId: number;

    @Prop({ required: true })
    chatTitle: string;

    @Prop({ required: true })
    messages: IBackupMessage[];
}

export const BackupSchema = SchemaFactory.createForClass(Backup);
