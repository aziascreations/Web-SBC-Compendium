
export class Link {
    title: string;
    url: URL;
    official: boolean;
    store: boolean;
    wiki: boolean;
    
    constructor(title: string, url: URL, official: boolean, store: boolean, wiki: boolean) {
        this.title = title;
        this.url = url;
        this.official = official;
        this.store = store;
        this.wiki = wiki;
    }
    
    static fromRawData(rawData: object) {
        // Checking if all required fields are present.
        if(!("title" in rawData && "url" in rawData && "official" in rawData && "store" in rawData && "wiki" in rawData)) {
            throw new Error('Missing fields !');
        }
    
        // Checking if the numbers are properly typed.
        if(!(typeof rawData["title"] === "string" && typeof rawData["url"] === "string"
            && typeof rawData["official"] === "boolean" && typeof rawData["store"] === "boolean"
            && typeof rawData["wiki"] === "boolean")) {
            throw new Error("One or more of the URL field isn\'t properly typed !");
        }
        
        return new this(
            rawData["title"], new URL(rawData["url"]), rawData["official"], rawData["store"], rawData["wiki"]
        );
    }
    
    static fromRawDataArray(rawData: Array<object>): Array<Link> {
        if(!Array.isArray(rawData)) {
            throw new Error("The given raw data isn't an array !");
        }
        
        const returnedLinks: Link[] = [];
        
        rawData.every(link => returnedLinks.push(this.fromRawData(link)));
        
        return returnedLinks;
    }
}

export class CpuCacheLayer {
    min: number;
    max: number;
    note: string | null;
    
    constructor(min: number, max: number, note: string | null) {
        this.min = min;
        this.max = max;
        this.note = note;
    }
    
    hasNote(): boolean {
        return !(this.note == null);
    }
    
    getNote(fallback: string = ""): string {
        return this.hasNote() ? <string>this.note : fallback;
    }
    
    static fromRawData(rawData: object): CpuCacheLayer {
        // Checking if all required fields are present.
        if(!("min" in rawData && "max" in rawData && "note" in rawData)) {
            throw new Error('Missing fields !');
        }
        
        // Checking if the numbers are properly typed.
        if(!(typeof rawData["min"] === "number" && typeof rawData["max"] === "number")) {
            throw new Error('The ? or ? field isn\'t a number !');
        }
        
        // Checking if the note is properly typed.
        if(!(rawData["note"] === null || typeof rawData["note"] === "string")) {
            throw new Error('The note field isn\'t a string or null !');
        }
        
        return new this(rawData["min"], rawData["max"], rawData["note"]);
    }
}

export class CpuCache {
    l1: CpuCacheLayer | null;
    l2: CpuCacheLayer | null;
    l3: CpuCacheLayer | null;
    
    constructor(l1: CpuCacheLayer | null, l2: CpuCacheLayer | null, l3: CpuCacheLayer | null) {
        this.l1 = l1;
        this.l2 = l2;
        this.l3 = l3;
    }
    
    static fromRawData(rawData: object): CpuCache {
        // Checking if all required fields are present.
        if(!("l1" in rawData && "l2" in rawData && "l3" in rawData)) {
            throw new Error('Missing fields !');
        }
        
        // Checking if the object fields are properly typed.
        if(!((typeof rawData["l1"] === "object" || rawData["l1"] === null) &&
            (typeof rawData["l2"] === "object" || rawData["l2"] === null) &&
            (typeof rawData["l3"] === "object" || rawData["l3"] === null))) {
            throw new Error('The l1, l2 or l3 field isn\'t an object or null !');
        }
        
        return new this(
            rawData["l1"] !== null ? CpuCacheLayer.fromRawData(rawData["l1"]) : null,
            rawData["l2"] !== null ? CpuCacheLayer.fromRawData(rawData["l2"]) : null,
            rawData["l3"] !== null ? CpuCacheLayer.fromRawData(rawData["l3"]) : null,
        );
    }
}

export class Cpu {
    name: string;
    
    launch: string;
    designer: string;
    micro_architecture: string;
    
    caches: CpuCache;
    
    links: Array<Link>;
    
    constructor(name: string, launch: string, designer: string, micro_architecture: string, caches: CpuCache,
                links: Array<Link>) {
        this.name = name;
        this.launch = launch;
        this.designer = designer;
        this.micro_architecture = micro_architecture;
        this.caches = caches;
        this.links = links;
    }
    
    static fromRawData(rawData: Record<string, any>): Cpu {
        const expectedFields = [
            {name: "name", type: "string"},
            {name: "launch", type: "string"},
            {name: "designer", type: "string"},
            {name: "micro_architecture", type: "string"},
            {name: "caches", type: "object"},
            {name: "links", type: "object"},
        ]
        
        // Checking if all required fields are present.
        if(!expectedFields.every(field => field.name in rawData)) {
            throw new Error('A CPU is missing one or more fields !');
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(field => field.name in rawData && typeof rawData[field.name] === field.type)) {
            throw new Error("A CPU's field's isn't properly typed !");
        }
        
        return new this(
            rawData["name"],
            rawData["launch"],
            rawData["designer"],
            rawData["micro_architecture"],
            CpuCache.fromRawData(rawData["caches"]),
            Link.fromRawDataArray(rawData["links"]),
        );
    }
    
    static fromRawDataMap(rawData: object): Map<string, Cpu> {
        if(!(typeof rawData === "object")) {
            throw new Error("The given raw data for a CPU isn't an object !");
        }
        
        const returnedCpus: Map<string, Cpu> = new Map<string, Cpu>();
        
        new Map(Object.entries(rawData)).forEach((rawCpu: object, key: string) => {
            returnedCpus.set(key, this.fromRawData(rawCpu))
        });
        
        return returnedCpus;
    }
}

