const units = [
    ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
];

export function formatBytes(bytes: number, decimalCount: number = 3): {si: string, binary: string} {
    let siUnitIndex = 0;
    let binaryUnitIndex = 0;
    
    let siBytes = bytes;
    let binaryBytes = bytes;
    
    while (siBytes >= 1000) {
        siBytes /= 1000;
        siUnitIndex++;
    }
    
    while (binaryBytes >= 1024) {
        binaryBytes /= 1024;
        binaryUnitIndex++;
    }
    
    return {
        si: bytes.toFixed(decimalCount) + " " + units[0][siUnitIndex],
        binary: bytes.toFixed(decimalCount) + " " + units[1][binaryUnitIndex]
    };
}

export function getFormattedSizes(bytes: number, decimalCount: number = 3): {si: string, binary: string} {
    return formatBytes(bytes, decimalCount);
}

export function getFormattedSiSize(bytes: number, decimalCount: number = 3): string {
    return formatBytes(bytes, decimalCount).si;
}

export function getFormattedBinarySize(bytes: number, decimalCount: number = 3): string {
    return formatBytes(bytes, decimalCount).binary;
}
