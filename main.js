// Log4Javascript.
var log = log4javascript.getLogger();
var appender = new log4javascript.BrowserConsoleAppender();
log.addAppender(appender);
log.debug("starting");

$().ready(function() {
	log.debug("jQuery ready");
	// Fix post-click button style for IE.
		$("a.button").live("click", function() {
			this.blur();
			return true;
		});

		$("div#error").ajaxError(
				function(e, jqxhr, settings, exception) {
					log.error("ajax error ", e);
					$(this).text("Triggered ajaxError handler: " + exception)
							.show("fast").hide(3000, "swing");
				});

	});

// handle a session response from any of the auth related calls
function handleSessionResponse(response) {
	log.debug("FB session response", response);

	// if we dont have a session, just hide the user info
	if (!response.session) {
		log.debug("clear user info");
		$('#user-info').hide('fast');
		return;
	}

	// if we have a session, query for the user's profile picture and name
	FB.api( {
		method : 'fql.query',
		query : 'SELECT name, pic FROM profile WHERE id=' + FB.getSession().uid
	}, function(response) {
		var user = response[0];
		log.debug("FB user", user);
		$('#user-name').html(user.name);
		$('#user-pic').attr('src', user.pic);
		$('#user-info').show('fast');

	});
}

function initBridge() {
	log.debug("FB init done.");

	var session = FB.getSession();
	$("#spinner").hide('fast');
	if (session) {
		$("#user-info").show('fast');
		$("#newgame").show('fast');
		// $("#logout").show('fast');
		// $("#disconnect").show('fast');
	} else {
		$("#user-name").html("visitor. Please log in");
		$("#user-pic").hide();
		$("#user-info").show('fast');
		$("#login").show('fast');
		$("#worldpeace").show('fast');
	}

	$('#disconnect').bind('click', function() {
		log.debug("revoke/disconnect");
		FB.api( {
			method : 'Auth.revokeAuthorization'
		}, function(response) {
			log.info("user disconnected");
			window.location.reload();
		});
	});
	$("#worldpeace").bind("click", function() {
		location.href = "./worldpeace.html";
	});
	$("#soon").bind("click", function() {
		location.href = "./";
	});
	$("#newgame").bind("click", function() {
		doPrepInvite();
	});

}

function doPrepInvite() {
	log.info("now prepping invite");

	if (! friendList) {
		$.getScript("https://graph.facebook.com/me/friends?access_token=" + session.access_token + "&callback=friendListCallback");
	}

	$("a.button").hide("fast");
	$("#user-info").animate( {
		"margin-top" : "470px",
		"margin-left" : "300px"
	}, 700);
	$(".user-welcome").hide('slow');

	$("#dealbutton").animate( {
		"display" : "block",
		"position" : "absolute",
		"margin-left" : "500px",
		"top" : "500px"
	}, 300);
	
}

var friendList;  // cache our friends this session.

function friendListCallback(data) {
	log.debug("got friends:", data);
	friendList = data;
	doInvite();
}

function doInvite() {
	log.info("now inviting");

	doBid();
}

function doBid() {
	log.info("now bidding");

	setTimeout(doDeal, 2000);
}

function doDeal() {
	log.info("now dealing");

	$("#scorecard").hide("slow");
	jQuery.getJSON("../server/randomHand.py?", {}, function(data) {
		$("#user-info").hide();
		log.debug("gethand returned ", data);
		var hand = data.hand;
		log.debug(hand);
		var i = 1;
		$.each(hand, function(card) {
			log.debug(hand[card]);
			var cls = "card " + hand[card] + " my" + i++;
			$("<div/>", {
				"class" : cls
			}).appendTo("div.myhand").data("card", hand[card]);
		});
	});

	$(".myhand .card").live("click", function() {
		log.debug("click");
		var that = $(this);
		var card = that.data("card");
		log.debug("playing ", card);
		that.fadeOut("slow", "linear", function() {
			that.remove();
			var count = $(".myhand .card").length;
			log.debug("cards left:", count);
			if (count == 0)
				doScore();
		});
	});
	log.debug("ready done");
}

function doScore() {
	log.info("now scoring");

	// Score card appearance.
	log.debug("show scorecard");
	$("<img/>", {
		id : "scorecard",
		src : "images/scoresh.gif",
		style : "display: none; position: absolute; float:left;"
	}).appendTo("table").animate( {
		"margin-top" : "100px",
		"margin-left" : "100px"
	}, 500);

	setTimeout(doDeal, 1000);
}
