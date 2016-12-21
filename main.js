var request = require("request")
var email   = require("emailjs");

var feedManager = {

	getLatest : function( sReddit , section , keyWord ) {

		request( "https://www.reddit.com/r/" + sReddit + "/" + section + "/.rss" , function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    feedManager.parseLatest( body , keyWord );
		  }
		});

	},

	parseLatest : function( wBody , keyWord ) {
		
		var wResults = "";
		var needToEmail = false;
		var wContents = wBody.split( "<entry" );
		for ( var i = 0; i < wContents.length; ++i ) {

			if ( wContents[i].indexOf( keyWord ) >=0 ) {
				needToEmail = true;
				var wURLStart = wContents[i].indexOf( "href=" );
				var wURLEnd = wContents[i].indexOf( "&gt;" , wURLStart );
				var wURL = wContents[i].substring( wURLStart , wURLEnd );
				var fURL = wURL.substring( 11 , wURL.length - 6 );
				wResults = wResults + fURL + "\n";
			}

		}

		if ( needToEmail ) {
			feedManager.emailResults( wResults , keyWord );
		}
		
	},

	emailResults : function( results , keyWord ) {

		var server  = email.server.connect({
		   user:    "", 
		   password:"", 
		   host:    "smtp.mail.yahoo.com", 
		   ssl:     true
		});

		server.send({
		   text:    results, 
		   from:    "", 
		   to:      "",
		   cc:      "",
		   subject: keyWord
		}, function(err, message) { console.log(err || message); });
	}

};


feedManager.getLatest( "science" , "new" , "autism" );
