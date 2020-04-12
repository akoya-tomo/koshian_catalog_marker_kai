const DEFAULT_USE_OLD_SORT = false;
const DEFAULT_OLD_MARK_COUNT = 10;
const DEFAULT_USE_RESPONSE_NUMBER = true;
const DEFAULT_MARKING_INTERVAL = 3;
const DEFAULT_OLD_COLOR = "#cc3333";
const DEFAULT_OPENED_COLOR = "#660099";
const DEFAULT_OLD_OPENED_COLOR = "#339933";
const DEFAULT_FRAME_THICKNESS = 4;
const DEFAULT_RESPONSE_INCREASE_COLOR = "#cc3333";
const DEFAULT_RESPONSE_INCREASE_SIZE = 12;
const MID_REQUEST_CATALOG_UPDATE = 0x11;
const MID_NOTIFY_OPENED_THREAD_TO_CAT = 0x12;
const DEFAULT_REMAINING_TIME = 5; // 最低保持時間中のスレの残り時間が5分以下になったら「古いスレ」としてマーク
let useOldSort = DEFAULT_USE_OLD_SORT;
let oldMarkCount = DEFAULT_OLD_MARK_COUNT;
let useResponseNumber = DEFAULT_USE_RESPONSE_NUMBER;
let markingInterval = DEFAULT_MARKING_INTERVAL;
let oldColor = DEFAULT_OLD_COLOR;
let openedColor = DEFAULT_OPENED_COLOR;
let oldOpenedColor = DEFAULT_OLD_OPENED_COLOR;
let frameThickness = DEFAULT_FRAME_THICKNESS;
let remainingTime = DEFAULT_REMAINING_TIME;
let maxNum = 0;
let holdTime = 0;
let latestResNo = 0;
let timerInterval = null;

function onError(e) {   // eslint-disable-line no-unused-vars
    //console.log("KOSHIAN_catalog_marker/cat.js error:");
    //console.dir(e);
}

