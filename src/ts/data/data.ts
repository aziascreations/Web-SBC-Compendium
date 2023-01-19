import {CpuCache, Root} from "types";

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

export function parseDataBlob(dataBlob: object): Root | null {
    return null;
}

// TODO: Make references with IDs
