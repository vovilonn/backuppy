import { Scenes } from "telegraf";
import { SceneContext, SceneSessionData, WizardContext, WizardSessionData } from "telegraf/typings/scenes";

export interface IBackupMessage {
    type: "text" | "audio" | "video" | "photo" | "voice";
    content: any;
    from: {
        id: number;
        username: string;
    };
    timestamp: Date;
}

export interface IBackup {
    userId: number;
    targetChatId: number;
    messages: IBackupMessage[];
}

export interface ISceneBase {
    prev?: string;
}
export interface Context extends Scenes.SceneContext {}
export interface ISceneSessionData<T extends ISceneBase = ISceneBase> extends SceneSessionData {
    state: T;
}
export interface IWizzardSessionData<T extends ISceneBase = ISceneBase> extends WizardSessionData {
    state: T;
    cursor: any;
}
export type ISceneContext<T extends ISceneBase = ISceneBase> = Context & SceneContext<ISceneSessionData<T>>;
export type IWizardContext<T extends ISceneBase = ISceneBase> = Context & WizardContext<IWizzardSessionData<T>>;
