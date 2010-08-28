try
{
    console.log('hi');
}
catch (e)
{
    console = {};
    console.log = alert;
}


/* Copyright (c) 2007 Google Inc. 
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0 
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */
 
/**
 * @fileoverview Demonstrates AuthSub, date range queries, and cross domain
 * writes using the JavaScript client library and the Google Calendar 
 * extensions.
 */
 
function getParam(name) {
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var tmpURL = window.location.href;
  var results = regex.exec( tmpURL );
  if( results == null )
    return "";
  else
    return results[1];
}

// load the Google data JS Client Librar

//document.write('load');

google.load("gdata", "2.x", {packages: ["calendar"]});

function PRINT(x) {
console.log(x);
}
 
// Constants used as element IDs in the DOM
var DEFAULT_PANE = "default-pane";
var AUTHENTICATED_PANE = "authenticated-pane";
var AUTH_BUTTON = "auth-button"; 
var LOGOUT_BUTTON = "logout-button"; 
var SAVE_BUTTON = "save-button";
var EVENT_SELECT = "event-select";
var TITLE_FIELD = "title-field";
var DATE_FIELD = "date-field";
var LOCATION_FIELD = "location-field";
var ATTENDEES_FIELD = "attendees-field";
var NOTES_FIELD = "notes-field";
var STATUS_AREA = "status-area";
 
// Location of the event feed of the primary calendar for the authenticated user
//var EVENT_FEED_URL = 
//"http://www.google.com/calendar/feeds/3umcg8qjmifanq0fcvla5fg530@group.calendar.google.com/private/full";
 
// A google.gdata.calendar.CalendarService object that can be used to access
// private feed using AuthSub.
var myService;
 
// The events feed is retrieved once, and accessed every time the event
// selected in the dropdown menu is changed. 
var myEventsFeed;
 
/**
 * Sets the global calendar service to a new instance.  Also resets the form 
 * fields to clear out any information that may have been cached.
 */

function init() {

//    document.write('init');
    
    EVENT_FEED_URL = "http://www.google.com/calendar/feeds/";
    console.log('init');
    calendarId = getParam('calendarId');
    stime = getParam('stime');
    etime = getParam('etime');

    if (calendarId) {
	//EVENT_FEED_URL = calendarId;	
    }

    google.gdata.client.init(handleError);
    var token = google.accounts.user.checkLogin(EVENT_FEED_URL);
    // Write the token to the console for debug
    //google.gdata.util.log("token: '" + token + "'");
    console.log('check login:' + token)
    myService = 
	new google.gdata.calendar.CalendarService("Google-Notes-0.9");
    
  var authButton = document.getElementById(AUTH_BUTTON);
   
    if (google.accounts.user.checkLogin(EVENT_FEED_URL)) {
	
	//   getEvents();
	var errcb = function (err) {console.log('error callback from newCAL! ' + err);};
	
	if (calendarId) {
	    
	    console.log('calid ' + calendarId + ' ' + EVENT_FEED_URL);
	    //getEvents(calendarId, callback, errcb);
	    //	    newEvent(calendarId, stime, etime)
	}

	
    } else {
	console.log('NO');
	//login();
	
    } 
    
    reset();
};
 
google.setOnLoadCallback(init);
 
/**
 * Requests an AuthSub token for interaction with the Calendar service.
 */
function login() {
  var token = google.accounts.user.login(EVENT_FEED_URL);
  console.log('token: ' + token);
};

function loginx(x) {
  var token = google.accounts.user.login(x);
  console.log('token: ' + token);
}
 
/**
 * Revokes the AuthSub token and resets the page.
 */
function logout(){
  google.accounts.user.logout();
//  init();
};
 
