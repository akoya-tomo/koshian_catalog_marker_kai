/* globals MESSAGE_ID_CHECK_THREAD,MESSAGE_ID_LOAD_THREAD,MESSAGE_ID_LOAD_CATALOG*/
/* globals getBoardName,getThreadName*/
/* globals notify*/

//console.log("res.js  1.0.1");

browser.runtime.sendMessage({
    id:MESSAGE_ID_LOAD_THREAD,
    info:{
        date:new Date(),
        board_name:getBoardName(),
        thread_name:getThreadName()
    }
});

//console.log("res.js fin");
