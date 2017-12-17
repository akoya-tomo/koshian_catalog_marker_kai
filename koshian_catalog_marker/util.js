/* globals MESSAGE_ID_CHECK_THREAD,MESSAGE_ID_LOAD_THREAD,MESSAGE_ID_LOAD_CATALOG*/
/* globals getBoardName,getThreadName*/

function getBoardName()
{
    let matches = window.location.pathname.match(/\/([0-9A-Za-z]+)\/.+/);

    if(matches == null){
        //console.log(`${window.location.pathname} is not board`);
        return "";
    }

    return `${location.host}/${matches[1]}`;
}

function getThreadName()
{    
    let matches =  window.location.pathname.match(/\/[0-9A-Za-z]+\/res\/([0-9]+)\.htm/);

    if(matches == null){
        //console.log(`${window.location.pathname} is not res page`);
        return "";
    }
 
    return matches[1];
}

const MESSAGE_ID_CHECK_THREAD =     "MESSAGE_ID_CHECK_THREAD";
const MESSAGE_ID_LOAD_THREAD =      "MESSAGE_ID_LOAD_THREAD";
const MESSAGE_ID_LOAD_CATALOG =     "MESSAGE_ID_LOAD_CATALOG";
const MESSAGE_ID_NOTIFY =           "MESSAGE_ID_NOTIFY";
