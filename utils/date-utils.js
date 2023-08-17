const formatDate = date => {
    let month = '' + (date.getMonth() + 1)
    let day = '' + date.getDate()
    let year = date.getFullYear()
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-')
}
const formatTime = date => {
    let hours = '' + date.getHours();
    let minutes = '' + date.getMinutes();
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    return [hours, minutes].join(':');
};

module.exports = {
    formatDate,
    formatTime
}