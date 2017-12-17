function saveOptions(e) {
    e.preventDefault();

    browser.storage.local.set({
      marker_style:document.querySelector("#marker_style").value
    });
  }
  
  function setCurrentChoice(result) {
    document.querySelector("#marker_style").value = result.marker_style || `border:2px solid #400080`;
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