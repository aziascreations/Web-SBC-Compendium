import {AppScreen} from "./base";
import {App} from "../../data/app";

export class LoadingScreen extends AppScreen {
    constructor(parentApp: App) {
        super("loading", parentApp);
    }
    
    onPreShown(oldScreen: AppScreen): void {
        // @ts-ignore -> TS2488: Type 'HTMLCollectionOf<Element>' must have a '[Symbol.iterator]()' method that returns an iterator.
        // Caused by the "tsconfig" requirements for Zod.
        for(const eLoadingText of this.screenElement.getElementsByClassName("loading-text")) {
            (eLoadingText as HTMLElement).hidden = false;
        }
    }
}
