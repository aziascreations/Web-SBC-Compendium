import {fetchDataBlob, parseDataBlob} from "./data/loaders";
import {App} from "./data/app";

const dataBlobUrl = new URL("http://" + window.location.hostname + "/resources/sbc-compendium/data/data.json");

// Used to access the main "App" object instance when debugging.
export let appDebugAccess: App | null = null;

document.addEventListener("DOMContentLoaded", function() {
    console.log()
    fetchDataBlob(dataBlobUrl)
        .then(data => {
            // Validating and parsing the data into the proper structures.
            const rootData = parseDataBlob(data);
            
            // Creating the app, registering the navigation elements and preparing the app.
            const newRootApp = new App(rootData);
            appDebugAccess = newRootApp;
            
            // Navigating to the appropriate page
            newRootApp.changeScreen(newRootApp.homeScreen).then();
            
            // TODO: Parse URL and resume session from it.
            
            // TODO: Use a setTimeout to an external function to shut Chrome up about this function taking to long.
        })
        .catch(error => {
            console.error(error);
        });
});