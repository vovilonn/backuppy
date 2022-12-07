import { Wizard, WizardStep } from "nestjs-telegraf";
import { Scenes } from "src/app.constants";
import { IWizardContext } from "src/app.types";

enum Steps {
    ENTER,
    ASK_NAME,
}

async function wizardNextStep(ctx: IWizardContext, call: boolean = true) {
    ctx.wizard.next();
    if (call) {
        const wizard = ctx.wizard as any;
        await wizard.steps[ctx.wizard.cursor](ctx);
    }
}

@Wizard(Scenes.INITIALIZE_BACKUP)
export class InitializeBackupWizard {
    @WizardStep(Steps.ENTER)
    async enter(ctx: IWizardContext) {
        ctx.reply("Hello");
        await wizardNextStep(ctx);
    }

    @WizardStep(Steps.ASK_NAME)
    askName(): string {
        console.log("step two");
        return "enter your name";
    }
}
