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

var req = new HTTP.ClientRequest(request.get.url);
resp = req.send(true);

response.write("callBack('"+HTML.escape(removeNL(resp.data))+"');");