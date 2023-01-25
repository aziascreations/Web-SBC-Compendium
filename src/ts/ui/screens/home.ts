import {AppScreen} from "./base";
import {App} from "../../data/app";

export class HomeScreen extends AppScreen {
    constructor(parentApp: App) {
        super("home", parentApp);
    }
}
