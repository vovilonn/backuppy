import { InitializeBackupWizard } from "./scenes";
import * as LocalSession from "telegraf-session-local";
import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { AppUpdate } from "./app.update";
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, TG_TOKEN } from "./config";
import { MongooseModule } from "@nestjs/mongoose";
import { BackupsModule } from "./backups";

const sessions = new LocalSession({ database: "session_db.json" });

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/backuppy`),
        TelegrafModule.forRoot({
            token: TG_TOKEN,
            middlewares: [sessions.middleware()],
        }),
        BackupsModule,
    ],
    providers: [AppUpdate, InitializeBackupWizard],
})
export class AppModule {}
