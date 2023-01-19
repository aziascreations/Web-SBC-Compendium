import {formatBytes} from "../utils/units";

const COMMON_SBC_VARIANT_KEY = "_common";

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

export class SbcVariantRam {
    capacity: number;
    type: string;
    
    constructor(capacity: number, type: string) {
        this.capacity = capacity;
        this.type = type;
    }
    
    static fromRawData(rawData: Record<string, any>): SbcVariantRam {
        const expectedFields = [
            {name: "capacity", type: "number"},
            {name: "type", type: "string"},
        ];
        
        // Checking if all required fields are present.
        if(!expectedFields.every(field => field.name in rawData)) {
            throw new Error("A SBC variant's RAM is missing one or more fields !");
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(field => field.name in rawData && typeof rawData[field.name] === field.type)) {
            throw new Error("A SBC variant's RAM field's isn't properly typed !");
        }
        
        return new this(
            rawData["capacity"],
            rawData["type"],
        );
    }
    
    public getFormattedSizes(decimalCount: number = 3): {si: string, binary: string} {
        return formatBytes(this.capacity, decimalCount);
    }
    
    public getFormattedSiSize(decimalCount: number = 3): string {
        return formatBytes(this.capacity, decimalCount).si;
    }
    
    public getFormattedBinarySize(decimalCount: number = 3): string {
        return formatBytes(this.capacity, decimalCount).binary;
    }
}

export class SbcVariant {
    // Parent variant on which this and all variants of a given SBC may be based.
    private readonly commonVariant: SbcVariant | null;
    
    // Link(s) related to this variant and this variant only.
    // Has to be grabbed from the "getLinks()" class methods to resolve variants inheritance.
    private links: Array<Link>;
    
    private readonly ram: SbcVariantRam | null;
    
    private remarks: Array<string>;
    
    constructor(commonVariant: SbcVariant | null, links: Array<Link>, ram: SbcVariantRam | null,
                remarks: Array<string>) {
        this.commonVariant = commonVariant;
        this.links = links;
        this.ram = ram;
        this.remarks = remarks;
    }
    
    public getLinks(): Array<Link> {
        return this.links.concat(this.commonVariant !== null ? this.commonVariant.links : []);
    }
    
    public getRemarks(): Array<string> {
        return this.remarks.concat(this.commonVariant !== null ? this.commonVariant.remarks : []);
    }
    
    public getRam(): SbcVariantRam {
        if(this.ram !== null) {
            return this.ram;
        }
        
        // Checking if the common variant has it.
        // Has to be done after the 1st check to enable proper recursion.
        // If done first, this check could raise an exception even if the children variant has the "ram" info.
        if(this.commonVariant !== null) {
            return this.commonVariant.getRam();
        }
        
        // Shouldn't happen since this field is checked during parsing.
        throw new Error("Reeee!");
    }
    
    static fromRawData(rawData: Record<string, any>, commonVariant: SbcVariant | null = null): SbcVariant {
        // TODO: Expand this system to make is use default values on null or omitted fields automatically.
        const expectedFields = [
            {name: "links", type: "object", nullable: true, omittable: true},
            {name: "ram", type: "object", nullable: true, omittable: true},
            {name: "remarks", type: "object", nullable: true, omittable: true},
        ];
        
        // Checking if non-omittable fields are present, and setting the omitted ones as null.
        // Makes later checks easier and cleaner.
        expectedFields.forEach(field => {
            // Checking if non-omittable fields are present.
            if(!field.omittable && !(field.name in rawData)) {
                throw new Error("Error 419");
            }
            // Setting omitted omittable fields to null.
            if(field.omittable && !(field.name in rawData)) {
                rawData[field.name] = null;
            }
            // Checking for non-nullable fields.
            if(rawData[field.name] === null && !field.nullable) {
                throw new Error("Error 420");
            }
            // Checking if the field is properly typed.
            if(!(typeof rawData[field.name] === field.type)) {
                throw new Error("Error 421");
            }
        });
        
        // WARNING: Typescript doesn't warn you if one of these fields is null when the constructor doesn't allow it !
        // TODO: Check if making them all nullable and handled in the getters would be better.
        return new this(
            commonVariant,
            rawData["links"] === null ? new Array<Link> : rawData["links"],
            rawData["ram"],
            rawData["remarks"] === null ? new Array<string> : rawData["remarks"],
        );
    }
}

