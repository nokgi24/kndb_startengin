
import convert from 'xml-js'; 

export function transformEarthquakeData(parsedData) {
    console.log('Raw Parsed Data:', parsedData);

    const firstData = parsedData?.response?.body;

    if (!firstData) {
        console.warn('Invalid data format:', parsedData);
        return [];
    }
    
    // 데이터 구조 수정
    const responseBody = firstData;

    const items = Array.isArray(responseBody.items.item) ? responseBody.items.item : [responseBody.items.item];

    return items.map(item => ({
        numOfRows: responseBody.numOfRows?._text || null,
        pageNo: responseBody.pageNo?._text || null,
        totalCount: responseBody.totalCount?._text || null,
        resultCode: responseBody.resultCode?._text || null,
        resultMsg: responseBody.resultMsg?._text || null,
        dataType: responseBody.dataType?._text || null,
        stnId: item.stnId?._text || null,
        fcTp: item.fcTp?._text || null,
        img: item.img?._text || null,
        tmFc: item.tmFc?._text || null,
        tmSeq: item.tmSeq?._text || null,
        cnt: item.cnt?._text || null,
        tmEqk: item.tmEqk?._text || null,
        tmMsc: item.tmMsc?._text || null,
        lat: item.lat?._text || null,
        lon: item.lon?._text || null,
        loc: item.loc?._text || null,
        mt: item.mt?._text || null,
        inT: item.inT?._text || null,
        dep: item.dep?._text || null,
        rem: item.rem?._text || null,
        cor: item.cor?._text || null,
    }));
}
