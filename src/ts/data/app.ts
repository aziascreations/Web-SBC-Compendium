import {Root} from "./types";

export class App {
    rootData: Root
    
    constructor(rootData: Root) {
        this.rootData = rootData;
    }
    
    static getBlank(): App {
        return new this(Root.getBlank());
    }
}
