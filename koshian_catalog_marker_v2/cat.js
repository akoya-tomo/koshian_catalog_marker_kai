const DEFAULT_OLD_MARK_COUNT = 10;
const DEFAULT_OLD_COLOR = "#cc3333";
const DEFAULT_OPENED_COLOR = "#660099"
const DEFAULT_OLD_OPENED_COLOR = "#339933";
const DEFAULT_FRAME_THICKNESS = 4;
const DEFAULT_RESPONSE_INCREASE_COLOR = "#cc3333";
const DEFAULT_RESPONSE_INCREASE_SIZE = 12;
const MID_REQUEST_CATALOG_UPDATE = 0x11;
const MID_NOTIFY_OPENED_THREAD_TO_CAT = 0x12;
let oldMarkCount = DEFAULT_OLD_MARK_COUNT;
let oldColor = DEFAULT_OLD_COLOR;
let openedColor = DEFAULT_OPENED_COLOR;
let oldOpenedColor = DEFAULT_OLD_OPENED_COLOR;
let frameThickness = DEFAULT_FRAME_THICKNESS;

function onError(e) {
}

function main(reload = false) {
    if(window.location.search.indexOf("cat") < 0){
        return;
    }

    //
    // 古い順のスレッドリストを取得
    //
    let xml = new XMLHttpRequest();
    xml.open("GET", `${window.location.protocol + "//" + window.location.host + window.location.pathname + "?mode=cat&sort=2"}`);
    xml.responseType = "document";
    xml.onload = (e) => {
        if (xml.status != 200) {
            return;
        }

        let curThreadList = document.getElementsByTagName("table").item(1).getElementsByTagName("a");
        let sortedThreadList = xml.responseXML.getElementsByTagName("table").item(1).getElementsByTagName("a");
        for (let i = 0; i < Math.min(oldMarkCount, sortedThreadList.length); ++i) {
            let sorted = sortedThreadList.item(i);
            for (let j = 0; j < curThreadList.length; ++j) {
                let cur = curThreadList.item(j);
                if (cur.href == sorted.href) {
                    cur.parentElement.setAttribute("old", "true");
                    if (cur.parentElement.getAttribute("opened") == "true") cur.parentElement.style.cssText += "border: solid " + frameThickness + " " + oldOpenedColor;
                    break;
                }
            }
        }
    };
    xml.onerror = (e) => {
        onError(e);
    };
    xml.send();

    //
    // listen thread opened
    //
    if (!reload) {
        browser.runtime.onMessage.addListener((message, sender, response) => {
            if (message.id != MID_NOTIFY_OPENED_THREAD_TO_CAT) {
                return;
            }

            let anchorList = document.getElementsByTagName("table").item(1).getElementsByTagName("a");
            for (let i = 0; i < anchorList.length; ++i) {
                let anchor = anchorList.item(i);
                if (message.url == anchor.href) {
                    anchor.parentElement.setAttribute("opened", "true");
                    if (anchor.parentElement.getAttribute("old") == "true") {
                        anchor.parentElement.style.cssText += "border: solid " + frameThickness + " " + oldOpenedColor;
                    } else {
                        anchor.parentElement.style.cssText += "border: solid " + frameThickness + " " + openedColor;
                    }
                break;
                }
            }
        });
    }

    //
    // url,レス数のリストを作る
    //
    let tdList = document.getElementsByTagName("table").item(1).getElementsByTagName("td");
    let requestDataList = [];
    for (let i = 0; i < tdList.length; ++i) {
        let td = tdList.item(i);
        let url = td.getElementsByTagName("a").item(0).href;
        let count = Number(td.getElementsByTagName("font").item(0).textContent);

        requestDataList.push({
            url: url,
            count: count,
            opened: false
        });
    }

    browser.runtime.sendMessage({
        id: MID_REQUEST_CATALOG_UPDATE,
        dataList: requestDataList
    }).then(response => {
        if (response.dataList.length != tdList.length) {
            return;
        }

        for (let i = 0; i < tdList.length; ++i) {
            let td = tdList.item(i);
            let data = response.dataList[i];

            let responseIncrease = (function() {
                let ret = td.getElementsByClassName("KOSHIAN_response_increase");
                if (ret.length == 0) {
                    ret = document.createElement("span");
                    ret.className = "KOSHIAN_response_increase";
                    return td.appendChild(ret);
                }else{
                    return ret.item(0);
                }
            })();

            if (data.increase > 0) {
                responseIncrease.textContent = ` +${data.increase}`;
            } else {
                responseIncrease.textContent = ``;
            }

            td.setAttribute("opened", `${data.opened}`);
            if (data.opened) {
                if (td.getAttribute("old") == "true") {
                    td.style.cssText += "border: solid " + frameThickness + " " + oldOpenedColor;
                } else {
                    td.style.cssText += "border: solid " + frameThickness + " " + openedColor;
                }
            }
        }
    }, onError);
}

function getValueSafely(value, default_value) {
    return value === undefined ? default_value : value;
}

browser.storage.local.get().then((result) => {
    oldMarkCount = getValueSafely(result.oldMarkCount, DEFAULT_OLD_MARK_COUNT);
    document.documentElement.style.setProperty("--old-color", getValueSafely(result.oldColor, DEFAULT_OLD_COLOR));
    document.documentElement.style.setProperty("--opened-color", getValueSafely(result.openedColor, DEFAULT_OPENED_COLOR));
    document.documentElement.style.setProperty("--old-opened-color", getValueSafely(result.oldOpenedColor, DEFAULT_OLD_OPENED_COLOR));
    document.documentElement.style.setProperty("--frame-thickness", `${getValueSafely(result.frameThickness, DEFAULT_FRAME_THICKNESS)}px`);
    document.documentElement.style.setProperty("--response-increase-color", getValueSafely(result.responseIncreaseColor, DEFAULT_RESPONSE_INCREASE_COLOR));
    document.documentElement.style.setProperty("--response-increase-size", `${getValueSafely(result.responseIncreaseSize, DEFAULT_RESPONSE_INCREASE_SIZE)}px`);
    oldColor = getValueSafely(result.oldColor, DEFAULT_OLD_COLOR);
    openedColor = getValueSafely(result.openedColor, DEFAULT_OPENED_COLOR);
    oldOpenedColor = getValueSafely(result.oldOpenedColor, DEFAULT_OLD_OPENED_COLOR);
    frameThickness = `${getValueSafely(result.frameThickness, DEFAULT_FRAME_THICKNESS)}px`;

    main();
}, onError);

document.addEventListener("KOSHIAN_cat_reload", () => {
    main(true);
});
