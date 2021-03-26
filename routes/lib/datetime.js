module.exports = {
    toTimestamp: function (date) {
        let getDate = date.split(" ")[0]
        let time = date.split(" ")[1]
        let reversedFormat = getDate.split("/").reverse().join("/")
        let finalDate = reversedFormat + ' ' + time
    
        return new Date(finalDate)
    }
};  