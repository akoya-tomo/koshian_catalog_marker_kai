
const MID_REQUEST_CATALOG_UPDATE = 0x11;
const MID_NOTIFY_OPENED_THREAD_TO_CAT = 0x12;
const MID_NOTIFY_OPENED_THREAD_TO_BG = 0x21;
const DEFAULT_MAX_DATA_NUM = 1024;
let maxDataNum = DEFAULT_MAX_DATA_NUM;
let dataList = {};

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
    new
}
*/

function onError(e) {   // eslint-disable-line no-unused-vars
    //console.log("KOSHIAN_catalog_marker/bg.js error:");
    //console.dir(e);
}

function onThreadOpened(host, url) {
    let name = null;
    let match = url.match(/^https?:\/\/([^.]+)\.2chan.net\/([^/]+)\/res\/\d+\.htm$/);
    if (match) {
        name = `${match[1]}_${match[2]}`;
    } else {
        return;
    }
    if (!dataList[name]) {
        dataList[name] = [];
    }
    let data = dataList[name].find((elem) => {
        return elem.url == url;
    });

    if(data){
        data.opened = true;
    }else{
        dataList[name].push({
            url: url,
            count: 0,
            opened: true
        });
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

let undoDataList = {};
let previousDataList = {};

function onRequestCatalogUpdate(requestDataList, undo, reorder, response) {
    let responseDataList = [];

    let isNewBoard = false;
    let name = null;
    if (requestDataList[0].url) {
        let match = requestDataList[0].url.match(/^https?:\/\/([^.]+)\.2chan.net\/([^/]+)\/res\/\d+\.htm$/);
        if (match) {
            name = `${match[1]}_${match[2]}`;
        } else {
            response({
                dataList: responseDataList,
                newBoard: false
            });
            return;
        }
        if (!dataList[name]) {
            dataList[name] = [];
            isNewBoard = true;
        }
    }

    if (undo) {
        // UNDO
        dataList[name] = undoDataList[name] ? JSON.parse(JSON.stringify(undoDataList[name])) : [];
        previousDataList[name] = JSON.parse(JSON.stringify(dataList[name]));
        if (dataList[name].length === 0) {
            isNewBoard = true;
        }
    } else if (reorder) {
        // [通常順][増加順]切り替え
        dataList[name] = previousDataList[name] ? JSON.parse(JSON.stringify(previousDataList[name])) : [];
    } else {
        // dataListを保存
        undoDataList[name] = previousDataList[name] ? JSON.parse(JSON.stringify(previousDataList[name])) : [];
        previousDataList[name] = JSON.parse(JSON.stringify(dataList[name]));
    }

    for(let i = 0; i < requestDataList.length; ++i){
        let requestData = requestDataList[i];
        let data = dataList[name].find((elem) => {
            return elem.url == requestData.url;
        });

        if(data){
            responseDataList.push({
                increase: requestData.count - data.count,
                opened: data.opened,
                new: false
            });

            data.count = requestData.count;
        }else{
            responseDataList.push({
                increase: requestData.count,
                opened: false,
                new: true
            });

            if (requestData.url && !reorder) {
                dataList[name].push({
                    url: requestData.url,
                    count: requestData.count,
                    opened: false
                });
            }
        }
    }

    if(dataList[name].length > maxDataNum){
        dataList[name].splice(0, (dataList[name].length - maxDataNum));
    }

    response({
        dataList: responseDataList,
        newBoard: isNewBoard
    });
}

function main() {
    browser.runtime.onMessage.addListener((message, sender, response) => {
        switch (message.id) {
            case MID_REQUEST_CATALOG_UPDATE:
                onRequestCatalogUpdate(message.dataList, message.undo, message.reorder, response);
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

    maxDataNum = getValueSafely(changes.maxDataNum.newValue, DEFAULT_MAX_DATA_NUM);
});

browser.storage.local.get().then((result) => {
    maxDataNum = getValueSafely(result.maxDataNum, DEFAULT_MAX_DATA_NUM);
    main();
}, onError);