var lastCalId = '';
function newEvent(calendarId, stime, etime) {



  //  if (calendarId) {
	console.log('newing on ' + calendarId);
	//lastCalId = calendarId;
	//login(lastCalId);
//	return;
    //}
    
    // Create an instance of CalendarEventEntry representing the new event
    var entry = new google.gdata.calendar.CalendarEventEntry();

    // Set the title of the event
    entry.setTitle(google.gdata.atom.Text.create('JS-Client: insert event'));

    // Create a When object that will be attached to the event
    var when = new google.gdata.When();

    // Set the start and end time of the When object
    var startTime = google.gdata.DateTime.fromIso8601(stime);
    var endTime = google.gdata.DateTime.fromIso8601(etime);
    when.setStartTime(startTime);
    when.setEndTime(endTime);

    // Add the When object to the event 
    entry.addTime(when);

    // The callback method that will be called after a successful insertion from insertEntry()
    var callback = function(result) {
	
	PRINT('event created!');
    }

    // Error handler will be invoked if there is an error from insertEntry()
    var handleError = function(error) {
	PRINT('error while creating event: ' + error);
	//logout();
	loginx(calendarId);
	init();
    }

    // Submit the request using the calendar service object
    myService.insertEntry(calendarId, entry, callback, 
				handleError, google.gdata.calendar.CalendarEventEntry);
}

function getCalz() {

var calendarService = myService;

// The default "owncalendars" feed is used to insert calendar to the logged-in user
var feedUri = 'http://www.google.com/calendar/feeds/default/private/full';
    
    // This callback method that will be called when getOwnCalendarsFeed() returns feed data
    var callback = function(result) {
	
	// Obtain the array of CalendarEntry
	var entries = result.feed.entry;

	// Use this string to identify targeted calendar entry for update
	var targetTitleStart = 'JS-Client';

	// Flag to indicate whether a match is found
	var calendarFound = false;

	for (var i = 0; i < entries.length; i++) {
	    var calendarEntry = entries[i];
	    var calendarTitle = calendarEntry.getTitle().getText();

	    // The first matched is located!
	    if (calendarTitle.substring(targetTitleStart.length, 0) == targetTitleStart) {      
		calendarFound = true;
		console.log('found! ' + JSON.stringify(calendarEntry.getId()));
		break;
	    }
	}
	
	// If no matched calendar is found, print this message
	if (!calendarFound) {
	    PRINT('Cannot find calendar with title starts with: ' + targetTitleStart);
	}
    }

    // Error handler to be invoked when getOwnCalendarsFeed() or updateEntry() 
    // produces an error
    var handleError = function(error) {
	PRINT(error);
    }

    // Submit the request using the calendar service object
    calendarService.getOwnCalendarsFeed(feedUri, callback, handleError);

}

