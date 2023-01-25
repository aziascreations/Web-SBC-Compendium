import {AppScreen} from "./base";
import {App} from "../../data/app";

export class SearchScreen extends AppScreen {
    constructor(parentApp: App) {
        super("search", parentApp);
    }
}
