
const MID_REQUEST_CATALOG_UPDATE = 0x11;
const MID_NOTIFY_OPENED_THREAD_TO_CAT = 0x12;
const MID_NOTIFY_OPENED_THREAD_TO_BG = 0x21;
const DEFAULT_MAX_DATA_NUM = 1024;
let maxDataNum = DEFAULT_MAX_DATA_NUM;
let dataList = [];

/*
ThreadData{
    url;
    count;
    opened;
}

RequestData{
    url;
    count;
}

ResponseData{
    increase,
    opened,
}
*/

function onError(e) {
}

function onThreadOpened(host, url) {
    let data = dataList.find((elem) => {
        return elem.url == url;
    });

    if(data){
        data.opened = true;
    }else{
        dataList.push({
            url: url,
            count: 0,
            opened: true
        })
    }

    browser.tabs.query({ currentWindow: true })
        .then(tabs => {
            for (let tab of tabs) {
                if (tab.url.indexOf(host, 0) > 0) {
                    browser.tabs.sendMessage(tab.id, {
                        id: MID_NOTIFY_OPENED_THREAD_TO_CAT,
                        url: url
                    });
                }
            }
        }, onError);
}

function onRequestCatalogUpdate(requestDataList, response) {
    let responseDataList = [];

    for(let i = 0; i < requestDataList.length; ++i){
        let requestData = requestDataList[i];
        let data = dataList.find((elem) => {
            return elem.url == requestData.url;
        });

        if(data){
            responseDataList.push({
                increase: requestData.count - data.count,
                opened: data.opened
            });

            data.count = requestData.count;
        }else{
            responseDataList.push({
                increase: 0,
                opened: false
            });

            dataList.push({
                url: requestData.url,
                count: requestData.count,
                opened: false
            });
        }
    }

    if(dataList.length > maxDataNum){
        dataList.splice(0, (dataList.length - maxDataNum));
    }
    
    response({
        dataList: responseDataList
    });
}

function main() {
    browser.runtime.onMessage.addListener((message, sender, response) => {
        switch (message.id) {
            case MID_REQUEST_CATALOG_UPDATE:
                onRequestCatalogUpdate(message.dataList, response);
                break;
            case MID_NOTIFY_OPENED_THREAD_TO_BG:
                onThreadOpened(message.host, message.url);
                response();
                break;
        }
    });
}

function getValueSafely(value, default_value) {
    return value === undefined ? default_value : value;
}

browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName != "local") {
        return;
    }

    maxDataNum = safeGetValue(changes.maxDataNum.newValue, DEFAULT_MAX_DATA_NUM);
});

browser.storage.local.get().then((result) => {
    maxDataNum = getValueSafely(result.maxDataNum, DEFAULT_MAX_DATA_NUM);
    main();
}, onError);
