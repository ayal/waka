//V raw = "\u05d1\u05d5\u05e8\u05d9\u05e7 \u05ea\u05d5\u05d8\u05d9\u05e9\u05d1 \u05e8\u05e0\u05d9\u05de\u05e1  ADVANCED SEMINAR";

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}


Date.prototype.addDays = function (n) {
    var d = new Date (this.getTime())
    d.setDate (d.getDate() + n)
    return d
}


var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";

var colorz = ['#A32929'  ,'#B1365F'  ,'#7A367A'  ,'#5229A3'  ,'#29527A'  ,'#2952A3'  ,'#1B887A', '#28754E'  ,'#0D7813'  ,'#528800'  ,'#88880E'  ,'#AB8B00'  ,'#BE6D00'  ,'#B1440E', '#865A5A'  ,'#705770'  ,'#4E5D6C'  ,'#5A6986'  ,'#4A716C'  ,'#6E6E41'  ,'#8D6F47' ,'#853104'  ,'#691426'  ,'#5C1158'  ,'#23164E'  ,'#182C57'  ,'#060D5E'  ,'#125A12' ,'#2F6213'  ,'#2F6309'  ,'#5F6B02'  ,'#8C500B'  ,'#8C500B'  ,'#754916'  ,'#6B3304' ,'#5B123B'  ,'#42104A'  ,'#113F47'  ,'#333333'  ,'#0F4B38'  ,'#856508'  ,'#711616'];

function dateFromDayName(dname) {
    var today = new Date();
    for (var i = 0; i < 7; i++) {
        if (today.addDays(i).getDay() == weekday.indexOf(dname)) {
            return today.addDays(i);
        }
    }
}
function dateFormat(d, orig) {
    if (d == undefined)
        return orig;
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
}


var days = {'א' : 'Sunday',
            'ב' : 'Monday',
            'ג' : 'Tuesday',
            'ד' : 'Wednesday',
            'ה' : 'Thursday',
            'ו' : 'Friday'}

function onlyEnglish(s) {
    var lastIndex = 0;
    for (var i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) > 1000) {
            lastIndex = i;
        }
    }

    return s.substring(lastIndex + 1, s.length);
}

var pattern1 = '@courseTime1_2,@courseTime1_2,@courseTime1_1,@courseName_0,@courseType_0 @profName_0';
var pattern2 = '@courseTime2_2,@courseTime2_2,@courseTime2_1,@courseName_0,@courseType_0 @profName_0';

var pattInst1 = pattern1;
var pattInst2 = pattern2;

var option = 0;

var all = '';
var profLines = '';

function handleUnicode(raw) {
    var oneway = unescape(raw);
    var backway = oneway.split("").reverse().join("");
    return backway;
}

function isClass (fgroup) {
    return fgroup["courseType_0"] == 'רועיש';
}

function formatIso(d, t) {
    var sm = '' + (d.getMonth() + 1);
    var sd = '' + d.getDate();
    
    if (sm.length == 1)
	sm = '0' + sm;

    if (sd.length == 1)
	sd = '0' + sd;

    return  d.getFullYear() + '-' + sm + '-' +  sd + 'T' + t + ':00.000+03:00';
}

var fieldGroup = {};
var allFields = {};
var fieldSuffix = 0;

function initFromData () {
    console.log('init from data');
    
    $.each($('td.left'), function (x, y) {
	var currentFieldName = $(y).attr('innerHTML');
	var currentFieldVal= $(y).next().attr('innerHTML');
	
	if (currentFieldName == 'courseName') {
	    
	    var cnum = '' + fieldGroup['courseNumber_0'];
	    if (cnum) {
		allFields[cnum] = fieldGroup;

	    }
	    fieldGroup = {};
	}

	if (fieldGroup[currentFieldName + '_' + fieldSuffix]) {
	    fieldSuffix++;
	}
	else {
	    fieldSuffix = 0;
	}
	
	fieldGroup[currentFieldName + '_' + fieldSuffix] = currentFieldVal;
	
    });

	var classScope = {};

	$.each(allFields, function (cnum, fgroup) {
	    if (isClass(fgroup)) {
		classScope = fgroup;
		classScope.isClass = true;
	    }
	    else {
		if (!classScope.tirgulim) {
		    classScope.tirgulim = [];
		}

		classScope.tirgulim.push(cnum);
	    }
	});
}