function newCalendarAndEvent(colorcode, title, evts, next) {

console.log('creating new calendar');
// Create the calendar service object
var calendarService = myService;

// The default "owncalendars" feed is used to insert calendar to the logged-in user
var feedUri = 'http://www.google.com/calendar/feeds/default/owncalendars/full';

// Create an instance of CalendarEntry, representing the new calendar
var entry = new google.gdata.calendar.CalendarEntry();

// Set the calendar title
entry.setTitle(google.gdata.atom.Text.create(title));

// Set the calendar summary
var summary = new google.gdata.atom.Text();
summary.setText('This is a calendar created by JS Client');
entry.setSummary(summary);

// Set the calendar timezone
//var timeZone = new google.gdata.calendar.TimeZoneProperty();
//timeZone.setValue('Asia/Jerusalem');
//entry.setTimeZone(timeZone);

// Set the calendar location
var where = new google.gdata.Where();
where.setLabel('Tel Aviv');
where.setValueString('Tel Aviv');
entry.addLocation(where);

// Set the calendar to be visible in the Google Calendar UI
var hidden = new google.gdata.calendar.HiddenProperty();
hidden.setValue(false);
entry.setHidden(hidden);

// Set the color that represent this calendar in the Google Calendar UI
var color = new google.gdata.calendar.ColorProperty();
color.setValue(colorcode);
entry.setColor(color);

// The callback method that will be called after a successful 
// insertion from insertEntry()
    var callback = function(result) {
	//    debugger;
	PRINT('calendar created!');
	//   debugger;
	var calId = result.entry.getId().$t;

	////////
	var cbx = function (feedRoot) {
	    console.log('callback from calendar query: ' + feedRoot);
	    
	    $.each(evts, function(i, evt) {
		var newEntry = new google.gdata.calendar.CalendarEventEntry({
		    
		    title: {
			type: 'text', 
			text: evt.title
		    },
		    content: {
			type: 'text', 
			text: evt.content
		    },
		    locations: [{
			rel: "g.event",
			label: "Event location",
			valueString: "Netherfield Park tennis court"
		    }],
		    times: [{
			//"2007-08-23T18:00:00.000Z"
			startTime: google.gdata.DateTime.fromIso8601(evt.stime),
			endTime: google.gdata.DateTime.fromIso8601(evt.etime)
		    }]
		});
		
		function handleMyInsertedEntry(insertedEntryRoot) {
		    console.log("Entry inserted. The title is: " + insertedEntryRoot.entry.getTitle().getText());
		    console.log("The timestamp is: " + insertedEntryRoot.entry.getTimes()[0].startTime);
		    console.log("Calling next");
		    if (next)
			next();
		    else
			console.log('Thats it');
		}
		
		
		feedRoot.feed.insertEntry(newEntry, handleMyInsertedEntry, function (errr) { console.log('erf: ' + errr);});
	    });
	    

	};

	calId = calId.replace('http://www.google.com/calendar/feeds/default/calendars/','http://www.google.com/calendar/feeds/') + '/private/full';
	console.log('calid' + calId);
	getEvents(calId, cbx);
    }

// Error handler will be invoked if there is an error from insertEntry()
var handleError = function(error) {
  PRINT(error);
}

// Submit the request using the calendar service object
calendarService.insertEntry(feedUri, entry, callback, 
    handleError, google.gdata.calendar.CalendarEntry);



}

/**
 * Submits a query for all events that occur today.
 */
function getEvents(calid, cb) {
    console.log('gettinge events');
  var query = new google.gdata.calendar.CalendarEventQuery(calid);

  // Set the start-min parameter to the beginning of today.
  var todayDate = new Date();
  todayDate.setHours(0);
  todayDate.setMinutes(0);
  todayDate.setSeconds(0);
  todayDate.setMilliseconds(0);
  var today = new google.gdata.DateTime(todayDate, false);
  query.setMinimumStartTime(google.gdata.DateTime.toIso8601(today));

  // Set the start-max parameter to the beginning of tomorrow.
  var tomorrowDate = new Date();
  tomorrowDate.setDate(todayDate.getDate() + 1);
  tomorrowDate.setHours(0);
  tomorrowDate.setMinutes(0);
  tomorrowDate.setSeconds(0);
  tomorrowDate.setMilliseconds(0);
  var tomorrow = new google.gdata.DateTime(tomorrowDate, false);
  query.setMaximumStartTime(google.gdata.DateTime.toIso8601(tomorrow));

  // Write the uri to the console for debugging
  //google.gdata.util.log("uri=" + query.getUri());
  myService.getEventsFeed(query, cb, cb);
};
 
/**
 * Populates the dropdown menu with events returned in the query for
 * today's events.
 *
 * @param {JSON} The JSON object returned by the Calendar service that
 *   contains a collection of event entries.
 */
function handleEventsFeed(myResultsFeedRoot) {
 
    console.log('handle ' + myResultsFeedRoot.feed);

    myEventsFeed = myResultsFeedRoot.feed;
    events = myEventsFeed.getEntries();
    for (var i = 0; i < events.length; i++) {
	var option = document.createElement("option");
	eventTitle = events[i].getTitle().getText();
	console.log(eventTitle);
    }
};

/**
 * Populates the event information fields with data from the selected event
 * entry. 
 */
