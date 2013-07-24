#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var sys = require ('util');
var request = require ('request');
var existStatus = ["SITE DOES NOT EXIST\n**OR** IT MAY BE UNREACHABLE CURRENTLY.\nPLEASE CHECK YOUR INTERNET CONNECTION AND DESIRED URL...\nAND TRY AGAIN LATER.", ": THIS FILE EXISTS HAS BEEN LOADED INTO MEMORY: "];

//Check for checks.json substitute
var checkChecks = function(infile) {

    var instr = infile.toString();

     if(fs.existsSync(instr)) 
 {console.log(existStatus[1]+infile);}

		else{

	request//start request
		(instr, function // set parameters: where to look, then need to do stuff to what is returned. 
				(error, response, body){ //will get parameters error, response, body so can use these.

		if (!error && response.statusCode == 200){ //If you don't have an error && have a response.statusCode returned as 200, page exists...
		console.log(existStatus[1]+infile);				
		return instr;
		}//endif


	}//end subfunction
  )//end request (a type of function)


	        console.log("%s does not exist. Exiting.", instr);
        	process.exit(1);
	        }

    return instr;

};//cChecks



checkUrl = function(infile){

   console.log("FUNCTION INITIATED:\ncheckUrl = function(infile):")
   console.log("url to be checked is "+infile+"\n");
	
	//Confirm URL Existence in loop:

	request//start request
		(infile, function // set parameters: where to look, then need to do stuff to what is returned. 
				(error, response, body){ //will get parameters error, response, body so can use these.

		if (!error && response.statusCode == 200){ //If you don't have an error && have a response.statusCode returned as 200, you've got the page!
		console.log(existStatus[1]+infile);		
		
		var cheeryUrl=cheerio.load(body);
		console.log(cheeryUrl);
		console.log("The above is load.cheerio(<body> of site you loaded ("+infile+", in case you'd forgotten!)");

  //Now to do what we require:

		//load in the local checksfile:
		var checkyfile = (JSON.parse(fs.readFileSync(program.checks))).sort();
		console.log("\nYou've got the following checks file loaded now:\n"+checkyfile);

		var checks = checkyfile.sort(); 

		$ = cheeryUrl;
		var out = {};
	        
		for(var ii in checks) {
		        var present = $(checks[ii]).length > 0;
		        out[checks[ii]] = present;
			}
		

	    var outJson = JSON.stringify(out, null, 4);
	    console.log(outJson);
		fs.writeFileSync("grade.txt",outJson);
		console.log("Above written to grade.txt!")
		
		}//endif

		else{
		console.log(existStatus[0]+"\n"+error);
		}//endelse

	}//end subfunction
  )//end request (a type of function)
/*And to wrap up:*/
}//end function



// 
var fileCheck = function(infile) {
//
    console.log("FUNCTION RUNNING:\nfileCheck = function(infile)")

    var infile = infile.toString(); //ensure that we are dealing with a string and...
	console.log("File being tested: "+infile);

    	if (!fs.existsSync(infile))	{
        console.log("%s does not exist. Exiting.", infile);
        process.exit(1); /*http://nodejs.org/api/process.html#process_process_exit_code*/	}

        //Assuming that we haven't exited by this point:

	console.log("FILE "+infile+" exists.");
        console.log("\nEntering MAIN LOOP\n");

	    var checkJson = checkHtmlFile(infile, program.checks);
	    var outJson = JSON.stringify(checkJson, null, 4);
	    console.log(outJson);
	    console.log("<END>");

};

//
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn, infile) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};
//
//


//Program starts running here:
if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(checkChecks), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(fileCheck), HTMLFILE_DEFAULT)
	.option('-url, --url <url_ref>', 'URL of index.html', checkUrl) //url case allowed for. Set up function to check existence/start loading. 
        .parse(process.argv);

} //for require.main
else 
{
    exports.checkHtmlFile = checkHtmlFile;
}

