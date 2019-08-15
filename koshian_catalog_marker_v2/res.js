
const MID_NOTIFY_OPENED_THREAD_TO_BG = 0x21;

browser.runtime.sendMessage({
    id:MID_NOTIFY_OPENED_THREAD_TO_BG,
    host:window.location.host,
    url:`${window.location.host + window.location.pathname}`
});
