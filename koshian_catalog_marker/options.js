const DEFAULT_MARKER_STYLE = "border:2px solid #400080";
const DEFAULT_CATALOG_TIME = 1;
const DEFAULT_THREAD_TIME = 1;

function safeGetValue(value, default_value) {
  return value === undefined ? default_value : value;
}

function saveOptions(e) {
    e.preventDefault();

    browser.storage.local.set({
      marker_style:document.querySelector("#marker_style").value,
      catalog_time:document.querySelector("#catalog_time").value,
      thread_time:document.querySelector("#thread_time").value
    });
  }
  
  function setCurrentChoice(result) {
    document.querySelector("#marker_style").value = safeGetValue(result.marker_style, DEFAULT_MARKER_STYLE);
    document.querySelector("#catalog_time").value = safeGetValue(result.catalog_time, DEFAULT_CATALOG_TIME);
    document.querySelector("#thread_time").value = safeGetValue(result.thread_time, DEFAULT_THREAD_TIME);
  }

  function onError(error) {
  //  console.log(`Error: ${error}`);
  }

  function restoreOptions() {
    let getting = browser.storage.local.get();
    getting.then(setCurrentChoice, onError);
  }
  
  document.addEventListener("DOMContentLoaded", restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);