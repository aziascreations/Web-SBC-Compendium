import {AppScreen} from "./base";
import {getTemplateById, TemplateComponents, Templates} from "../templates";
import {App} from "../../data/app";
import {getFromManufacturer} from "../../data/utils";

const ENTRIES_CONTAINER_ID = "container-browse-entries";

export class BrowseScreen extends AppScreen {
    constructor(parentApp: App) {
        super("browse", parentApp);
    }
    
    onHidden(newScreen: AppScreen): void {
        BrowseScreen.clearEntriesContainer();
    }
    
    onPreShown(oldScreen: AppScreen): void {
        const eEntriesContainer = BrowseScreen.clearEntriesContainer();
        
        this.parentApp.rootData.manufacturer.forEach((manufacturer, manufacturerId) => {
            // Getting the manufacturer container template.
            const eNewSection: HTMLElement = (
                getTemplateById(Templates.BrowserManufacturerSection) as HTMLTemplateElement
            ).content.cloneNode(true) as HTMLElement;
            
            // Changing the logo, title and getting other references.
            const eSectionLogo = eNewSection.querySelector("#"+TemplateComponents.BrowserManufacturerSectionLogo) as HTMLImageElement;
            const eSectionTitle = eNewSection.querySelector("#"+TemplateComponents.BrowserManufacturerSectionTitle) as HTMLElement;
            const eSectionEntries = eNewSection.querySelector("#"+TemplateComponents.BrowserManufacturerSectionEntries) as HTMLElement;
            
            eSectionLogo.removeAttribute("id");
            eSectionTitle.removeAttribute("id");
            eSectionEntries.removeAttribute("id");
            
            eSectionLogo.src = manufacturer.logo.url.toString();
            eSectionTitle.textContent = manufacturer.name;
            
            // Adding every product to the previous template.
            const {cpus, sbcs, socs} = getFromManufacturer(this.parentApp.rootData, manufacturerId);
            
            sbcs.forEach((sbc, sbcId) => {
                const eNewItem: HTMLElement = (
                    getTemplateById(Templates.BrowserManufacturerItem) as HTMLTemplateElement
                ).content.cloneNode(true) as HTMLElement;
                
                const eItemName = eNewItem.querySelector("#"+TemplateComponents.BrowserManufacturerItemName) as HTMLElement;
                const eItemImage = eNewItem.querySelector("#"+TemplateComponents.BrowserManufacturerItemImage) as HTMLImageElement;
                eItemName.removeAttribute("id");
                eItemImage.removeAttribute("id");
                eItemName.textContent = sbc.name;
                eItemImage.src = sbc.picture.url.toString();
                
                eSectionEntries.appendChild(eNewItem);
            });
            
            socs.forEach((soc, socId) => {
                const eNewItem: HTMLElement = (
                    getTemplateById(Templates.BrowserManufacturerItem) as HTMLTemplateElement
                ).content.cloneNode(true) as HTMLElement;
                
                const eItemName = eNewItem.querySelector("#"+TemplateComponents.BrowserManufacturerItemName) as HTMLElement;
                const eItemImage = eNewItem.querySelector("#"+TemplateComponents.BrowserManufacturerItemImage) as HTMLImageElement;
                eItemName.removeAttribute("id");
                eItemImage.removeAttribute("id");
                eItemName.textContent = soc.name;
                eItemImage.src = soc.picture.url.toString();
                
                eSectionEntries.appendChild(eNewItem);
            });
            
            // TODO: Add SOCs and CPUs too !
            // See Root.getFromManufacturer() for more info on the missing data !
            
            // Adding the manufacturer's section to the page.
            eEntriesContainer.appendChild(eNewSection);
        });
    }
    
    private static clearEntriesContainer(): HTMLElement {
        const eEntriesContainer = document.getElementById(ENTRIES_CONTAINER_ID);
        
        if(eEntriesContainer !== null) {
            eEntriesContainer.innerHTML = "";
            return eEntriesContainer;
        } else {
            throw new Error("Unable to find '#"+ENTRIES_CONTAINER_ID+"' !");
        }
    }
}
