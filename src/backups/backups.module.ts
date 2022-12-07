import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BackupsService } from "./backups.service";
import { Backup, BackupSchema } from "./schemas";

@Module({
    imports: [MongooseModule.forFeature([{ name: Backup.name, schema: BackupSchema }])],
    providers: [BackupsService],
    exports: [BackupsService],
})
export class BackupsModule {}
