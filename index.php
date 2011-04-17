<?php
/**
 *
 * Copyright 2011 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

// Awesome Facebook Application
//
// Name: Bridge
//


require_once 'facebook-php-sdk/src/facebook.php';

// Create our Application instance.
$facebook = new Facebook(array(
  'appId' => '178032535583061',
  'secret' => 'ece74ed1aa6d125aff31f62128b6b221',
  'cookie' => true,
));

// We may or may not have this data based on a $_GET or $_COOKIE based session.
//
// If we get a session here, it means we found a correctly signed session using
// the Application Secret only Facebook and the Application know. We dont know
// if it is still valid until we make an API call using the session. A session
// can become invalid if it has already expired (should not be getting the
// session back in this case) or if the user logged out of Facebook.
$session = $facebook->getSession();

$me = null;
// Session based API call.
if ($session) {
  try {
    $uid = $facebook->getUser();
    $me = $facebook->api('/me');
  } catch (FacebookApiException $e) {
    error_log($e);
  }
}

// login or logout url will be needed depending on current user state.
if ($me) {
  $logoutUrl = $facebook->getLogoutUrl();
} else {
  $loginUrl = $facebook->getLoginUrl();
}

// This call will always work since we are fetching public data.
$naitik = $facebook->api('/eero.raun');

?>
<!doctype html>
<html xmlns:fb="http://www.facebook.com/2008/fbml">
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <link href="main.css" rel="stylesheet" type="text/css">
        <title>Play Bridge with the Mother of Spades</title>
    </head>
    <body id="index">
    <div id="fb-root"></div>

        <div id="board">
        	<div id="spinner"><img src="images/spinner.gif"/></div>
	        <div id="user-info" class="clear">
	        	<img id="user-pic" src="https://graph.facebook.com/<?php echo $uid; ?>/picture" />
	        	<span class="user-welcome">Welcome, </span>
	        	<span id="user-name"><?php echo $me['first_name']; ?></span>
	        	<span class="user-welcome">!</span>
	        </div>

            <div class="buttons">
                <a class="button" id="newgame"><span>Start a New Game</span></a>
                <a class="button" id="login" href="<?php echo $loginUrl; ?>"><span>Log in with Facebook</span></a>
                <a class="button" id="logout" href="<?php echo $logoutUrl; ?>"><span>Log out</span></a>
                <a class="button" id="disconnect"><span>Unauthorize this App</span></a>
                <a class="button" id="worldpeace"><span>Bring world peace</span></a>
            </div>
                <a class="smallbutton" id="dealbutton"><span>Deal</span></a>
            <div class="myhand">
            </div>
        </div>

    </body>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js">
    </script>
    <script src="scripts/log4js/log4javascript.js">
    </script>
    <script src="main.js">
    </script>
    <script>
      var appId = '<?php echo $facebook->getAppId(); ?>';
      var session = <?php echo json_encode($session); ?>;
	  window.fbAsyncInit = function() {
        FB.init({
          appId   : appId,
          session : session, // don't refetch the session when PHP already has it
          status  : true, // check login status
          cookie  : true, // enable cookies to allow the server to access the session
          xfbml   : true // parse XFBML
        });
		FB.Canvas.setSize({ width: 760, height: 680 });
        // whenever the user logs in, we refresh the page
        FB.Event.subscribe('auth.login', function() {
          window.location.reload();
        });        
        $(function() { initBridge(); });
	  };

      (function() {
        var e = document.createElement('script');
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        e.async = true;
        document.getElementById('fb-root').appendChild(e);
      }());
	</script>

	<div id="error"></div>

	<div id="debug">

    <pre><?php print_r($session); ?></pre>

    <pre><?php print_r($me); ?></pre>
    
    </div>
    
  </body>
</html>
