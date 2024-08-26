import 'dotenv/config';
import request from 'request';
import convert from 'xml-js';


const serviceKey = 'M32SirZ7RxVajtKade1bvVHMsgQauKkVdVVL3q9uRXfDg0Xs0GBqeBUQ554GA8LrS7F%2FLF1KrgKEGFb8rayaSA%3D%3D';

function getPastTimeISOString(days) {
    const past = new Date();
    past.setDate(past.getDate() - days);
    return past.toISOString();
}

function formatDateForAPI(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

export function fetchEarthquakeData() {
    const numOfRows = 1;
    const pageNo = 1;
    const currentTime = formatDateForAPI(new Date());
    const pastTime = formatDateForAPI(new Date(getPastTimeISOString(3))); 

    const requestUrl = `http://apis.data.go.kr/1360000/EqkInfoService/getEqkMsg?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&fromTmFc=${pastTime}&toTmFc=${currentTime}&dataType=XML`;

    return new Promise((resolve, reject) => {
        request.get(requestUrl, (err, res, body) => {
            if (err) {
                console.log(`Request error: ${err}`);
                return reject(err);
            }

            console.log(`API Response Status Code: ${res.statusCode}`);

            if (res.statusCode === 200) {
                try {
                    const xmlToJson = convert.xml2json(body, { compact: true, spaces: 4 });
                    const parsedData = JSON.parse(xmlToJson);
                    
                  
                } catch (parseError) {
                    console.error(`Parse Error: ${parseError}`);
                    reject(parseError);
                }
            } else {
                console.error(`HTTP Error: ${res.statusCode}`);
                reject(new Error(`HTTP Error: ${res.statusCode}`));
            }
        });
    });
}


fetchEarthquakeData().then(data => {
    
}).catch(error => {
    console.error('Error:', error);
});

