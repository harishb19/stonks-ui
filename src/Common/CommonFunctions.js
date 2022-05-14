const getDollarNumber = function (num) {
    if (num === undefined || num === null) return 0
    const s = num.toString().split('.');
    if ((num > 0 && s[0].length <= 5) || (num < 0 && s[0].length <= 6)) return num;
    let unit = Math.floor((num / 10).toFixed(0).toString().length)
    let r = unit % 3
    let x = Math.abs(Number(num)) / Number('1.0e+' + (unit - r)).toFixed(2)
    if (num < 0)
        return "-" + x.toFixed(2)
    return x.toFixed(2)
}
const getDollarText = function (num) {
    if (num === undefined || num === null) return ''
    const s = num.toString().split('.');
    if ((num > 0 && s[0].length <= 5) || (num < 0 && s[0].length <= 6)) return "";
    let units = ["K", "M", "B", "T", "Q"]
    let unit = Math.floor((num / 10).toFixed(0).toString().length)
    return units[Math.floor(unit / 3) - 1]
}

export {getDollarText, getDollarNumber};