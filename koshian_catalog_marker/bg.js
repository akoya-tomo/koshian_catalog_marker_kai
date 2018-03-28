/* globals MESSAGE_ID_CHECK_THREAD,MESSAGE_ID_LOAD_THREAD,MESSAGE_ID_LOAD_CATALOG,MESSAGE_ID_NOTIFY*/
/* globals notify,getBoardName,getThreadName*/

//console.log("bg.js 1.0.1");

let ADJUST_PERIOD = 1000*60*10;
let MAX_CATALOG_TIME = 1000*60*60;
let MAX_TAB_TIME = 1000*60*60;
let MAX_THREAD_TIME = 1000*60*60;
let MAX_RES_TIME = 1000*60*60;

let catalog_map = [];
let g_last_tab_id = 0;

class Updatable
{
    constructor(date, value){
        this.date = date;
        this.value = value;
    }

    static register(list, date, value){
        for(let i = 0; i < list.length; ++i){
            if(list[i].value == value){
                list[i].date = date;
                return;
            }
        }

        list.push(new Updatable(date, value));
    }

    static adjust(list, date, time_limit){
        list = list.filter((item, index, array) => {
            return (date.getTime() - item.date.getTime() < time_limit);
        });
    }

    static getValueList(list){
        return list.map((item, index, array) => {
            return item.value;
        });
    }

    static getPickupedList(list, pickup_func){
        return list.map((item, index, array) => {
            return pickup_func(item.value);
        });
    }
}

function compRes(res0, res1){
    return res0.name == res1.name;
}

class Catalog{
    constructor(date, board_name, tab_id, res_num_list){
        this.date = date;
        this.name = board_name;
        this.tabs = [];
        this.threads = [];
        this.res_nums = [];
        
        Updatable.register(this.tabs, date, tab_id);

        for(let i = 0; i < res_num_list.length; ++i){
            this.res_nums.push(new Updatable(date,{name:res_num_list[i].name,num:res_num_list[i].num}));
        }
    }

    registerTab(date, tab_id){
        Updatable.register(this.tabs, date, tab_id);
    }

    registerThread(date, thread_name){
        Updatable.register(this.threads, date, thread_name);
    }

    updateResponseNums(date, res_num_list){
        let increases = [];

        for(let i = 0; i < res_num_list.length; ++i){
            let res_found = false;

            for(let j = 0; j < this.res_nums.length; ++j){
                if(this.res_nums[j].value.name == res_num_list[i].name){
                    // update thread date
                    this.res_nums[j].value.date = res_num_list[i].date;

                    //
                    let inc = res_num_list[i].num - this.res_nums[j].value.num;
                    if(inc > 0){
                        increases.push({name:this.res_nums[j].value.name, increase:inc});
                    }
                    this.res_nums[j].value.num = res_num_list[i].num;

                    //
                    res_found=true;
                    break;
                }
            }

            if(!res_found){
                this.res_nums.push(new Updatable(date,{name:res_num_list[i].name,num:res_num_list[i].num}));
            }
        }

        return increases;
    }

    adjust(date, max_tab_time, max_thread_time){
        Updatable.adjust(this.tabs, date, max_tab_time);
        Updatable.adjust(this.threads, date, max_thread_time);
        Updatable.adjust(this.res_nums, date, MAX_RES_TIME);
    }

    getLastUpdate(){
        return this.date;
    }

    getActiveTabs(){
        return Updatable.getValueList(this.tabs);
    }

    getOpenedThreads(){
        return Updatable.getValueList(this.threads);
    }

    showLog(){
        //notify(g_last_tab_id,`name:${this.name}`);
        //notify(g_last_tab_id,`    tabs.length:${this.tabs.length}`);
        //notify(g_last_tab_id,`    threads.length:${this.threads.length}`);
        //notify(g_last_tab_id,`    res_nums.length:${this.res_nums.length}`);
    }

    static getByName(list, board_name){
        for(let i=0; i<list.length; ++i){
            if(list[i].name == board_name){
                return list[i];
            }
        }

        return null;
    }
}

function onLoadThread(info){
    if(info.board_name == null){
        return;
    }

    let catalog = Catalog.getByName(catalog_map, info.board_name);
    if(catalog == null){
        return;
    }

    catalog.registerThread(info.date, info.thread_name)

    let tab_id_list = catalog.getActiveTabs();
    
    for(let i=0; i<tab_id_list.length; ++i){        
        browser.tabs.sendMessage(
            tab_id_list[i],{
                id:MESSAGE_ID_CHECK_THREAD,
                info:{
                    thread_name:info.thread_name
                }
            }
        );
    }
}

function registerCatalog(info, tab_id, response){
    catalog_map.push(new Catalog(info.date, info.board_name, tab_id, info.res_nums));

    response({
        opened_thread_names:[],
        new_response_nums:[]
    });
}

function updateCatalog(catalog, info, tab_id, response){
    catalog.registerTab(info.date, tab_id);
    let increases = catalog.updateResponseNums(info.date, info.res_nums);

    response({
        opened_thread_names:catalog.getOpenedThreads(),
        new_response_nums:increases
    });
}

function onLoadCatalog(info, tab_id, response){
    g_last_tab_id = tab_id;
    
    let catalog = Catalog.getByName(catalog_map, info.board_name);

    if(catalog == null){
        registerCatalog(info, tab_id, response);
    }else{
        updateCatalog(catalog, info, tab_id, response);
    }    
}

function onError(error){

}

function onGetSettings(result){

}

function onChangeSetting(changes, areaName){
    if(areaName != "local"){
        return;
    }
}

browser.storage.onChanged.addListener(onChangeSetting);

browser.storage.local.get("").then(onGetSettings, onError);

browser.runtime.onMessage.addListener((message, sender, response) => {
    switch(message.id){
    case MESSAGE_ID_LOAD_THREAD:
        onLoadThread(message.info);
        break;
    case MESSAGE_ID_LOAD_CATALOG:
        onLoadCatalog(message.info, sender.tab.id, response);
        break;
    }
});

setInterval(() => {
    let date = new Date();

    catalog_map = catalog_map.filter((catalog, index, array) => {
        //catalog.showLog();
        catalog.adjust(date, MAX_TAB_TIME, MAX_THREAD_TIME);
        return ((date.getTime() - catalog.getLastUpdate().getTime()) < MAX_CATALOG_TIME);
    });

}, ADJUST_PERIOD);