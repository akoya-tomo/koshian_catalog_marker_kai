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
const DEFAULT_MAX_DATA_NUM = 1024;

/* eslint indent: ["warn", 2] */

function setDisable() {
  document.querySelector("#old_mark_count").disabled = !document.querySelector("#use_old_sort").checked;
  document.querySelector("#marking_interval").disabled = !document.querySelector("#use_response_number").checked;
}

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
    useOldSort: document.querySelector("#use_old_sort").checked,
    oldMarkCount: document.querySelector("#old_mark_count").value,
    useResponseNumber: document.querySelector("#use_response_number").checked,
    markingInterval: document.querySelector("#marking_interval").value,
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
  document.querySelector("#use_old_sort").checked = getValueSafely(result.useOldSort, DEFAULT_USE_OLD_SORT);
  document.querySelector("#old_mark_count").value = getValueSafely(result.oldMarkCount, DEFAULT_OLD_MARK_COUNT);
  document.querySelector("#use_response_number").checked = getValueSafely(result.useResponseNumber, DEFAULT_USE_RESPONSE_NUMBER);
  document.querySelector("#marking_interval").value = getValueSafely(result.markingInterval, DEFAULT_MARKING_INTERVAL);
  document.querySelector("#old_color").value = getValueSafely(result.oldColor, DEFAULT_OLD_COLOR);
  document.querySelector("#opened_color").value = getValueSafely(result.openedColor, DEFAULT_OPENED_COLOR);
  document.querySelector("#old_opened_color").value = getValueSafely(result.oldOpenedColor, DEFAULT_OLD_OPENED_COLOR);
  document.querySelector("#frame_thickness").value = getValueSafely(result.frameThickness, DEFAULT_FRAME_THICKNESS);
  document.querySelector("#response_increase_color").value = getValueSafely(result.responseIncreaseColor, DEFAULT_RESPONSE_INCREASE_COLOR);
  document.querySelector("#response_increase_size").value = getValueSafely(result.responseIncreaseSize, DEFAULT_RESPONSE_INCREASE_SIZE);
  document.querySelector("#max_data_num").value = getValueSafely(result.maxDataNum, DEFAULT_MAX_DATA_NUM);
  setDisable();
  let radioList = document.querySelectorAll("input[type='radio']");
  for (let radio of radioList) {
    radio.onchange = setDisable;
  }
}

function onError(error) { // eslint-disable-line no-unused-vars
}

function restoreOptions() {
  browser.storage.local.get().then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);