
var appId = '178032535583061';

// Log4Javascript.
var log = log4javascript.getLogger();
var appender = new log4javascript.BrowserConsoleAppender();
log.addAppender(appender);
log.debug("starting");

// handle a session response from any of the auth related calls
function handleSessionResponse(response) {
	log.debug("FB session response", response);

	// if we dont have a session, just hide the user info
	if (!response.session) {
		clearDisplay();
		return;
	}

	// if we have a session, query for the user's profile picture and name
	FB.api( {
		method : 'fql.query',
		query : 'SELECT name, pic FROM profile WHERE id=' + FB.getSession().uid
	}, function(response) {
		var user = response[0];
		log.debug("FB user", user);
		$('#user-info').html('<img src="' + user.pic + '">' + user.name).show(
				'fast');
	});
}

function initBridge() {

	log.debug("FB init for app id", appId);

	// initialize the library with the API key
	FB.init( {
		appId : appId
	});

	log.debug("get FB login status");
	// fetch the status on load
	FB.getLoginStatus(handleSessionResponse);

	log.debug("bind button events");
	$('#login').bind('click', function() {
		log.debug("login");
		FB.login(handleSessionResponse);
	});

	$('#logout').bind('click', function() {
		log.debug("logout");
		FB.logout(handleSessionResponse);
	});

	$('#disconnect').bind('click', function() {
		log.debug("revoke/disconnect");
		FB.api( {
			method : 'Auth.revokeAuthorization'
		}, function(response) {
			clearDisplay();
		});
	});
	
	$("#newgame").bind("click", function() {
		location.href="./deal.html";
	});
	
	$().ready(function() {
		
		// Fix post-click button style for IE.
		$("a.button").bind("click", function(){this.blur();return true;});
	});

}

// no user, clear display
function clearDisplay() {
	log.debug("clear user info");
	$('#user-info').hide('fast');
}
