import {AppScreen, getScreenById, registeredScreens, registerScreen} from './screens/base';
import {LoadingScreen} from "./screens/loading";
import {HomeScreen} from "./screens/home";
import {CrashScreen} from "./screens/crash";
import {BrowseScreen} from "./screens/browse";
import {SearchScreen} from "./screens/search";
import {fadeIn, fadeOut} from "./animations";

const screenContainerId: string = "screen-container";
const crashScreenId: string = "screen-crash";
const commonScreenClass: string = "screen";

const screenNavigatorClass: string = "nav-link";
const screenNavigatorDataTarget: string = "target-screen";

const defaultTransitionTimeMs: number = 175;

export const loadingScreen: LoadingScreen = new LoadingScreen();
export const homeScreen: HomeScreen = new HomeScreen();
export const crashScreen: CrashScreen = new CrashScreen();
export const browseScreen: BrowseScreen = new BrowseScreen();
export const searchScreen: SearchScreen = new SearchScreen();

// Should never be exported to prevent catching it without a broad clause since it is fatal !
class FatalInterfaceError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, FatalInterfaceError.prototype);
    }
}

export function registerAllScreens(): boolean {
    registerScreen(loadingScreen);
    registerScreen(homeScreen);
    registerScreen(crashScreen);
    registerScreen(browseScreen);
    registerScreen(searchScreen);
    return false;
}

export function getCurrentScreen(): AppScreen | null {
    for(const screen of registeredScreens) {
        if(!screen.element.hidden) {
            return screen;
        }
    }
    return null;
}

export async function hideScreen(screen: AppScreen, doTransition: boolean = true) {
    if(!doTransition) {
        screen.element.hidden = true;
        return;
    }
    await fadeOut(screen.element, defaultTransitionTimeMs);
}

export async function showScreen(screen: AppScreen, doTransition: boolean = true) {
    if(!doTransition) {
        screen.element.hidden = false;
        return;
    }
    await fadeIn(screen.element, defaultTransitionTimeMs);
}

export function hideAllScreens(doTransition: boolean = true): void {
    for(const screen of registeredScreens) {
        hideScreen(screen, false).then(() => {});
    }
}

// This function assumes that the given screen ID exists in the index.html file to some degree.
export async function changeScreen(screenToShow: AppScreen) {
    const hiddenScreen: AppScreen | null = getCurrentScreen();
    
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

export function showCrashMessage(message: string) {
    hideAllScreens();
    
    showScreen(crashScreen, false).then(() => {});
    // TODO: Set message !
}

export function registerScreenNavigatorElements(): void {
    const potentialTargetingElements: HTMLCollectionOf<Element> = document.getElementsByClassName(screenNavigatorClass);
    
    for(const targetingElement of potentialTargetingElements) {
        const targetScreenId: string | null = targetingElement.getAttribute("data-"+screenNavigatorDataTarget);
        
        if(targetScreenId == null) {
            console.warn("Used a link with the '" + screenNavigatorClass + "' class but no '" + screenNavigatorDataTarget + "' class !");
            console.warn(targetingElement);
            continue;
        }
        
        const targetScreen: AppScreen | null = getScreenById(targetScreenId);
    
        if(targetScreen == null) {
            console.warn("Unable to find the screen with the '" + targetScreenId + "' ID !");
            continue;
        }
        
        (targetingElement as HTMLElement).onclick = (e) => {
            if(!changeScreen(targetScreen)) {
                showCrashMessage("Failed to switch to the '"+targetScreen.getHtmlId()+"' screen !")
            }
        }
    }
}
