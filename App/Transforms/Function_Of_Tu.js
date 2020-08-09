export const get_current_date = () => {
  var today = new Date();

  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today.toString();
}

export const get_current_hour = () => {
  var objToday = new Date();

  var curHour = objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours();
  var curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes();

  return curHour.toString() + ":" + curMinute.toString();
}