function main(reload = false, sort = false, undo = false, reorder = false) {
    if(window.location.search.indexOf("cat") < 0){
        return;
    }
    let cattable = document.getElementById("cattable") || document.querySelector('body > table[border="1"]');
    if (!cattable) {
        return;
    }

    document.body.setAttribute("__KOSHIAN_catalog_sort", "true");   // KOSHIAN リロード拡張 改へカタログソート可を通知

    markOldThreads(cattable);
    if (useResponseNumber && markingInterval > 0) {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timerInterval = setInterval(() => {
            markOldThreads(cattable);
        }, Math.max(markingInterval, 1) * 60 *1000);
    }

    //
    // listen thread opened
    //
    if (!reload) {
        browser.runtime.onMessage.addListener((message, sender, response) => {
            if (message.id != MID_NOTIFY_OPENED_THREAD_TO_CAT) {
                return;
            }

            let tdList = cattable.getElementsByTagName("td");
            for (let i = 0; i < tdList.length; ++i) {
                let td = tdList.item(i);
                if (td) {
                    let anchor = td.getElementsByTagName("a")[0];
                    if (anchor && anchor.href && message.url == anchor.href.split("://")[1]) {
                        td.setAttribute("opened", "true");
                        let old = td.getAttribute("old");
                        let hold = td.getAttribute("hold");
                        let cssText = "";
                        if ((old === "true" && !hold) || (old && hold === "red")) {
                            cssText = "border: solid " + frameThickness + " " + oldOpenedColor;
                        } else if (old === "expired" && !hold) {
                            cssText = "border: dotted " + frameThickness + " " + oldOpenedColor;
                        } else {
                            cssText = "border: solid " + frameThickness + " " + openedColor;
                        }
                        td.style.cssText += cssText;
                        break;
                    }
                }
            }
            response();
        });
    }

    //
    // url,レス数のリストを作る
    //
    let tdList = cattable.getElementsByTagName("td");
    let requestDataList = [];
    for (let i = 0; i < tdList.length; ++i) {
        let td = tdList.item(i);
        let anchors = td.getElementsByTagName("a");
        let url = anchors.length ? (anchors.item(0).href ? anchors.item(0).href.split("://")[1] : null) : null;
        let fonts = td.getElementsByTagName("font");
        let count = fonts.length ? Number(fonts.item(0).textContent) : 0;

        requestDataList.push({
            url: url,
            count: count,
            opened: false
        });
    }

    if (requestDataList.length == 1 && requestDataList[0].url === null) {
        // カタログにスレが無い
        if (sort) {
            resetOpacity(cattable);
        }
        return;
    }

    let sortList = [];

    browser.runtime.sendMessage({
        id: MID_REQUEST_CATALOG_UPDATE,
        dataList: requestDataList,
        undo: undo,
        reorder: reorder
    }).then(response => {
        if (response.dataList.length != tdList.length) {
            if (sort) {
                resetOpacity(cattable);
            }
            return;
        }

        let newBoard = response.newBoard;

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

            if (data.new && !newBoard) {
                responseIncrease.textContent = " New";
            } else if (data.increase > 0 && !newBoard) {
                responseIncrease.textContent = ` +${data.increase}`;
            } else {
                responseIncrease.textContent = ``;
            }

            td.setAttribute("opened", `${data.opened}`);
            if (data.opened) {
                let old = td.getAttribute("old");
                let hold = td.getAttribute("hold");
                let cssText = "";
                if ((old === "true" && !hold) || (old && hold === "red")) {
                    cssText = "border: solid " + frameThickness + " " + oldOpenedColor;
                } else if (old === "expired" && !hold) {
                    cssText = "border: dotted " + frameThickness + " " + oldOpenedColor;
                } else {
                    cssText = "border: solid " + frameThickness + " " + openedColor;
                }
                td.style.cssText += cssText;
            }

            td.setAttribute("new", `${data.new}`);

            if (sort) {
                sortList.push({
                    resInc : data.increase,
                    tdIndex : i
                });
            }
        }

        if (!sort) {
            if (reorder) {
                resetOpacity(cattable);
            }
            return;
        }
        // レス増加順ソート
        sortList.sort(function (a, b) {
            return b.resInc - a.resInc;
        });
        let trs = cattable.getElementsByTagName("tr");
        if (!trs) {
            resetOpacity(cattable);
            return;
        }
        let catColNum = trs[0].getElementsByTagName("td").length;   // カタログの一行当たりのスレ数

        let newTbody = document.createElement("tbody");
        let index = 0;
        for (let i = 0; i < trs.length; ++i) {
            let newTr = document.createElement("tr");
            for (let j = 0; j < catColNum; ++j) {
                newTr.appendChild(tdList[sortList[index].tdIndex].cloneNode(true));
                ++index;
                if (index >= sortList.length) {
                    break;
                }
            }
            newTbody.appendChild(newTr);
        }
        cattable.textContent = null; // カタログテーブルの子要素を全削除
        cattable.appendChild(newTbody);

        document.dispatchEvent(new CustomEvent("KOSHIAN_cat_reload", {
            detail: {
                sorted: true
            }
        }));

    }, onError);
}

/**
 * 古いスレをマークする
 * @param {Element} cattable カタログのテーブル要素(#cattable) 
 */
