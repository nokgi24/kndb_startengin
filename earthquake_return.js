import { fetchEarthquakeData } from './earthquake.js';
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

       

        if (isDataEqual(rawData, lastData)) {
            data_system = 0;
            return 0;
        }

        lastData = rawData;
        if (rawData.length > 0) {
            data_system = rawData[0].fcTp;
            console.log(rawData[0].fcTp);

        }
        return 1;
    } catch (error) {
        console.error(`Error in earthquake_emergency: ${error}`);
        return 0;
    }
}

export { data_system };