$(document).ready(function () {
    initFromData();
});

function parseTime(time) {
    var bef = time[0] + time[1];
    var aft = time[2] + time[3];
    return bef + ':' + aft;
}
function parseTimes(times) {
    var startend = times.split(' - ');
    return parseTime(startend[0]) + ',' + parseTime(startend[1]);
}
   
function process() {

    var courseNumberPrefixFilter = ',' + window.prompt("courseNumber","0366-1101");
    var simesterFilter =  window.prompt("What simester? (1/2)?","1");
    console.log(courseNumberPrefixFilter);

    var calScope = null;
    var iColor = 0;
    var allParams = [];

    console.log('len: ' + allFields.length);

    $.each(allFields, function (cnum, fgroup) {

	var inFilter = false;
	$.each(courseNumberPrefixFilter.split(','), function (i, v) {
	    if (v != '' && !inFilter) {
		inFilter = (',' + cnum).indexOf(v) != -1;
	    }
	});
	if (inFilter)
	    console.log('cnum ' + cnum + ' filter: ' + courseNumberPrefixFilter + ' ' + inFilter );
	
	if (inFilter) {    
	    if (fgroup.isClass) {
		console.log('found class');	    
		//also for coursetime2
		function parseEvent(fg, timePropName) {
		
		    if (!fg[timePropName + '_0']) {
			return null;
		    }

		    var evt = {};
		    
		    evt.title =  onlyEnglish(fg["courseName_0"]) + " " + handleUnicode(fg["courseType_0"]); 
    		    evt.content = handleUnicode(fg["profName_0"]);
		    
		    var time = parseTimes(fg[timePropName + '_1']);
		    var day = fg[timePropName + '_2'].replace("'","");

		    if (days[day]) {
			var orig = days[day];
			evt.stime = formatIso(dateFromDayName(orig), time.split(',')[0]);
			evt.etime = formatIso(dateFromDayName(orig), time.split(',')[1])
		    }
		    return evt;
		}
		function pushIfNotNull (arr, item) {
		    if (item)
			arr.push(item);
		}

		var classEvts = [];

		var isSimOne = fgroup['courseTime1_0'] == "'א 'מס";
		console.log('IS 0 SIM 1:' + isSimOne);
		if (simesterFilter == '1' && isSimOne) {
		    pushIfNotNull(classEvts, parseEvent(fgroup, "courseTime1"));
		}

		var isSimOne = fgroup['courseTime2_0'] == "'א 'מס";
		console.log('IS 1 SIM 1:' + isSimOne);
		if (simesterFilter == '1' && isSimOne) {
		    pushIfNotNull(classEvts, parseEvent(fgroup, "courseTime2"));
		}

		var title =  onlyEnglish(fgroup['courseName_0']);
		
		if (fgroup.tirgulim) {
		    $.each(fgroup.tirgulim, function (i, cnumx) {
			var tirgulEvts = [];

			pushIfNotNull(tirgulEvts, parseEvent(allFields[cnumx], "courseTime1"));
			pushIfNotNull(tirgulEvts, parseEvent(allFields[cnumx], "courseTime2"));
			
			if (iColor >= colorz.length - 1)
			    iColor = 0;
			
			var evtsForThisCal = $.merge($.merge([], classEvts), tirgulEvts);
			$.each( evtsForThisCal, function (i, evt) {
			    console.log(JSON.stringify(evt));
			});

			var args = [colorz[iColor], title + ' option ' + iColor, evtsForThisCal];
			allParams.push(args);
			console.log('---------------');
			
		    });
		}
		else {
		    
		    console.log('title: ' + title + ' option ' + (++iColor));
		    
		    var evtsForThisCal = $.merge([], classEvts);
		    $.each( evtsForThisCal, function (i, evt) {
			console.log(JSON.stringify(evt));
		    });
		    
		    var args = [colorz[iColor], title + ' option ' + iColor, evtsForThisCal];
		    allParams.push(args);
		    console.log('---------------');
		}
	    }
	}	
    });

    console.log('finished processing');
    
    if (confirm('Going to create ' + allParams.length + ' calendars. Ok?')) {
	function continueOnThis(i) {
	    pz = allParams[i];
	    if (!pz)
		return null;
	    return newCalendarAndEvent(pz[0], pz[1], pz[2], continueOnThis(i + 1));
	}
	
	continueOnThis(0)(); 
    }
}
	   
	   
	