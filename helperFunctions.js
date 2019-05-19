function getCourseDaysBoolArray(course) {
    var returnedArray = []
    returnedArray[0] = !!course.sun;
    returnedArray[1] = !!course.mon;
    returnedArray[2] = !!course.tue;
    returnedArray[3] = !!course.wed;
    returnedArray[4] = !!course.thu;
    returnedArray[5] = !!course.fri;
    returnedArray[6] = !!course.sat;
    return returnedArray;
}
function incrementDate(date) {
    date.setDate(date.getDate() + 1);
}

module.exports = {getCourseDaysBoolArray,incrementDate};

