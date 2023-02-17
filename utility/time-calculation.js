
function getDayNameFromToday(locale){
    var date = new Date();
    return date.toLocaleDateString(locale, { weekday: 'long' });
}

// var dateStr = '05/23/2014';
// var day = getDayName(dateStr, "nl-NL"); // Gives back 'Vrijdag' which is Dutch for Friday.

function getWeeksUntilNow(){
    currentDate = new Date(); //current date
    startDate = new Date(currentDate.getFullYear(), 0, 1);  //January 1.
    let days = Math.floor((currentDate - startDate) / //get the days until now
        (24 * 60 * 60 * 1000));

    return Math.ceil(days / 7); //get the number of weeks until now from days
}

function currentWeekIsEven(){
    const weekNumber = getWeeksUntilNow()
    return weekNumber%2 == 0
}

module.exports = {
    dayNameFromToday: getDayNameFromToday,
    getWeeksUntilNow: getWeeksUntilNow,
    isEvenWeek: currentWeekIsEven
}