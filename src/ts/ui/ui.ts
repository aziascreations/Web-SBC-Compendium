import {AppScreen} from './screens/base';
import {fadeIn, fadeOut} from "./animations";

const screenContainerId: string = "screen-container";
const crashScreenId: string = "screen-crash";
const commonScreenClass: string = "screen";

export const screenNavigatorClass: string = "nav-link";
export const screenNavigatorDataTarget: string = "target-screen";

const defaultTransitionTimeMs: number = 175;

// Should never be exported to prevent catching it without a broad clause since it is fatal !
class FatalInterfaceError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, FatalInterfaceError.prototype);
    }
}

// Loops over all the given screens and returns the first screen that is currently being shown to the user.
export function getCurrentScreen(screens: Array<AppScreen>): AppScreen | null {
    for(const screen of screens) {
        if(!screen.screenElement.hidden) {
            return screen;
        }
    }
    return null;
}

export function hideAllScreens(screens: Array<AppScreen>, doTransition: boolean = true): void {
    for(const screen of screens) {
        hideScreen(screen, doTransition).then(() => {});
    }
}

export async function hideScreen(screen: AppScreen, doTransition: boolean = true) {
    if(!doTransition) {
        screen.screenElement.hidden = true;
        return;
    }
    await fadeOut(screen.screenElement, defaultTransitionTimeMs);
}

export async function showScreen(screen: AppScreen, doTransition: boolean = true) {
    if(!doTransition) {
        screen.screenElement.hidden = false;
        return;
    }
    await fadeIn(screen.screenElement, defaultTransitionTimeMs);
}

// This function assumes that the given screen ID exists in the index.html file to some degree.
export async function changeScreen(screens: Array<AppScreen>, screenToShow: AppScreen) {
    const hiddenScreen: AppScreen | null = getCurrentScreen(screens);
    
    if(hiddenScreen !== null) {
        hiddenScreen.onPreHidden(screenToShow);
        await hideScreen(hiddenScreen);
        hiddenScreen.onHidden(screenToShow);
        screenToShow.onPreShown(hiddenScreen);
    }
    
    await showScreen(screenToShow);
    
    if(hiddenScreen !== null) {
        screenToShow.onShown(hiddenScreen);
    }
}

export function getScreenById(screens: Array<AppScreen>, id: string): AppScreen | null {
    for(let screen of screens) {
        if(screen.id == id) {
            return screen;
        }
    }
    return null;
}
