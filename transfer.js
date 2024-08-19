
import convert from 'xml-js'; 

export function transformEarthquakeData(parsedData) {
    if (!parsedData || !parsedData.response || !parsedData.response.body) {
        console.warn('Invalid data format:', parsedData);
        return [];
    }
    
    const { response } = parsedData;
    const { body: responseBody } = response;

    const items = Array.isArray(responseBody.items.item) ? responseBody.items.item : [responseBody.items.item];

    return items.map(item => ({
        numOfRows: getText(responseBody.numOfRows),
        pageNo: getText(responseBody.pageNo),
        totalCount: getText(responseBody.totalCount),
        resultCode: getText(responseBody.resultCode),
        resultMsg: getText(responseBody.resultMsg),
        dataType: getText(responseBody.dataType),
        stnId: getText(item.stnId),
        fcTp: getText(item.fcTp),
        img: getText(item.img),
        tmFc: getText(item.tmFc),
        tmSeq: getText(item.tmSeq),
        cnt: getText(item.cnt),
        tmEqk: getText(item.tmEqk),
        tmMsc: getText(item.tmMsc),
        lat: getText(item.lat),
        lon: getText(item.lon),
        loc: getText(item.loc),
        mt: getText(item.mt),
        inT: getText(item.inT),
        dep: getText(item.dep),
        rem: getText(item.rem),
        cor: getText(item.cor),
    }));
}
