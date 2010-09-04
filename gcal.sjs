var SQLite = require("sqlite").SQLite;
try {
  var db = new SQLite().open("xx.db");
} catch(e) {
    system.stdout("[sqlite error] "+e);
}

function arrayToJson(arr) {
    var ret = {};
    for (var i = 0; i < arr.length; i++) {
	var obj = arr[i];
	ret[obj.key] = obj.val;
    }
    return ret;
}

function SessionSet(k, v, verify) {
    if (verify) {
	var result = db.query("select key,val from session");
	if (arrayToJson(result.fetchObjects())[k]) {
	    db.query("update session set val = '"+v+"' where key = '" + k + "'");
	    return;
	}
    }

    db.query("insert into session (key, val) values ('"+k+"', '"+v+"')");
}

function SessionGet(k) {
    	var result = db.query("select val from session where key ='" + k +  "'" );
	return result.fetchObjects()[0].val;
}

function fromHashToUrl(obj) {
    return JSON.stringify(obj).replace(/:/g,'=').replace(/\"/g,'').replace(/,/g,'&').replace(/{|}/g,'');
}



if (request.post) {
    var postData = escape(fromHashToUrl(request.post));
    if (postData != '') {
	var url = "http://open.dapper.net/transform.php?dappName=unimath&transformer=HTML&extraArg_smallMode=1&applyToUrl=" + 
	    escape("http://yedion.tau.ac.il/yed/yednew.dll?") + escape(fromHashToUrl(request.post));
	response.cookie('url', url);
    }
}


var content = 'Click here to login';
var loadShit = false;
var url = 'http://www.google.com';

if (request.cookie) {
    for (var k in request.cookie ) {
	if (k.indexOf('scope') != -1) {
	    loadShit = true;
	}
	if (k.indexOf('url') != -1) {
	    url = request.cookie[k];
	}
    }   
}	



if (loadShit) {
    action = ''
    response.write('loading shit from: '+url+'<br>');
    var nrequest = new HTTP.ClientRequest(url);
    nrequest.header({ 'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8',
		      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		      'Accept-Language': 'en-us,en;q=0.5',
		      'Accept-Encoding': 'gzip,deflate',
		      'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
		      'Keep-Alive': '115',
		      'Connection': 'keep-alive',
		      'Referer': 'http://www2.tau.ac.il/yedion/yedion.html'});
    var resp = nrequest.send(true);
    content = resp.data;
}

include('template'); // load the library, or configure on your v8cgi.conf
var t = new Template( { 'path' : 'C:\\Program Files\\Apache Software Foundation\\Apache2.2\\htdocs\\' , 'suffix' : 'html' } );
var d = { 'title': 'my site' , 'content' : content /* not secure */, 'action': action};
response.write( t.process('ue' , d ) );