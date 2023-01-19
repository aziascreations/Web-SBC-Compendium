export const registeredScreens: Array<AppScreen> = [];

const screenDomIdPrefix = "screen-";

export abstract class AppScreen {
    id: string;
    element: HTMLElement;
    
    protected constructor(id: string) {
        this.id = id;
        
        const eCrashScreen: HTMLElement | null = document.getElementById(this.getHtmlId());
        if(eCrashScreen == null) {
            throw new ScreenInstantiationError("Failed to find the DOM element for '"+this.getHtmlId()+"' !");
        }
        this.element = eCrashScreen;
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

export function getScreenById(id: string): AppScreen | null {
    for(let screen of registeredScreens) {
        if(screen.id == id) {
            return screen;
        }
    }
    return null;
}

export function registerScreen(screen: AppScreen): boolean {
    if(getScreenById(screen.id) == null) {
        registeredScreens.push(screen);
        return true;
    }
    return false;
}
