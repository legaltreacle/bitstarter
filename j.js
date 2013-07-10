//everyone's "var fs=require('fs')"ing - must be useful for something.
var fs=require('fs');

var readinasbuffer=fs.readFileSync('index.html',0); //reads contents of file, buffer setting
var converttostring=readinasbuffer.toString(0,0);  /* assigns a new variable eq to string value of the index.html file's contents 
(as was retrieved as a buffer) */

console.log /*text to forward on:*/ ('The html file says: '+converttostring);
