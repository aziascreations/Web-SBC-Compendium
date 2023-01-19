import {AppScreen} from "./base";

export class LoadingScreen extends AppScreen {
    constructor() {
        super("loading");
    }
    
    onPreShown(oldScreen: AppScreen): void {
        for(const eLoadingText of this.element.getElementsByClassName("loading-text")) {
            (eLoadingText as HTMLElement).hidden = false;
        }
    }
}
