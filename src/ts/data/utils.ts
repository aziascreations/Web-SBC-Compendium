import {rootType, manufacturerType, cpuType, socType, sbcType} from "./types";

export const COMMON_SBC_VARIANT_KEY = "_common";

export function getFromManufacturer(dataRoot: rootType, manufacturerId: string):
    {manufacturer: manufacturerType, cpus: Map<string, cpuType>, socs: Map<string, socType>, sbcs: Map<string, sbcType>} {
    // Checking if the desired manufacturer exists.
    const targetedManufacturer: manufacturerType | undefined = dataRoot.manufacturer.get(manufacturerId);
    
    if(!targetedManufacturer) {
        throw Error("The manufacturer '"+manufacturerId+"' is unknown !");
    }
    
    // Preparing the returned containers.
    const returnedCpus = new Map<string, cpuType>();
    const returnedSocs = new Map<string, socType>();
    const returnedSbcs = new Map<string, sbcType>();
    
    // Filtering the desired content.
    dataRoot.cpu.forEach((value, key) => {
        // TODO: Add once the proper fields are added in Cpu !
    });
    
    dataRoot.soc.forEach((soc, key) => {
        if(soc.manufacturer === manufacturerId) {
            returnedSocs.set(key, soc);
        }
    });
    
    dataRoot.sbc.forEach((sbc, key) => {
        if(sbc.manufacturer === manufacturerId) {
            returnedSbcs.set(key, sbc);
        }
    });
    
    return {
        manufacturer: targetedManufacturer,
        cpus: returnedCpus,
        socs: returnedSocs,
        sbcs: returnedSbcs,
    };
}