function markOldThreads(cattable) {
    if (useOldSort) {
        // 古い順のスレッドリストを取得
        let xml = new XMLHttpRequest();
        xml.open("GET", `${window.location.protocol + "//" + window.location.host + window.location.pathname + "?mode=cat&sort=2"}`);
        xml.responseType = "document";
        xml.onload = () => {
            if (xml.status != 200) {
                return;
            }

            let curThreadList = cattable.getElementsByTagName("a");
            let sortedCattable = xml.responseXML.getElementById("cattable") || xml.responseXML.querySelector('body > table[border="1"]');
            let sortedThreadList = sortedCattable.getElementsByTagName("a");
            for (let i = 0; i < Math.min(oldMarkCount, sortedThreadList.length); ++i) {
                let sorted = sortedThreadList.item(i);
                for (let j = 0; j < curThreadList.length; ++j) {
                    let cur = curThreadList.item(j);
                    if (cur.href == sorted.href) {
                        cur.parentElement.setAttribute("old", "true");
                        if (cur.parentElement.getAttribute("opened") == "true") {
                            cur.parentElement.style.cssText += "border: solid " + frameThickness + " " + oldOpenedColor;
                        }
                        break;
                    }
                }
            }
        };
        xml.onerror = (e) => {
            onError(e);
        };
        xml.send();
    } else if (useResponseNumber) {
        // 0ページから最新のレスNo.を取得
        let boardPath = window.location.pathname.match(/^\/([^/]+)\/futaba.php/);
        if (boardPath) {
            let xml = new XMLHttpRequest();
            xml.open("GET", `${window.location.protocol + "//" + window.location.host + "/" + boardPath[1] + "/futaba.htm"}`);
            xml.responseType = "document";
            xml.onload = () => {
                if (xml.status != 200) {
                    return;
                }

                let normalDoc = xml.responseXML;

                let ftb2 = normalDoc.getElementsByClassName("ftb2")[0];
                if (ftb2) {
                    // 保存数取得
                    let matches = ftb2.textContent.match(/この板の保存数は(\d+)件です/);
                    if (matches) {
                        let NewMaxNum = matches ? parseInt(matches[1], 10) : 0;
                        if (maxNum != NewMaxNum && NewMaxNum > 0) {
                            maxNum = NewMaxNum;
                            console.debug("KOSHIAN_catalog_marker/cat.js - maxNum: " + maxNum);
                        }
                    }
                    // 保持時間取得
                    matches = ftb2.textContent.match(/最低(\d+時間)?(\d+分)?保持/);
                    if (matches) {
                        let hour = matches[1] ? parseInt(matches[1], 10) : 0;
                        let minute = matches[2] ? parseInt(matches[2], 10) : 0;
                        let newHoldTime = (hour * 60 + minute) * 60000;
                        if (holdTime != newHoldTime) {
                            holdTime = newHoldTime;
                            console.debug("KOSHIAN_catalog_marker/cat.js - holdTime: " + (holdTime / 60000) + "min");
                        }
                    }
                }

                if (!maxNum) {
                    // 保存数の取得に失敗したときは「古順」でマークする
                    console.debug("KOSHIAN_catalog_marker/cat.js - maxNum not found");
                    useOldSort = true;
                    useResponseNumber = false;
                    markOldThreads(cattable);
                    return;
                }

                // 0ページ内の最新レスNo.取得
                let normalThreadList = normalDoc.getElementsByClassName("thre");
                for (let normalThread of normalThreadList) {
                    let resNo = getLatestResponseNumber(normalThread);
                    if (resNo) {
                        latestResNo = resNo > latestResNo ? resNo : latestResNo;
                        break;
                    }
                }

                let curTdList = cattable.getElementsByTagName("td");
                let curTime = Date.now();

                for (let i = 0; i < curTdList.length; ++i) {
                    let td = curTdList[i];
                    if (!td) {
                        break;
                    }

                    let anchor = td.getElementsByTagName("a")[0];
                    if (!anchor) {
                        continue;
                    }

                    let matches = anchor.href.match(/res\/(\d+)\.htm$/);
                    if (matches) {
                        let curResNo = parseInt(matches[1], 10);
                        if (curResNo > latestResNo) {
                            latestResNo = curResNo;
                        }
                        if (latestResNo - curResNo > maxNum) {
                            // スレ消滅
                            td.setAttribute("old", "expired");
                        } else if (latestResNo- curResNo > maxNum * 9 / 10) {
                            // 消滅直前
                            td.setAttribute("old", "true");
                        } else {
                            td.removeAttribute("old");
                        }
                    }

                    if (holdTime > 0) {
                        let img = td.getElementsByTagName("img")[0];
                        if (img) {
                            let matches = img.src.match(/\/(\d+)s\.jpg$/);
                            if (matches) {
                                let threadTime = parseInt(matches[1], 10);
                                if (curTime - threadTime > holdTime) {
                                    // 保持時間超過
                                    td.removeAttribute("hold");
                                } else if (curTime - threadTime > holdTime - remainingTime * 60 * 1000) {
                                    // 保持時間直前
                                    td.setAttribute("hold", "red");
                                } else {
                                    // 保持時間内
                                    td.setAttribute("hold", "true");
                                }
                            }
                        }
                    }

                    if (td.getAttribute("opened") == "true") {
                        // futaba thread highlighter K用にstyleを書き込み
                        let old = td.getAttribute("old");
                        let hold = td.getAttribute("hold");
                        let cssText = "";
                        if ((old === "true" && !hold) || (old && hold === "red")) {
                            cssText = "border: solid " + frameThickness + " " + oldOpenedColor;
                        } else if (old === "expired" && !hold) {
                            cssText = "border: dotted " + frameThickness + " " + oldOpenedColor;
                        } else {
                            cssText = "border: solid " + frameThickness + " " + openedColor;
                        }
                        td.style.cssText += cssText;
                    }
                }
            };
            xml.onerror = (e) => {
                onError(e);
            };
            xml.send();
        } else {
            // 板のパス名の取得に失敗したときは「古順」でマークする
            console.debug("KOSHIAN_catalog_marker/cat.js - boardPath not found");
            useOldSort = true;
            useResponseNumber = false;
            markOldThreads(cattable);
            return;
        }
    }
}