export class Sbc {
    name: string;
    manufacturer_id: string;
    commonVariant: SbcVariant | null;
    variants: Map<string, SbcVariant>;
    
    constructor(name: string, manufacturer_id: string, commonVariant: SbcVariant | null,
                variants: Map<string, SbcVariant>) {
        this.name = name;
        this.manufacturer_id = manufacturer_id;
        this.commonVariant = commonVariant;
        this.variants = variants;
    }
    
    getVariants(): Array<SbcVariant> {
        // TODO: Get dynamically !
        return new Array<SbcVariant>();
    }
    
    static fromRawData(rawData: Record<string, any>): Sbc {
        const expectedFields = [
            {name: "name", type: "string"},
            {name: "manufacturer_id", type: "string"},
            {name: "variants", type: "object"},
            {name: "options", type: "object"},
            {name: "expansions", type: "object"},
            {name: "warnings", type: "object"},
        ];
        
        // Checking if all required fields are present.
        if(!expectedFields.every(field => field.name in rawData)) {
            throw new Error("A SBC is missing one or more fields !");
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(field => field.name in rawData && typeof rawData[field.name] === field.type)) {
            throw new Error("A SBC's field's isn't properly typed !");
        }
        
        const commonVariant = rawData["variants"][COMMON_SBC_VARIANT_KEY] ?
            SbcVariant.fromRawData(rawData["variants"][COMMON_SBC_VARIANT_KEY]) : null;
        
        const otherVariants: Map<string, SbcVariant> = new Map<string, SbcVariant>();
        new Map(Object.entries(rawData["variants"])).forEach((rawSbcVariant: any, key: string) => {
            if(typeof rawSbcVariant !== "object") {
                throw new Error("kjsdfh");
            }
            if(key !== COMMON_SBC_VARIANT_KEY) {
                otherVariants.set(key, SbcVariant.fromRawData(rawSbcVariant));
            }
        });
        
        return new this(
            rawData["name"],
            rawData["manufacturer_id"],
            commonVariant,
            otherVariants
        );
    }
    
    static fromRawDataMap(rawData: object): Map<string, Sbc> {
        if(!(typeof rawData === "object")) {
            throw new Error("The given raw data for a SBC isn't an object !");
        }
        
        const returnedSbcs: Map<string, Sbc> = new Map<string, Sbc>();
        
        new Map(Object.entries(rawData)).forEach((rawSbc: object, key: string) => {
            returnedSbcs.set(key, this.fromRawData(rawSbc));
        });
        
        return returnedSbcs;
    }
}

export class Root {
    cpu: Map<string, Cpu>;
    manufacturer: Map<string, Manufacturer>;
    sbc: Map<string, Sbc>;
    soc: Map<string, Soc>;
    version: number;
    
    constructor(cpu: Map<string, Cpu>, manufacturer: Map<string, Manufacturer>, sbc: Map<string, Sbc>,
                soc: Map<string, Soc>, version: number) {
        this.cpu = cpu;
        this.manufacturer = manufacturer;
        this.sbc = sbc;
        this.soc = soc;
        this.version = version;
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
            Sbc.fromRawDataMap(rawData["sbc"]),
            Soc.fromRawDataMap(rawData["soc"]),
            -1
        );
    }
    
    static getBlank(): Root {
        return new this(
            new Map<string, Cpu>(),
            new Map<string, Manufacturer>(),
            new Map<string, Sbc>(),
            new Map<string, Soc>(),
            -1
        );
    }
}
