import {AppScreen} from "./base";

export class LoadingScreen extends AppScreen {
    constructor() {
        super("loading");
    }
    
    onPreShown(oldScreen: AppScreen): void {
        // @ts-ignore -> TS2488: Type 'HTMLCollectionOf<Element>' must have a '[Symbol.iterator]()' method that returns an iterator.
        for(const eLoadingText of this.element.getElementsByClassName("loading-text")) {
            (eLoadingText as HTMLElement).hidden = false;
        }
    }
}