function loadEvent() {
  setStatus();
 
 
 
  var eventList = document.getElementById(EVENT_SELECT);
 
  // If the first option (Select...) is selected, don't do anything
  if (eventList.selectedIndex == 0) {
    return;
  }
  var eventIndex = eventList.options[eventList.selectedIndex].value;
  var event = myEventsFeed.getEntries()[eventIndex];
 
  var title = document.getElementById(TITLE_FIELD);
  title.value = event.getTitle().getText();
 
  var date = document.getElementById(DATE_FIELD);
  date.value = event.getTimes()[0].getStartTime().getDate();
 
  var theLocation = document.getElementById(LOCATION_FIELD);
  theLocation.value = event.getLocations()[0].getValueString();
  if (theLocation.value == "undefined") {
    theLocation.value = "";
  }
 
  var attendeesDiv = document.getElementById(ATTENDEES_FIELD);
  attendeesDiv.innerHTML = "";
 
  var participants = event.getParticipants();
  for (var i = 0; i < participants.length; i++) {
    var element = document.createElement("div");
    element.innerHTML = participants[i].getEmail();
    attendeesDiv.appendChild(element);
  }
  
  var notes = document.getElementById(NOTES_FIELD);
  notes.value = event.getContent().getText();
  if (notes.value == "undefined") {
    notes.value = "";
  }
};
 
/**
 * Updates the event in Google Calendar with the data in the event information
 * fields.
 */
function saveEvent() {
  var eventList = document.getElementById(EVENT_SELECT);
  var eventIndex = eventList.options[eventList.selectedIndex].value;
  var event = myEventsFeed.getEntries()[eventIndex];
 
  var title = document.getElementById(TITLE_FIELD).value;
  event.getTitle().setText(title);
  
  var date = new Date(document.getElementById(DATE_FIELD).value);
  event.setTimes(null);
  var when = new google.gdata.When();
  when.setStartTime(date);
  when.setEndTime(date); 
  event.addTime(when);
  
  var theLocation = document.getElementById(LOCATION_FIELD).value;
  event.getLocations()[0].setValueString(theLocation);
  
  var notes = document.getElementById(NOTES_FIELD).value;
  event.getContent().setText(notes);  
 
  event.updateEntry(handleSaveSuccess, handleSaveError);
};
 
/**
 * Updates the appropriate entry in myEventsFeed and notifies the user that 
 * the event was saved.
 */
function handleSaveSuccess(entryRoot) {
  var eventList = document.getElementById(EVENT_SELECT);
  var option = eventList.options[eventList.selectedIndex]
  option.text = entryRoot.entry.getTitle().getText();
  var eventIndex = option.value;
  myEventsFeed.getEntries()[eventIndex] = entryRoot.entry;
  setStatus("Saved")
};
 
/**
 * Sets the status to the given string.  If none is given, then the status is
 * cleared.
 */
function setStatus(msg) {
  var eventStatus = document.getElementById(STATUS_AREA);
  if (msg) {
    eventStatus.innerHTML = msg;
  } else {
    eventStatus.innerHTML = "";
  }
};
 
/**
 * Notifies the user that the event was not saved.
 */
function handleSaveError(e) {
  setStatus("Error");
  handleError(e);
};
 
/**
 * Creates a popup alert to notify the user of a Google data related error.
 * 
 * @param {Object} An error that occurred while attempting to interact with
 *   the Google Calendar service.  
 */
function handleError(e) {
  if (e instanceof Error) {
    // Alert with the error line number, file and message.
    console.log('Error at line ' + e.lineNumber +
        ' in ' + e.fileName + '\n' +
        'Message: ' + e.message);
    // If available, output HTTP error code and status text
    if (e.cause) {
      var errorStatus = e.cause.status;
      var statusText = e.cause.statusText;
      console.log('Root cause: HTTP error ' + errorStatus + ' with status text of: ' +
          statusText);
    }
  } else {
    console.log(e.toString());
  }
};
 
/**
 * Resets the form back to the same state as when the page first loads. 
 */
function reset() {

  
};
//]]>

//////////////////////////
