
import convert from 'xml-js'; 

export function transformEarthquakeData(parsedData) {
    // 데이터가 배열 형태로 들어오므로 첫 번째 요소를 가져옵니다.
    const firstData = Array.isArray(parsedData) ? parsedData[0] : parsedData;

    if (!firstData || !firstData.response || !firstData.response.body) {
        console.warn('Invalid data format:', parsedData);
        return [];
    }
    
    const { response } = firstData;
    const { body: responseBody } = response;

    const items = Array.isArray(responseBody.items.item) ? responseBody.items.item : [responseBody.items.item];

    return items.map(item => ({
        numOfRows: responseBody.numOfRows || null,
        pageNo: responseBody.pageNo || null,
        totalCount: responseBody.totalCount || null,
        resultCode: responseBody.resultCode || null,
        resultMsg: responseBody.resultMsg || null,
        dataType: responseBody.dataType || null,
        stnId: item.stnId || null,
        fcTp: item.fcTp || null,
        img: item.img || null,
        tmFc: item.tmFc || null,
        tmSeq: item.tmSeq || null,
        cnt: item.cnt || null,
        tmEqk: item.tmEqk || null,
        tmMsc: item.tmMsc || null,
        lat: item.lat || null,
        lon: item.lon || null,
        loc: item.loc || null,
        mt: item.mt || null,
        inT: item.inT || null,
        dep: item.dep || null,
        rem: item.rem || null,
        cor: item.cor || null,
    }));
}
