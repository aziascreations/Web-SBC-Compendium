import {formatBytes} from "../utils/units";

//import {isParse} from "../external/typia/src/module";
//
//export function testTypia() {
//    console.log(isParse<Attribution>("{\"author\": \"friendlyelec\", \"license\": \"friendlyelec\"}"));
//}

import {z} from "../external/zod/src/index";

const COMMON_SBC_VARIANT_KEY = "_common";

const linkSchema = z.object({
    title: z.string(),
    url: z.string(),
    official: z.boolean(),
    store: z.boolean(),
    wiki: z.boolean(),
});

export type linkType = z.infer<typeof linkSchema>;




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
    
    static fromRawData(rawData: Record<string, any>) {
        const expectedFields = [
            {name: "title", type: "string", nullable: false, omittable: false, default: null},
            {name: "url", type: "string", nullable: false, omittable: false, default: null},
            {name: "official", type: "boolean", nullable: false, omittable: true, default: false},
            {name: "store", type: "boolean", nullable: false, omittable: true, default: false},
            {name: "wiki", type: "boolean", nullable: false, omittable: true, default: false},
        ];
        
        expectedFields.forEach(field => {
            // Checking if non-omittable fields are present.
            if(!field.omittable && !(field.name in rawData)) {
                throw new Error("Error 419.2");
            }
            // Setting omitted omittable fields to null.
            if(field.omittable && !(field.name in rawData)) {
                rawData[field.name] = field.default;
            }
            // Checking for non-nullable fields.
            if(rawData[field.name] === null && !field.nullable) {
                throw new Error("Error 420.2");
            }
            // Checking if the field is properly typed.
            if(!(typeof rawData[field.name] === field.type)) {
                throw new Error("Error 421.2");
            }
        });
        
        // WARNING: Typescript doesn't warn you if one of these fields is null when the constructor doesn't allow it !
        // TODO: Check if making them all nullable and handled in the getters would be better.
        return new this(
            rawData["title"],
            rawData["url"],
            rawData["official"],
            rawData["store"],
            rawData["wiki"],
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

export class Author {
    readonly name: string;
    readonly url: URL | null;
    
    constructor(name: string, url: URL | null) {
        this.name = name;
        this.url = url;
    }
    
    static fromRawData(rawData: Record<string, any>) {
        const expectedFields = [
            {name: "name", type: "string", nullable: false, omittable: false, default: null},
            {name: "url", type: "string", nullable: true, omittable: true, default: null},
        ];
        
        expectedFields.forEach(field => {
            // Checking if non-omittable fields are present.
            if(!field.omittable && !(field.name in rawData)) {
                throw new Error("Error 419.3");
            }
            // Setting omitted omittable fields to null.
            if(field.omittable && !(field.name in rawData)) {
                rawData[field.name] = field.default;
            }
            // Checking for non-nullable fields.
            if(rawData[field.name] === null && !field.nullable) {
                throw new Error("Error 420.3");
            }
            // Checking if the field is properly typed.
            if(!(typeof rawData[field.name] === field.type)) {
                throw new Error("Error 421.3");
            }
        });
        
        // WARNING: Typescript doesn't warn you if one of these fields is null when the constructor doesn't allow it !
        // TODO: Check if making them all nullable and handled in the getters would be better.
        return new this(rawData["name"], new URL(rawData["url"]));
    }
    
    static fromRawDataMap(rawData: object): Map<string, Author> {
        if(!(typeof rawData === "object")) {
            throw new Error("The given raw data for an author isn't an object !");
        }
        
        const returnedAuthors: Map<string, Author> = new Map<string, Author>();
        
        new Map(Object.entries(rawData)).forEach((rawAuthor: object, key: string) => {
            returnedAuthors.set(key, this.fromRawData(rawAuthor))
        });
        
        return returnedAuthors;
    }
    
}

export class Attribution {
    readonly author: string;
    readonly license: string;
    
    constructor(author: string, license: string) {
        this.author = author;
        this.license = license;
    }
    
    static fromRawData(rawData: Record<string, any>) {
        const expectedFields = [
            {name: "author", type: "string", nullable: false, omittable: false, default: null},
            {name: "license", type: "string", nullable: false, omittable: false, default: null},
        ];
        
        expectedFields.forEach(field => {
            // Checking if non-omittable fields are present.
            if(!field.omittable && !(field.name in rawData)) {
                throw new Error("Error 419.4");
            }
            // Setting omitted omittable fields to null.
            if(field.omittable && !(field.name in rawData)) {
                rawData[field.name] = field.default;
            }
            // Checking for non-nullable fields.
            if(rawData[field.name] === null && !field.nullable) {
                throw new Error("Error 420.4");
            }
            // Checking if the field is properly typed.
            if(!(typeof rawData[field.name] === field.type)) {
                throw new Error("Error 421.4");
            }
        });
        
        // WARNING: Typescript doesn't warn you if one of these fields is null when the constructor doesn't allow it !
        // TODO: Check if making them all nullable and handled in the getters would be better.
        return new this(rawData["author"], rawData["license"]);
    }
}

export class Image {
    url: URL;
    private readonly description: string | null;
    readonly attribution: Attribution;
    
    constructor(url: URL, description: string | null, attribution: Attribution) {
        this.url = url;
        this.description = description;
        this.attribution = attribution;
    }
    
    getDescription(): string {
        return this.description ? this.description : "";
    }
    
    static fromRawData(rawData: Record<string, any>): Image {
        const expectedFields = [
            {name: "url", type: "string", nullable: false, omittable: false, default: null},
            {name: "description", type: "string", nullable: true, omittable: true, default: null},
            {name: "attribution", type: "object", nullable: false, omittable: false, default: null},
        ];
        
        expectedFields.forEach(field => {
            // Checking if non-omittable fields are present.
            if(!field.omittable && !(field.name in rawData)) {
                throw new Error("Error 419.5");
            }
            // Setting omitted omittable fields to null.
            if(field.omittable && !(field.name in rawData)) {
                rawData[field.name] = field.default;
            }
            // Checking for non-nullable fields.
            if(rawData[field.name] === null && !field.nullable) {
                throw new Error("Error 420.5");
            }
            // Checking if the field is properly typed.
            if(!(typeof rawData[field.name] === field.type)) {
                throw new Error("Error 421.5");
            }
        });
        
        // Fixing potential issues
        if(rawData["url"].startsWith("/")) {
            rawData["url"] = location.protocol + '//' + location.host + ":" + location.port + rawData["url"];
        }
        
        return new this(new URL(rawData["url"]), rawData["description"], Attribution.fromRawData(rawData["attribution"]));
    }
    
    static fromRawDataArray(rawData: Array<object>): Array<Image> {
        if(!Array.isArray(rawData)) {
            throw new Error("The given raw data isn't an array !");
        }
        
        const returnedImages: Image[] = [];
        
        rawData.every(image => returnedImages.push(this.fromRawData(image)));
        
        return returnedImages;
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
    manufacturer: string;
    cpus: Array<SocCpu>;
    links: Array<Link>;
    picture: Image;
    
    constructor(name: string, manufacturer: string, cpus: Array<SocCpu>, links: Array<Link>, picture: Image) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.cpus = cpus;
        this.links = links;
        this.picture = picture;
    }
    
    getCpuCoreCount(): number {
        return this.cpus.reduce((cpuCoreCount, cpu ) => cpuCoreCount + cpu.count, 0);
    }
    
    static fromRawData(rawData: Record<string, any>): Soc {
        const expectedFields = [
            {name: "name", type: "string"},
            {name: "manufacturer", type: "string"},
            {name: "cpus", type: "object"},
            {name: "links", type: "object"},
            {name: "picture", type: "object"},
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
            rawData["manufacturer"],
            SocCpu.fromRawDataArray(rawData["cpus"]),
            Link.fromRawDataArray(rawData["links"]),
            Image.fromRawData(rawData["picture"]),
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
    logo: Image;
    
    constructor(name: string, links: Array<Link>, logo: Image) {
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
            {name: "logo", type: "object"},
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
            Image.fromRawData(rawData["logo"]),
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
    
    private readonly pictures: Array<Image>;
    
    constructor(commonVariant: SbcVariant | null, links: Array<Link>, ram: SbcVariantRam | null,
                remarks: Array<string>, pictures: Array<Image>) {
        this.commonVariant = commonVariant;
        this.links = links;
        this.ram = ram;
        this.remarks = remarks;
        this.pictures = pictures;
    }
    
    public getLinks(): Array<Link> {
        return this.links.concat(this.commonVariant !== null ? this.commonVariant.links : []);
    }
    
    public getRemarks(): Array<string> {
        return this.remarks.concat(this.commonVariant !== null ? this.commonVariant.remarks : []);
    }
    
    public getPictures(): Array<Image> {
        return this.pictures.concat(this.commonVariant !== null ? this.commonVariant.pictures : []);
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
            {name: "pictures", type: "object", nullable: true, omittable: true},
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
            rawData["pictures"] === null ? new Array<Image> : Image.fromRawDataArray(rawData["pictures"]),
        );
    }
}

export class Sbc {
    name: string;
    manufacturer: string;
    commonVariant: SbcVariant | null;
    variants: Map<string, SbcVariant>;
    picture: Image;
    
    constructor(name: string, manufacturer: string, commonVariant: SbcVariant | null,
                variants: Map<string, SbcVariant>, picture: Image) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.commonVariant = commonVariant;
        this.variants = variants;
        this.picture = picture;
    }
    
    getVariants(): Array<SbcVariant> {
        // TODO: Get dynamically !
        return new Array<SbcVariant>();
    }
    
    static fromRawData(rawData: Record<string, any>): Sbc {
        const expectedFields = [
            {name: "name", type: "string"},
            {name: "manufacturer", type: "string"},
            {name: "variants", type: "object"},
            {name: "options", type: "object"},
            {name: "expansions", type: "object"},
            {name: "warnings", type: "object"},
            {name: "picture", type: "object"},
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
            rawData["manufacturer"],
            commonVariant,
            otherVariants,
            Image.fromRawData(rawData["picture"])
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

export class License {
    name: string
    link: Link
    
    constructor(name: string, link: Link) {
        this.name = name;
        this.link = link;
    }
    
    static fromRawData(rawData: Record<string, any>): License {
        const expectedFields = [
            {name: "name", type: "string"},
            {name: "link", type: "object"},
        ];
        
        // Checking if all required fields are present.
        if(!expectedFields.every(field => field.name in rawData)) {
            throw new Error('A license is missing one or more fields !');
        }
        
        // Checking if the object fields are properly typed.
        if(!expectedFields.every(field => field.name in rawData && typeof rawData[field.name] === field.type)) {
            throw new Error("A license's field's isn't properly typed !");
        }
        
        return new this(
            rawData["name"],
            Link.fromRawData(rawData["link"]),
        );
    }
    
    static fromRawDataMap(rawData: object): Map<string, License> {
        if(!(typeof rawData === "object")) {
            throw new Error("The given raw data for a manufacturer isn't an object !");
        }
        
        const returnedLicenses: Map<string, License> = new Map<string, License>();
        
        new Map(Object.entries(rawData)).forEach((rawLicense: object, key: string) => {
            returnedLicenses.set(key, this.fromRawData(rawLicense))
        });
        
        return returnedLicenses;
    }
}

export class Root {
    cpu: Map<string, Cpu>;
    manufacturer: Map<string, Manufacturer>;
    sbc: Map<string, Sbc>;
    soc: Map<string, Soc>;
    license: Map<string, License>;
    author: Map<string, Author>;
    version: number;
    
    constructor(cpu: Map<string, Cpu>, manufacturer: Map<string, Manufacturer>, sbc: Map<string, Sbc>,
                soc: Map<string, Soc>, license: Map<string, License>, author: Map<string, Author>, version: number) {
        this.cpu = cpu;
        this.manufacturer = manufacturer;
        this.sbc = sbc;
        this.soc = soc;
        this.license = license;
        this.author = author;
        this.version = version;
    }
    
    getFromManufacturer(manufacturerId: string): Root {
        // Checking if the desired manufacturer exists.
        const targetedManufacturer: Manufacturer | undefined = this.manufacturer.get(manufacturerId)
        
        if(!targetedManufacturer) {
            throw Error("The manufacturer '"+manufacturerId+"' is unknown !");
        }
        
        // Filtering out the current root into a new blank one.
        const filteredRoot: Root = this.getBlankCopy();
        
        filteredRoot.manufacturer.set(manufacturerId, targetedManufacturer);
        
        this.cpu.forEach((value, key) => {
            // TODO: Add once the proper fields are added in Cpu !
        });
        
        this.soc.forEach((soc, key) => {
            if(soc.manufacturer === manufacturerId) {
                filteredRoot.soc.set(key, soc);
            }
        });
        
        this.sbc.forEach((sbc, key) => {
            if(sbc.manufacturer === manufacturerId) {
                filteredRoot.sbc.set(key, sbc);
            }
        });
        
        return filteredRoot;
    }
    
    getBlankCopy(): Root {
        return new Root(
            new Map<string, Cpu>(),
            new Map<string, Manufacturer>(),
            new Map<string, Sbc>(),
            new Map<string, Soc>(),
            new Map<string, License>(),
            new Map<string, Author>(),
            this.version
        );
    }
    
    static fromRawData(rawData: Record<string, any>): Root {
        const expectedFields: Array<string> = ["cpu", "manufacturer", "sbc", "soc", "license", "author"];
        
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
            License.fromRawDataMap(rawData["license"]),
            Author.fromRawDataMap(rawData["author"]),
            -1
        );
    }
    
    static getBlank(): Root {
        return new this(
            new Map<string, Cpu>(),
            new Map<string, Manufacturer>(),
            new Map<string, Sbc>(),
            new Map<string, Soc>(),
            new Map<string, License>(),
            new Map<string, Author>(),
            -1
        );
    }
}
