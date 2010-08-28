function removeNL(s) {
  /*
  ** Remove NewLine, CarriageReturn and Tab characters from a String
  **   s  string to be processed
  ** returns new string
  */
  r = "";
  for (i=0; i < s.length; i++) {
    if (s.charAt(i) != '\n' &&
        s.charAt(i) != '\r' &&
        s.charAt(i) != '\t') {
      r += s.charAt(i);
      }
    }
  return r;
  }

function fromHashToUrl(obj) {
    return JSON.stringify(obj).replace(/:/g,'=').replace(/\"/g,'').replace(/,/g,'&').replace(/{|}/g,'');
}

var url = "http://open.dapper.net/transform.php?dappName=unimath&transformer=HTML&extraArg_smallMode=1&applyToUrl=" + escape("http://yedion.tau.ac.il/yed/yednew.dll?") + escape(fromHashToUrl(request.post));
var nrequest = new HTTP.ClientRequest(url);
nrequest.header({'Host': 'yedion.tau.ac.il',
'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8',
'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
'Accept-Language': 'en-us,en;q=0.5',
'Accept-Encoding': 'gzip,deflate',
'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
'Keep-Alive': '115',
'Connection': 'keep-alive',
'Referer': 'http://www2.tau.ac.il/yedion/yedion.html'});
var resp = nrequest.send(true);

include('template'); // load the library, or configure on your v8cgi.conf
var t = new Template( { 'path' : 'C:\\Program Files\\Apache Software Foundation\\Apache2.2\\htdocs\\' , 'suffix' : 'html' } );
var d = { 'title': 'my site' , 'content' : resp.data /* not secure */ };
response.write( t.process('ue' , d ) );



