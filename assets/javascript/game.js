// Execute this code when the DOM has fully loaded.
 $(document).ready(function() {
 	var characters = {
 		"Yoda": {
 			name: "Yoda",
 			health: 120,
 			attack: 50,
 			imageUrl: "assets/images/yoda.jpg",
 			enemyAttackBack: 15
 		},
 		"Han Solo": {
 			name: "Han Solo",
 			health: 100,
 			attack: 25,
 			imageUrl: "assets/images/han-solo.jpeg",
 			enemyAttackBack: 25
 		},
 		"Jar Jar Binks": {
 			name: "Jar Jar Binks",
 			health: 50,
 			attack: 3,
 			imageUrl: "assets/images/jarjar.jpg",
 			enemyAttackBack: 50
 		},
 		"Jabba the Hutt": {
 			name: "Jabba the Hutt",
 			health: 150,
 			attack: 35,
 			imageUrl: "assets/images/jabba.jpeg",
 			enemyAttackBack: 25
 		}
 	};
 	var currSelectedCharacter;
 	var combatants = [];
 	var currDefender;
 	var turnCounter = 1;
 	var killCount = 0;



 	// FUNCTIONS
 	var renderOne = function(character, renderArea, charStatus) {
 		var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    	var charName = $("<div class='character-name'>").text(character.name);
    	var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    	var charHealth = $("<div class='character-health'>").text(character.health);
    	charDiv.append(charName).append(charImage).append(charHealth);
    	$(renderArea).append(charDiv);

    	// If character is an enemy or defender
    	if (charStatus ==="enemy") {
    		$(charDiv).addClass("enemy");
    	}
    	else if (charStatus === "defender") {
    		currDefender = character;
    		$(charDiv).addClass("target-enemy");
    	}
 	}

 	var renderMessage = function(message) {
 		var gameMessageSet = $("#game-message");
 		var newMessage = $("<div>").text(message);
 		gameMessageSet.append(newMessage);

 		if (message === "clearMessage") {
 			gameMessageSet.text("");
 		}
 	}

 	var renderCharacters = function(charObj, areaRender) {
 		//render all characters 
 		if (areaRender == '#characters-section') {
 			$(areaRender).empty();
 			// Loop through
 			for (var key in charObj) {
 				if (charObj.hasOwnProperty(key)) {
 					renderOne(charObj[key], areaRender, " ");
 				}
 			}
 		}

 		if (areaRender === "#selected-character") {
 			renderOne(charObj, areaRender); 
 		}
 		if (areaRender ==="#available-to-attack-section") {
 			for(var i=0; i < charObj.length; i++) {
 				renderOne(charObj[i], areaRender, "enemy"); 
 			}
 		

 	$(document).on("click", ".enemy", function() {
 		var name = $(this).attr("data-name");

 		if ($("#defender").children().length === 0) {
 			renderCharacters(name, "#defender");
 			$(this).hide();
 		}
 	});
 	}

 	if (areaRender === "#defender") {
 		$(areaRender).empty();
 		for (var i = 0; i < combatants.length; i++) {
 			if(combatants[i].name === charObj) {
 				renderOne(combatants[i], areaRender, "defender");
 			}
 		}
 	}

 	if (areaRender === "playerDamage") {
 		$("#defender").empty();
 		renderOne(charObj, "#defender", "defender");
 	}

 	if (areaRender === "enemyDamage") {
 		$("#selected-character").empty();
 		renderOne(charObj, "#selected-character", "");
 	}


 	if (areaRender === "enemyDefeated") {
 		$("#defender").empty();
 		var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";
 		renderMessage(gameStateMessage);
 	}
 };

 var restartGame = function(inputEndGame) {

 	var restart = $("<button>Restart</button>").click(function() {
 		location.reload();
 	});

 	var gameState = $("<div>").text(inputEndGame);

 	$("body").append(gameState);
 	$("body").append(restart);
 };
 	
 	renderCharacters(characters, "#characters-section");

 	$(document).on("click", ".character", function() {
 		// Saving the clicked character's name
 		var name = $(this).attr("data-name");

 		if (!currSelectedCharacter) {
 			currSelectedCharacter = characters[name];
 			for (var key in characters) {
 				if (key !== name) {
 					combatants.push(characters[key]);
 				}
 			}
 		$("#characters-section").hide();
 		renderCharacters(currSelectedCharacter, "#selected-character");
 		renderCharacters(combatants, "#available-to-attack-section");
 		}
 	});

 	$("#attack-button").on("click", function() {
 		if ($("#defender").children().length !== 0) {
 			var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
 			var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
 			renderMessage("clearMessage");
 			currDefender.health -= (currSelectedCharacter.attack * turnCounter);
 			if (currDefender.health > 0) {
 				renderCharacters(currDefender, "playerDamage");

 				renderMessage(attackMessage);
 				renderMessage(counterAttackMessage);

 				currSelectedCharacter.health -= currDefender.enemyAttackBack;
 				console.log(currSelectedCharacter.health)
 				renderCharacters(currSelectedCharacter, "enemyDamage");
 				if (currSelectedCharacter.health <= 0) {
 					renderMessage("clearMessage");
 					restartGame("You have been defeated... GAME OVER LOSER!");
 					$("#attack-button").unbind("click");
 				}
 			}
 			else {
 			renderCharacters(currDefender, "enemyDefeated");
 			killCount++;
 			if (killCount >= 3) {
 				renderMessage("clearMessage");
 				restartGame("You won!!!! GAME OVER!!!");
 			}
 		}
 		}
 		turnCounter++;
 	});
 });
