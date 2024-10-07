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

        if (!rawData || typeof rawData !== 'object') {
            console.error('Invalid or missing rawData:', rawData);
            data_system = 0; 
            return 0; 
        }

        if (isDataEqual(rawData, lastData)) {
            data_system = 0; 
            return 0; 
        }

        if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].fcTp) {
            lastData = rawData; 
            data_system = rawData[0].fcTp; 
            console.log('New data system:', data_system);
            return 1;
        } else {
            console.error('Unexpected data format or missing fcTp:', rawData[0].fcTp);
            data_system = 0; 
            return 0; 
        }
    } catch (error) {
        console.error(`Error in earthquake_emergency: ${error}`);
        data_system = 0; 
        return 0; 
    }
}

export { data_system };


