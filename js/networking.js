Parse.initialize("xjUxyY8bghFGuSnM3ptEZkV3BiWOlD3VhkRLt4kz", "iZCS2S7ZuWn9keMoooLaHMlB7HMXpcqD1M60JVjp");
var CurrentUser = Parse.User.current();
var currentUsername;
if (CurrentUser) {
	currentUsername = CurrentUser.get("username");
}
var ParseGame = Parse.Object.extend("Game");

// PubNub business 
var pubnub = PUBNUB.init({
    publish_key: 'pub-c-d3ce4b6d-4960-4db3-a8be-29709342456b',
    subscribe_key: 'sub-c-52dd673e-b2ba-11e3-aab4-02ee2ddab7fe'
});

function joinGame(gameId) {
    var query = new Parse.Query(ParseGame);
    query.get(gameId, {
      success: function(game) {
        var playersList = game.get("players");
        if (playersList.length < game.get("capacity")) {
            if (playersList.indexOf(currentUsername) == -1) {
                playersList.push(currentUsername);
                game.set("players", playersList);
                if(playersList.length >= game.get("capacity")) {
                    game.set("open", false);
                }
                game.save(null, {
                    success: function(game) {
                        console.log("joinedGame worked.");
                    },
                    error: function(game, error) {
                        console.log("Couldn't add you (" + currentUsername + ") to this game's list of players." + error.message);
                    }
                });
                pubnub.publish({
                        channel: gameId,
                        message: {"refreshPlayers": currentUsername}
                }); 
            }
            localStorage.setItem("joinedGame", true); 
            localStorage.setItem("joinedGameId", gameId); 
            localStorage.setItem("joinedGameName", game.get("name")); 
        }
      },
      error: function(object, error) {
        alert("Oops, couldn't join the game: " + error.message);
        localStorage.removeItem("joinedGame"); 
        SwitchToPage("find_game_online.html");
      }
    });
}

function leaveGame(gameId) {
    var query = new Parse.Query(ParseGame);
    query.get(gameId, {
      success: function(game) {
        var playersList = game.get("players");
        var indexOfPlayerBouncing = playersList.indexOf(currentUsername);
        if (indexOfPlayerBouncing > -1) {
            playersList.splice(indexOfPlayerBouncing,1);
            game.set("players", playersList);
            if(playersList.length < game.get("capacity")) {
                game.set("open", true);
            }
            game.save(null, {
                success: function(game) {
                    console.log("joinedGame worked.");
                },
                error: function(game, error) {
                    console.log("Couldn't add you (" + currentUsername + ") to this game's list of players." + error.message);
                }
            });
            pubnub.publish({
                    channel: gameId,
                    message: {"refreshPlayers": currentUsername}
            }); 
        }
      },
      error: function(object, error) {
        alert("Oops, couldn't leave the game: " + error.message);
      }
    });
}

			
function RemoveGame(gameId){
	var query = new Parse.Query(ParseGame);
	query.get(gameId, {
		success: function(gameId) {
			// The object was retrieved successfully.
			gameId.destroy({});
		},
		error: function(object, error) {
		// The object was not retrieved successfully.
		// error is a Parse.Error with an error code and description.
		}
	});
}