/**
 * 最新レスNo.取得
 * @param {Element} threadElement スレの要素(.thre)
 * @return {number} 最新レスNo.
 *     見つからない時は0を返す
 */
function getLatestResponseNumber(threadElement) {
    let resNo = 0;
    let rtdList = threadElement.getElementsByClassName("rtd");
    let rtdNum = rtdList.length;
    if (rtdNum > 0) {
        resNo = getResponseNumber(rtdList[rtdNum - 1]);
    }
    if (resNo == 0) {
        let dataRes = threadElement.getAttribute("data-res");
        resNo = dataRes ? parseInt(dataRes, 10) : getResponseNumber(threadElement);
    }
    return resNo;
}

/**
 * レスNo.取得
 * @param {Element} resElement レスの要素(.rtd or .thre)
 * @return {number} レスNo. 
 *     見つからない時は0を返す
 */
function getResponseNumber(resElement) {
    for (let node = resElement.firstChild; node; node = node.nextSibling) {
        if (node.nodeName == "BLOCKQUOTE") {
            break;
        } else if (node.nodeType == Node.TEXT_NODE) {
            // 旧レスNo.取得
            let matches = node.nodeValue.match(/No\.(\d+)/);
            if (matches) {
                return parseInt(matches[1], 10);
            }
        } else if (node.className == "cno") {
            // 新レスNo.取得（2019/11～）
            let resNo = parseInt(node.textContent.replace("No.", ""), 10);
            if (resNo > 0) {
                return resNo;
            }
        }
    }
    return 0;
}

/**
 * カタログtableのtbodyの透明度を元に戻す
 * @param {HTMLElement} cattable カタログのtable要素
 */
function resetOpacity(cattable) {
    let tbody = cattable.firstChild;
    if (tbody) {
        try {
            tbody.style.opacity = 1;
        } catch (e) {
            // tbodyのプロパティのアクセスに失敗したときはcloneに書き換える(KOSHIAN リロード拡張 改 v2.2.2以前用)
            let tbodyClone = tbody.cloneNode(true);
            cattable.textContent = null;    // カタログテーブルの子要素を全削除
            cattable.append(tbodyClone);
            tbodyClone.style.opacity = 1;
        }
    }

    document.dispatchEvent(new CustomEvent("KOSHIAN_cat_reload", {
        detail: {
            sorted: true
        }
    }));
}

function getValueSafely(value, default_value) {
    return value === undefined ? default_value : value;
}

browser.storage.local.get().then((result) => {
    useOldSort = getValueSafely(result.useOldSort, DEFAULT_USE_OLD_SORT);
    oldMarkCount = getValueSafely(result.oldMarkCount, DEFAULT_OLD_MARK_COUNT);
    useResponseNumber = getValueSafely(result.useResponseNumber, DEFAULT_USE_RESPONSE_NUMBER);
    markingInterval = getValueSafely(result.markingInterval, DEFAULT_MARKING_INTERVAL);
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

document.addEventListener("KOSHIAN_cat_reload", (e) => {
    if (e.detail && e.detail.sorted) {
        // ソート後の呼び出しは無視
        return;
    }
    main(true);
});

document.addEventListener("KOSHIAN_cat_sort", (e) => {
    if (e.detail === true) {
        // KOSHIAN リロード拡張 改 v2.2.2以前
        main(true, true, true); // UNDO処理
    } else if (e.detail === false) {
        main(true, true);   // ソート処理
    } else {
        // KOSHIAN リロード拡張 改 v2.3.0以降
        main(true, (e.detail & 1) > 0, (e.detail & 2) > 0, (e.detail & 4) > 0);
    }
});
