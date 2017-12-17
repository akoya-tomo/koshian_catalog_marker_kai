/* globals MESSAGE_ID_CHECK_THREAD,MESSAGE_ID_LOAD_THREAD,MESSAGE_ID_LOAD_CATALOG*/
/* globals getBoardName,getThreadName*/

//console.log("cat.js  1.0.1");

class Thread{
    constructor(td, font, thread_name, res_num){
        this.td=td;
        this.font=font;
        this.name=thread_name;
        this.num = res_num;
    }
}

const DEFAULT_MARKER_STYLE = "border:2px solid #400080"
let marker_style = DEFAULT_MARKER_STYLE;
let thread_map = [];

function getThreadNameAndResNumList(list){
    return list.map((value, index, array) => {
        return {name:value.name,num:value.num};
    });
}

function isCatalog(){
    return window.location.search.match(/mode=cat/) != null;
}

function build(){
    let name = "";
    let num = 0;
    let font = {};

    let td_list = document.getElementsByTagName("td");
    if(td_list == null){
        return;
    }

    for(let i=0;i<td_list.length;++i){
        // find names
        {
            let elems = td_list[i].getElementsByTagName("a");
            if(elems.length == 0){
                continue;
            }
    
            name = elems.item(0).getAttribute("href").match(/res\/([0-9]+).htm/)[1];
            if(name == null){
                continue;
            }
        }

        // find reses
        {
            let elems = td_list[i].getElementsByTagName("font");
            if(elems.length == 0){
                continue;
            }

            font = elems.item(0);
    
            num = Number(font.textContent);
        }

        thread_map.push(new Thread(td_list[i], font, name, num));
        //console.log(`th[${name}] : ${num}`)
    }
}

function markThread(info){
    for(let i=0;i<thread_map.length;++i){
        let th = thread_map[i];

        if(th.name == info.thread_name){
            th.td.setAttribute("style", marker_style);
            break;
        }
    }
}

function markOpenedThreads(response){
    //let t0 = new Date();
    let opened_thread_names = response.opened_thread_names;
    let new_response_nums = response.new_response_nums;
    //console.log(`increate list length:${new_response_nums.length}`)

    for(let i = 0 ;i < thread_map.length ; ++i){
        let th = thread_map[i];

        for(let j = 0; j < opened_thread_names.length; ++j){
            if(th.name == opened_thread_names[j]){
                th.td.setAttribute("style", marker_style);
            }
        }

        for(let j = 0; j < new_response_nums.length; ++j){
            if(th.name == new_response_nums[j].name){
                let elem = document.createElement("font");
                elem.setAttribute("color", "#ff0000");
                elem.setAttribute("size", "2");            
                elem.textContent=`+${new_response_nums[j].increase}`;
                th.td.appendChild(elem);
            }
            
            //console.log(`thread[${new_response_nums[j].name}] + ${new_response_nums[j].increase}`)
            //console.log(new_response_nums[j]);
        }
    }

    //let t1 = new Date();
    //console.log(`mark thread take:${t1.getTime() - t0.getTime()}ms`);
    //console.log(`marked opened threads`);
}

function onGetMarkerStyle(result){
    marker_style = result.marker_style || DEFAULT_MARKER_STYLE;
}

function onError(error){
    //console.log(`cat.js error`);
    //console.log(error);
}

function onLoad()
{
    if(!isCatalog()){
        return;
    }

    browser.storage.onChanged.addListener((changes, areaName) => {
        if(areaName != "local"){
            return;
        }

        marker_style = changes.marker_style.newValue;
    });

    browser.storage.local.get("marker_style")
        .then(onGetMarkerStyle, onError);

    build();

    // show res nums
    let res_num_list = getThreadNameAndResNumList(thread_map);
    //for(let i = 0; i < res_num_list.length; ++i){
    //    console.log(res_num_list[i]);
    //}
   
    browser.runtime.sendMessage({
        id:MESSAGE_ID_LOAD_CATALOG,
        info:{
            date:new Date(),
            board_name:getBoardName(),
            res_nums:res_num_list
        }
    }).then(markOpenedThreads,onError);
    
    browser.runtime.onMessage.addListener((message, sender, response) => {
        switch(message.id){
        case MESSAGE_ID_CHECK_THREAD:
            //console.log("MESSAGE_ID_CHECK_THREAD");
            markThread(message.info);
            break;
        }
    });


}

onLoad();

//console.log("cat fin");