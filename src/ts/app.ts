import {fetchDataBlob} from "./data/data";
import {
    registerAllScreens,
    changeScreen,
    registerScreenNavigatorElements, homeScreen
} from "./ui/ui";
import {fadeOut} from "./ui/animations";
import {Root} from "./data/types";
import {App} from "./data/app";

const dataBlobUrl = new URL("http://" + window.location.hostname + "/resources/sbc-compendium/data/data.json");

/*window.onload = function() {

};*/

// Used to access the main "App" when using the non-bundled script.
export let appDebugAccess: App | null = null;

document.addEventListener("DOMContentLoaded", function() {
    fetchDataBlob(dataBlobUrl)
        .then(data => {
            console.log(data);
            const rootData = Root.fromRawData(data);
            console.log(rootData);
            
            const newRootApp = new App(rootData);
            appDebugAccess = newRootApp;
            
            registerAllScreens(newRootApp);
            registerScreenNavigatorElements();
            
            // TODO: Parse URL and resume session from it.
            
            // TODO: Use a setTimeout to an external function to shut Chrome up about this function taking to long.
            
            changeScreen(homeScreen);
        })
        .catch(error => {
            console.error(error);
        });
});