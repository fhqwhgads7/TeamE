Parse.initialize("xjUxyY8bghFGuSnM3ptEZkV3BiWOlD3VhkRLt4kz", "iZCS2S7ZuWn9keMoooLaHMlB7HMXpcqD1M60JVjp");
var CurrentUser = Parse.User.current();
var currentUsername = CurrentUser.get("username");
var Game = Parse.Object.extend("Game");

// PubNub business 
var pubnub = PUBNUB.init({
    publish_key: 'pub-c-d3ce4b6d-4960-4db3-a8be-29709342456b',
    subscribe_key: 'sub-c-52dd673e-b2ba-11e3-aab4-02ee2ddab7fe'
});

function joinGame(gameId) {
    var query = new Parse.Query(Game);
    query.get(gameId, {
      success: function(game) {
        var playersList = game.get("players");
        if (playersList.length < 6) {
            if (playersList.indexOf(currentUsername) == -1) {
                playersList.push(currentUsername);
                game.set("players", playersList);
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
                        message: {"playerJoined": currentUsername}
                }); 
            }
            localStorage.setItem("joinedGame", {
                "gameId": gameId,
                "gameName": game.get("name")
            }); 
        }
      },
      error: function(object, error) {
        alert("Oops, couldn't join the game: " + error.message);
        localStorage.removeItem("joinedGame"); 
      }
    });
}
