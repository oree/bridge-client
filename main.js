


// handle a session response from any of the auth related calls
function handleSessionResponse(response) {
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
		$('#user-info').html('<img src="' + user.pic + '">' + user.name).show(
				'fast');
	});
}
