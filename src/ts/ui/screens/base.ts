import {App} from "../../data/app";

const screenDomIdPrefix = "screen-";

export abstract class AppScreen {
    id: string;
    screenElement: HTMLElement;
    
    // Reference to the "App" instance into which this screen is contained in order to easily access the "root" data
    //   without making functions with 20 different parameters.
    parentApp: App;
    
    protected constructor(id: string, parentApp: App) {
        this.id = id;
        this.parentApp = parentApp;
        
        const eCrashScreen: HTMLElement | null = document.getElementById(this.getHtmlId());
        if(eCrashScreen == null) {
            throw new ScreenInstantiationError("Failed to find the DOM element for '"+this.getHtmlId()+"' !");
        }
        this.screenElement = eCrashScreen;
    }
    
    getHtmlId(): string {
        return screenDomIdPrefix + this.id;
    };
    
    onPreHidden(newScreen: AppScreen): void {
        return;
    }
    
    onHidden(newScreen: AppScreen): void {
        return;
    }
    
    onPreShown(oldScreen: AppScreen): void {
        return;
    }
    
    onShown(oldScreen: AppScreen): void {
        return;
    }
}

export class ScreenInstantiationError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, ScreenInstantiationError.prototype);
    }
}
