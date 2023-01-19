
// TODO: Add a text explaining that everything is grouped here to allow for checks when loading the app.
export enum Templates {
    BrowserManufacturerSection = "bms",
    BrowserManufacturerItem = "bmi",
}

export enum TemplateComponents {
    BrowserManufacturerSectionLogo = "bms-logo",
    BrowserManufacturerSectionTitle = "bms-title",
    BrowserManufacturerSectionEntries = "bms-entries",
    BrowserManufacturerItemName = "bmi-name",
    BrowserManufacturerItemImage = "bmi-img",
}

export function getTemplateById(template: Templates): HTMLTemplateElement {
    const element = document.getElementById(template);
    
    if(element instanceof HTMLTemplateElement) {
        return element;
    }
    
    throw new Error("Unable to find the '" + template + "' template !");
}
