
import convert from 'xml-js'; 

export function transformEarthquakeData(parsedData) {
    // 데이터가 배열 형태로 들어오므로 첫 번째 요소를 가져옵니다.
    const firstData = Array.isArray(parsedData) ? parsedData[0] : parsedData;

    if (!firstData || !firstData.response || !firstData.response.body) {
        console.warn('Invalid data format:', parsedData);
        console.log(fcTp);

        return [];
    }
    
    const { response } = firstData;
    const { body: responseBody } = response;

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
