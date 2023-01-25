import {rootSchema, rootType} from "./types";

export function fetchDataBlob(url: URL): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

export function parseDataBlob(dataBlob: object): rootType {
    // Converting some Object fields to Map in order for Zod to stop complaining.
    for(const [key, value] of Object.entries(dataBlob)) {
        if(typeof value == "object") {
            // @ts-ignore - Implicit any that can't be fixed and is irrelevant.
            dataBlob[key] = new Map(Object.entries(value));
        }
    }
    
    // Going over every SBC's variants too.
    if("sbc" in dataBlob) {
        (dataBlob["sbc"] as Map<string, object>).forEach((sbcValue, sbcKey) => {
            for(const [sbcFieldKey, sbcFieldValue] of Object.entries(sbcValue)) {
                if(sbcFieldKey === "variants" && typeof sbcFieldValue === "object") {
                    // @ts-ignore - Potential undefined error - Don't care, I just want usable data...
                    (dataBlob["sbc"] as Map<string, object>).get(sbcKey)[sbcFieldKey] = new Map(Object.entries(sbcFieldValue));
                }
            }
        });
    }
    
    // Finally doing what we wanted.
    return rootSchema.parse(dataBlob);
}
