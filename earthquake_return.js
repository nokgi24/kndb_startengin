import { fetchEarthquakeData } from './earthquake.js';
import { transformEarthquakeData } from './transfer.js';

let lastData = null; 
let data_system = 0; 

function isDataEqual(newData, oldData) {
    if (!oldData) return false; 
    return JSON.stringify(newData) === JSON.stringify(oldData);
}

export async function earthquake_emergency() {
    try {
        const rawData = await fetchEarthquakeData();
        
        if (!rawData) {
            data_system = 0;
            return 0;
        }

        const transformedData = transformEarthquakeData(rawData);
        console.log(transformedData);

        if (isDataEqual(transformedData, lastData)) {
            data_system = 0;
            return 0;
        }

        lastData = transformedData;
        if (transformedData.length > 0) {
            data_system = transformedData[0].fcTp;
        }
        return 1;
    } catch (error) {
        console.error(`Error in earthquake_emergency: ${error}`);
        return 0;
    }
}

export { data_system };
