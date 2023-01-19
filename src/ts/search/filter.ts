import {Root} from "../data/types";

interface IFilterParameter {
    isValueIncluded(value: any): boolean;
}

abstract class FilterRangeParameter implements IFilterParameter {
    fixedAbsoluteMinimum: number
    fixedAbsoluteMaximum: number
    currentAbsoluteMinimum: number
    currentAbsoluteMaximum: number
    currentMinimum: number
    currentMaximum: number
    
    protected constructor(fixedAbsoluteMinimum: number, fixedAbsoluteMaximum: number, currentAbsoluteMinimum: number,
                          currentAbsoluteMaximum: number, currentMinimum: number, currentMaximum: number) {
        this.fixedAbsoluteMinimum = fixedAbsoluteMinimum;
        this.fixedAbsoluteMaximum = fixedAbsoluteMaximum;
        this.currentAbsoluteMinimum = currentAbsoluteMinimum;
        this.currentAbsoluteMaximum = currentAbsoluteMaximum;
        this.currentMinimum = currentMinimum;
        this.currentMaximum = currentMaximum;
    }
    
    abstract isValueIncluded(value: any): boolean;
}

//interface IFilterBooleanParameter {
//    isToggled(): boolean;
//    setState(newState: boolean): void;
//}

class NumericalRangeFilterParameter extends FilterRangeParameter {
    isValueIncluded(value: number): boolean {
        return value >= this.currentMinimum && value <= this.currentMaximum;
    }
}

abstract class Filter {
    name: string;
    parameters: Array<IFilterParameter>;
    
    protected constructor(name: string, parameters: Array<IFilterParameter> = []) {
        this.name = name;
        this.parameters = parameters;
    }
    
    abstract doFiltering(rootData: Root): Root;
    abstract getFilterParameters(): Array<IFilterParameter>;
}

class CpuCoreCountFilter extends Filter{
    constructor() {
        super("${filter.cpu.core.count.name}");
    }
    
    doFiltering(rootData: Root): Root {
        const filteredRoot: Root = Root.getBlank();
        
        // Adding the unchanged fields.
        filteredRoot.soc = rootData.soc;
        filteredRoot.manufacturer = rootData.manufacturer;
        
        // Filtering out the SOCs with an invalid core count.
        
        
        // Filtering out the SOCs without enough CPU cores.
        
        
        // Filtering out the SBCs that are using excluded SOCs
        // TODO: This !
        
        return filteredRoot;
    }
    
    getFilterParameters(): Array<IFilterParameter> {
        return [];
    }
}


