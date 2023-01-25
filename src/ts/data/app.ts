import {LoadingScreen} from "../ui/screens/loading";
import {HomeScreen} from "../ui/screens/home";
import {CrashScreen} from "../ui/screens/crash";
import {BrowseScreen} from "../ui/screens/browse";
import {SearchScreen} from "../ui/screens/search";
import {CompareScreen} from "../ui/screens/compare";
import {rootType} from "./types";
import {AppScreen} from "../ui/screens/base";
import {getCurrentScreen, changeScreen, getScreenById, screenNavigatorClass, screenNavigatorDataTarget} from "../ui/ui";

// Generic class used to propagate the common variables.
export class App {
    public rootData: rootType
    
    public loadingScreen: LoadingScreen;
    public homeScreen: HomeScreen;
    public crashScreen: CrashScreen;
    public browseScreen: BrowseScreen;
    public searchScreen: SearchScreen;
    public compareScreen: CompareScreen;
    
    // Private list of screens used to easily pass them to functions in "ui/ui" without wasting RAM on repeated
    //   array instantiation.
    private readonly screens: Array<AppScreen>;
    
    constructor(rootData: rootType) {
        this.rootData = rootData;
        
        this.loadingScreen = new LoadingScreen(this);
        this.homeScreen = new HomeScreen(this);
        this.crashScreen = new CrashScreen(this);
        this.browseScreen = new BrowseScreen(this);
        this.searchScreen = new SearchScreen(this);
        this.compareScreen = new CompareScreen(this);
        
        this.screens =  [
            this.loadingScreen,
            this.homeScreen,
            this.crashScreen,
            this.browseScreen,
            this.searchScreen,
            this.compareScreen,
        ]
        
        this.registerScreenNavigatorElements()
    }
    
    // Loops over all app's screens and returns the first screen that is currently being shown to the user.
    public getCurrentScreen(): AppScreen | null {
        return getCurrentScreen(this.screens);
    }
    
    public async changeScreen(screenToShow: AppScreen) {
        console.debug(`Switching to screen '${screenToShow.id}'...`);
        await changeScreen(this.screens, screenToShow);
    }
    
    private registerScreenNavigatorElements(): void {
        // Getting all the elements that can trigger a screen change when clicked.
        const potentialTargetingElements: HTMLCollectionOf<Element> = document.getElementsByClassName(screenNavigatorClass);
        
        // @ts-ignore -> TS2488: Type 'HTMLCollectionOf<Element>' must have a '[Symbol.iterator]()' method that returns an iterator.
        for(const targetingElement of potentialTargetingElements) {
            const targetScreenId: string | null = targetingElement.getAttribute("data-"+screenNavigatorDataTarget);
            
            if(targetScreenId == null) {
                console.warn(`Used a link with the '${screenNavigatorClass}' class but no '${screenNavigatorDataTarget}' class !`);
                console.warn(targetingElement);
                continue;
            }
            
            const targetScreen: AppScreen | null = getScreenById(this.screens, targetScreenId);
            
            if(targetScreen == null) {
                console.warn(`Unable to find the screen with the '${targetScreenId}' ID !`);
                continue;
            }
            
            (targetingElement as HTMLElement).onclick = (e) => {
                if(!this.changeScreen(targetScreen)) {
                    throw new Error(`Failed to switch to the '${targetScreen.getHtmlId()}' screen !`);
                    //showCrashMessage("Failed to switch to the '"+targetScreen.getHtmlId()+"' screen !");
                }
            }
        }
    }
    
}
