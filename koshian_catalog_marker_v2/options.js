const DEFAULT_OLD_MARK_COUNT = 10;
const DEFAULT_OLD_COLOR = "#cc3333";
const DEFAULT_OPENED_COLOR = "#660099"
const DEFAULT_OLD_OPENED_COLOR = "#339933";
const DEFAULT_FRAME_THICKNESS = 4;
const DEFAULT_RESPONSE_INCREASE_COLOR = "#cc3333";
const DEFAULT_RESPONSE_INCREASE_SIZE = 12;
const DEFAULT_MAX_DATA_NUM = 1024;

function getValueSafely(value, default_value) {
  if (value === undefined) {
    return default_value;
  } else {
    return value;
  }
}

function saveOptions(e) {
  e.preventDefault();

  browser.storage.local.set({
    oldMarkCount: document.querySelector("#old_mark_count").value,
    oldColor: document.querySelector("#old_color").value,
    openedColor: document.querySelector("#opened_color").value,
    oldOpenedColor: document.querySelector("#old_opened_color").value,
    frameThickness: document.querySelector("#frame_thickness").value,
    responseIncreaseColor: document.querySelector("#response_increase_color").value,
    responseIncreaseSize: document.querySelector("#response_increase_size").value,
    maxDataNum: document.querySelector("#max_data_num").value,
  });
}

function setCurrentChoice(result) {
  document.querySelector("#old_mark_count").value = getValueSafely(result.oldMarkCount, DEFAULT_OLD_MARK_COUNT);
  document.querySelector("#old_color").value = getValueSafely(result.oldColor, DEFAULT_OLD_COLOR);
  document.querySelector("#opened_color").value = getValueSafely(result.openedColor, DEFAULT_OPENED_COLOR);
  document.querySelector("#old_opened_color").value = getValueSafely(result.oldOpenedColor, DEFAULT_OLD_OPENED_COLOR);
  document.querySelector("#frame_thickness").value = getValueSafely(result.frameThickness, DEFAULT_FRAME_THICKNESS);
  document.querySelector("#response_increase_color").value = getValueSafely(result.responseIncreaseColor, DEFAULT_RESPONSE_INCREASE_COLOR);
  document.querySelector("#response_increase_size").value = getValueSafely(result.responseIncreaseSize, DEFAULT_RESPONSE_INCREASE_SIZE);
  document.querySelector("#max_data_num").value = getValueSafely(result.maxDataNum, DEFAULT_MAX_DATA_NUM);
}

function onError(error) {
}

function restoreOptions() {
  browser.storage.local.get().then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);