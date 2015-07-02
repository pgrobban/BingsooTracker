/**
 * Summer Bingsoo tracker
 * by pgrobban
 */

// global vars

var START_DATE = new Date("2015-06-27");
var MAX_DATE = new Date("2015-08-28");
var CRYSTALS_PER_DAY = 2;
var LEVEL_CHANCES = [50, 53, 56, 59, 62, 65, 68, 71, 74, 78];
var DATE_FORMAT_OPTIONS = {
    weekday: "short", month: "short", day: "numeric"
};

// generate date range

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}
Date.prototype.toString = function () {
    return this.toLocaleDateString("en-us", DATE_FORMAT_OPTIONS);
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate))
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

// round to 2 decimal places
function rnd(x)
{
    return Math.round((x / 100) * 100);
}

function getArrayOfBooleansFromCheckboxes(selectorClass)
{
    var arr = []
    $(".cb").each(function ()
    {
        arr.push(this.checked);
    });
    return arr;
}

$(document).ready(function () {

    for (var i = 1; i <= 9; i++) {
        $("#levelSelect").append("<option value='" + i + "'>+" + i + "</option>");
    }

    if (new Date() > MAX_DATE)
        var endDate = MAX_DATE;
    else
        var endDate = new Date().addDays(1);

    var dateRange = getDates(START_DATE, endDate);
    dateRange.forEach(function (value) {
        var tr = $("<tr></tr>");
        tr.append("<td class='text-center'><input type='checkbox' class='cb'/></td>");
        tr.append("<td>" + value + "</td>");
        $("#trackertable tbody").append(tr);
    });


    var daysSoFar = dateRange.length;
    var daysLeft = getDates(START_DATE, MAX_DATE).length - daysSoFar;


    if (typeof (Storage) !== "undefined") {

        // load data
        if (typeof localStorage.level !== 'undefined' && localStorage.level !== null) {
            $("#levelSelect").val(localStorage.level);
        }
        else {
            $("#mySelect").val(0);
        }


        if (typeof localStorage.days !== 'undefined' && localStorage.days !== null) {

            console.log("hi");

            var days = JSON.parse(localStorage["days"]); // localstorage stores arrays as strings
            //console.log(days);
            for (var i = 0; i < days.length; i++)
            {
                $(".cb").eq(i).prop('checked', days[i]);
            }
            
        }
    } else {
        alert("Your browser has no support for local storage. This means I can't save your data :(");
    }

    $("#daysSoFar").text(daysSoFar);
    $("#daysLeft").text(daysLeft);
    $("#maxCrystalsLeft").text(daysLeft * CRYSTALS_PER_DAY);

    $(".cb").on("change", updateStuff);
    $("#levelSelect").on("change", updateStuff);
    updateStuff();

    function updateStuff() {
        var daysAwarded = $(".cb:checked").size();
        $("#daysAwarded").text(daysAwarded);
        var percentOfDaysAwarded = rnd((daysAwarded / daysSoFar) * 100);
        $("#actualChance").text(percentOfDaysAwarded + "%");
        var chanceForLevelInPercent = LEVEL_CHANCES[$("#levelSelect").val()];
        if (percentOfDaysAwarded >= chanceForLevelInPercent)
            $("#actualChance").css({"color":"green"});
        else
            $("#actualChance").css({"color":"red"});
        localStorage["level"] = $("#levelSelect").val();
        var chanceForLevelInPercent = LEVEL_CHANCES[$("#levelSelect").val()];
        $("#chanceForLevelInPercent").text(chanceForLevelInPercent + "%");
        var predictedTotalCrystals = CRYSTALS_PER_DAY * getDates(START_DATE, MAX_DATE).length * rnd(chanceForLevelInPercent) / 100;
        $("#predictedTotalCrystals").text(predictedTotalCrystals);
        $("#predictedCrystalsLeft").text($("#daysLeft").text() * CRYSTALS_PER_DAY * chanceForLevelInPercent / 100);

        localStorage["days"] = JSON.stringify(getArrayOfBooleansFromCheckboxes("cb"));
    }



});
