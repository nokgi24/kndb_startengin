
import convert from 'xml-js'; 

export function transformEarthquakeData(parsedData) {


    const firstData = parsedData?.response?.body;

   
    
    // 데이터 구조 수정
    const responseBody = firstData;

    const items = Array.isArray(responseBody.items.item) ? responseBody.items.item : [responseBody.items.item];
    
    return items.map(item => ({
        numOfRows: responseBody.numOfRows?._text || responseBody.numOfRows || null,
        pageNo: responseBody.pageNo?._text || responseBody.pageNo || null,
        totalCount: responseBody.totalCount?._text || responseBody.totalCount || null,
        resultCode: responseBody.resultCode?._text || responseBody.resultCode || null,
        resultMsg: responseBody.resultMsg?._text || responseBody.resultMsg || null,
        dataType: responseBody.dataType?._text || responseBody.dataType || null,
        stnId: item.stnId?._text || item.stnId || null,
        fcTp: item.fcTp?._text || item.fcTp || null,
        img: item.img?._text || item.img || null,
        tmFc: item.tmFc?._text || item.tmFc || null,
        tmSeq: item.tmSeq?._text || item.tmSeq || null,
        cnt: item.cnt?._text || item.cnt || null,
        tmEqk: item.tmEqk?._text || item.tmEqk || null,
        tmMsc: item.tmMsc?._text || item.tmMsc || null,
        lat: item.lat?._text || item.lat || null,
        lon: item.lon?._text || item.lon || null,
        loc: item.loc?._text || item.loc || null,
        mt: item.mt?._text || item.mt || null,
        inT: item.inT?._text || item.inT || null,
        dep: item.dep?._text || item.dep || null,
        rem: item.rem?._text || item.rem || null,
        cor: item.cor?._text || item.cor || null,
    }));
}