export class SocCpu {
    id: string;
    count: number;
    
    constructor(id: string, count: number) {
        this.id = id;
        this.count = count;
    }
    
    static fromRawData(rawData: Record<string, any>): SocCpu {
        const expectedFields = [
            {name: "id", type: "string"},
            {name: "count", type: "number"}
        ]
        
        // Checking if all required fields are present.
        if(!expectedFields.every(field => field.name in rawData)) {
            throw new Error("A SOC's CPUs field is missing one or more fields !");
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(field => field.name in rawData && typeof rawData[field.name] === field.type)) {
            throw new Error("A SOC's CPUs field isn't properly typed !");
        }
        
        return new this(
            rawData["id"],
            rawData["count"]
        );
    }
    
    static fromRawDataArray(rawData: Array<object>): Array<SocCpu> {
        if(!Array.isArray(rawData)) {
            throw new Error("The given raw data isn't an array !");
        }
        
        const returnedSocCpu: Array<SocCpu> = [];
        
        rawData.every(socCpu => returnedSocCpu.push(this.fromRawData(socCpu)));
        
        return returnedSocCpu;
    }
}

export class Soc {
    name: string;
    cpus: Array<SocCpu>;
    links: Array<Link>;
    
    constructor(name: string, cpus: Array<SocCpu>, links: Array<Link>) {
        this.name = name;
        this.cpus = cpus;
        this.links = links;
    }
    
    getCpuCoreCount(): number {
        return this.cpus.reduce((cpuCoreCount, cpu ) => cpuCoreCount + cpu.count, 0);
    }
    
    static fromRawData(rawData: Record<string, any>): Soc {
        const expectedFields = [
            {name: "name", type: "string"},
            {name: "cpus", type: "object"},
            {name: "links", type: "object"},
        ]
        
        // Checking if all required fields are present.
        if(!expectedFields.every(field => field.name in rawData)) {
            throw new Error('A SOC is missing one or more fields !');
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(field => field.name in rawData && typeof rawData[field.name] === field.type)) {
            throw new Error("A SOC's field's isn't properly typed !");
        }
        
        return new this(
            rawData["name"],
            SocCpu.fromRawDataArray(rawData["cpus"]),
            Link.fromRawDataArray(rawData["links"]),
        );
    }
    
    static fromRawDataMap(rawData: object): Map<string, Soc> {
        if(!(typeof rawData === "object")) {
            throw new Error("The given raw data for a SOC isn't an object !");
        }
        
        const returnedSocs: Map<string, Soc> = new Map<string, Soc>();
        
        new Map(Object.entries(rawData)).forEach((rawSoc: object, key: string) => {
            returnedSocs.set(key, this.fromRawData(rawSoc))
        });
        
        return returnedSocs;
    }
}

export class Manufacturer {
    name: string;
    links: Array<Link>;
    logo: string;
    
    constructor(name: string, links: Array<Link>, logo: string) {
        this.name = name;
        this.links = links;
        this.logo = logo;
    }
    
    //getAllProducts() {
    //
    //}
    
    static fromRawData(rawData: Record<string, any>): Manufacturer {
        const expectedFields = [
            {name: "name", type: "string"},
            {name: "links", type: "object"},
            {name: "logo", type: "string"},
        ];
        
        // Checking if all required fields are present.
        if(!expectedFields.every(field => field.name in rawData)) {
            throw new Error('A manufacturer is missing one or more fields !');
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(field => field.name in rawData && typeof rawData[field.name] === field.type)) {
            throw new Error("A manufacturer's field's isn't properly typed !");
        }
        
        return new this(
            rawData["name"],
            Link.fromRawDataArray(rawData["links"]),
            rawData["logo"],
        );
    }
    
    static fromRawDataMap(rawData: object): Map<string, Manufacturer> {
        if(!(typeof rawData === "object")) {
            throw new Error("The given raw data for a manufacturer isn't an object !");
        }
        
        const returnedManufacturers: Map<string, Manufacturer> = new Map<string, Manufacturer>();
        
        new Map(Object.entries(rawData)).forEach((rawManufacturer: object, key: string) => {
            returnedManufacturers.set(key, this.fromRawData(rawManufacturer))
        });
        
        return returnedManufacturers;
    }
}

export class Root {
    cpu: Map<string, Cpu>;
    manufacturer: Map<string, Manufacturer>;
    sbc: Array<any>;
    soc: Map<string, Soc>;
    
    constructor(cpu: Map<string, Cpu>, manufacturer: Map<string, Manufacturer>, sbc: Array<any>, soc: Map<string, Soc>) {
        this.cpu = cpu;
        this.manufacturer = manufacturer;
        this.sbc = sbc;
        this.soc = soc;
    }
    
    static fromRawData(rawData: Record<string, any>): Root {
        const expectedFields: Array<string> = ["cpu", "manufacturer", "sbc", "soc"];
        
        // Checking if all required fields are present.
        if(!expectedFields.every(fieldName => fieldName in rawData)) {
            throw new Error('A root field is missing !');
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(fieldName => typeof rawData[fieldName] === "object")) {
            throw new Error("A root field isn't properly typed !");
        }
        
        return new this(
            Cpu.fromRawDataMap(rawData["cpu"]),
            Manufacturer.fromRawDataMap(rawData["manufacturer"]),
            [],
            Soc.fromRawDataMap(rawData["soc"])
        );
    }
    
    static getBlank(): Root {
        return new this(
            new Map<string, Cpu>(),
            new Map<string, Manufacturer>(),
            [],
            new Map<string, Soc>()
        );
    }
}
