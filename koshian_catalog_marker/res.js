/* globals MESSAGE_ID_CHECK_THREAD,MESSAGE_ID_LOAD_THREAD,MESSAGE_ID_LOAD_CATALOG*/
/* globals getBoardName,getThreadName*/
/* globals notify*/

//console.log("res.js  1.0.1");

function sendMessage() {
    browser.runtime.sendMessage({
        id:MESSAGE_ID_LOAD_THREAD,
        info:{
            date:new Date(),
            board_name:getBoardName(),
            thread_name:getThreadName()
        }
    });
}

sendMessage();
document.addEventListener("KOSHIAN_reload", (e) => {
    sendMessage();
});

//console.log("res.js fin");
