import 'dotenv/config';
import request from 'request';
import convert from 'xml-js';

const serviceKey = process.env.Services_KEY;


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
    const numOfRows = 10;
    const pageNo = 1;
    const currentTime = formatDateForAPI(new Date());
    const pastTime = formatDateForAPI(new Date(getPastTimeISOString(3))); 

    const requestUrl = `http://apis.data.go.kr/1360000/EqkInfoService/getEqkMsg?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&fromTmFc=${pastTime}&toTmFc=${currentTime}&dataType=XML`;

    return new Promise((resolve, reject) => {
        request.get(requestUrl, (err, res, body) => {
            if (err) {
                console.log(`Error making request: ${err}`);
                return reject(err);
            }

            if (res.statusCode === 200) {
                try {
                    const xmlToJson = convert.xml2json(body, { compact: true, spaces: 4 });
                    
                    const parsedData = JSON.parse(xmlToJson);

                    const resultCode = parsedData.response?.header?.resultCode?._text;

                    if (!parsedData.response?.body || !parsedData.response.body.items || !parsedData.response.body.items.item) {
                        return resolve(null);
                    }

                    resolve(parsedData);

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
    console.log('Fetched Data:', data);
}).catch(error => {
    console.error('Error:', error);
});
