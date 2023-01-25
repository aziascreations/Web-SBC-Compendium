import {AppScreen} from "./base";
import {App} from "../../data/app";

export class CrashScreen extends AppScreen {
    constructor(parentApp: App) {
        super("crash", parentApp);
    }
}
