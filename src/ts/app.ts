import {fetchDataBlob} from "./data/data";
import {
    registerAllScreens,
    changeScreen,
    registerScreenNavigatorElements, homeScreen
} from "./ui/ui";
import {fadeOut} from "./ui/animations";
import {Root} from "./data/types";

const dataBlobUrl = new URL("http://" + window.location.hostname + "/resources/sbc-compendium/data/data.json");

/*window.onload = function() {

};*/

document.addEventListener("DOMContentLoaded", function() {
    fetchDataBlob(dataBlobUrl)
        .then(data => {
            console.log(data);
            let rootData = Root.fromRawData(data);
            console.log(rootData);
        })
        .catch(error => console.error(error));
    
    registerAllScreens();
    registerScreenNavigatorElements();
    
    // TODO: Parse URL and resume session from it.
    
    // TODO: Use a setTimeout to an external function to shut Chrome up about this function taking to long.
    
    changeScreen(homeScreen);
    
    //fadeOut(homeScreen, 500).then(r => {console.log("Reeee !")});
});