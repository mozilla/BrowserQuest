
define(['jquery', 'app'], function($, App) {
    var app, game;

    var initApp = function() {
        $(document).ready(function() {
        	app = new App();
            app.center();
        
            if(Detect.isChromeOnWindows()) {
                // Workaround for graphical glitches on text
                $('body').addClass('chromewin');
            }
        
            $('body').click(function(event) {
                if($('#parchment').hasClass('credits')) {
                    app.toggleCredits();
                }
                
                if($('#parchment').hasClass('about')) {
                    app.toggleAbout();
                }
            });
            
            $('#credits').click(function(e) {
                    app.toggleCredits();
                    e.stopPropagation();
            });
            
            $('#about').click(function() {
                    app.toggleAbout();
            });
	
        	$('.barbutton').click(function() {
        	    $(this).toggleClass('active');
        	});
	
        	$('#chatbutton').click(function() {
        	    if($('#chatbutton').hasClass('active')) {
        	        app.showChat();
        	    } else {
                    app.hideChat();
        	    }
        	});
	
        	$('#helpbutton').click(function() {
                app.toggleAbout();
        	});
	
        	$('#achievementsbutton').click(function() {
                app.toggleAchievements();
                if(app.blinkInterval) {
                    clearInterval(app.blinkInterval);
                }
                $(this).removeClass('blink');
        	});
	
        	$('#instructions').click(function() {
                app.hideWindows();
        	});
	
        	$('.clickable').click(function(event) {
                event.stopPropagation();
        	});
	
        	$('#toggle-credits').click(function() {
        	    app.toggleCredits();
        	});
	
        	$('#create-new span').click(function() {
        	    app.animateParchment('loadcharacter', 'confirmation');
        	});
	
        	$('.delete').click(function() {
                app.storage.clear();
        	    app.animateParchment('confirmation', 'createcharacter');
        	});
	
        	$('#cancel span').click(function() {
        	    app.animateParchment('confirmation', 'loadcharacter');
        	});
        	
        	$('.ribbon').click(function() {
        	    app.toggleAbout();
        	});

            $('#nameinput').bind("keyup", function() {
                app.toggleButton();
            });
    
            $('#previous').click(function() {
                var $achievements = $('#achievements');
        
                if(app.currentPage === 1) {
                    return false;
                } else {
                    app.currentPage -= 1;
                    $achievements.removeClass().addClass('active page' + app.currentPage);
                }
            });
    
            $('#next').click(function() {
                var $achievements = $('#achievements'),
                    $lists = $('#lists'),
                    nbPages = $lists.children('ul').length;
        
                if(app.currentPage === nbPages) {
                    return false;
                } else {
                    app.currentPage += 1;
                    $achievements.removeClass().addClass('active page' + app.currentPage);
                }
            });

            $('#notifications div').bind(TRANSITIONEND, app.resetMessagesPosition.bind(app));
    
            $('.close').click(function() {
                app.hideWindows();
            });
        
            $('.twitter').click(function() {
                var url = $(this).attr('href');

               app.openPopup('twitter', url);
               return false;
            });

            $('.facebook').click(function() {
                var url = $(this).attr('href');

               app.openPopup('facebook', url);
               return false;
            });
        
            var data = app.storage.data;
    		if(data.hasAlreadyPlayed) {
    		    if(data.player.name && data.player.name !== "") {
		            $('#playername').html(data.player.name);
    		        $('#playerimage').attr('src', data.player.image);
    		    }
    		}
    		
    		$('.play div').click(function(event) {
                var nameFromInput = $('#nameinput').attr('value'),
                    nameFromStorage = $('#playername').html(),
                    name = nameFromInput || nameFromStorage;
                
                app.tryStartingGame(name);
            });
        
            document.addEventListener("touchstart", function() {},false);
        
            log.info("App initialized.");
        
            initGame();
        });
    };
    
    var initGame = function() {
        require(['game'], function(Game) {
            
            var canvas = document.getElementById("entities"),
        	    background = document.getElementById("background"),
        	    foreground = document.getElementById("foreground"),
        	    input = document.getElementById("chatinput");

    		game = new Game(app);
    		game.setup('#bubbles', canvas, background, foreground, input);
    		game.setStorage(app.storage);
    		app.setGame(game);
    		
    		if(app.isDesktop && app.supportsWorkers) {
    		    game.loadMap();
    		}
	
    		game.onGameStart(function() {
                app.initEquipmentIcons();
    		});
    		
    		game.onDisconnect(function(message) {
    		    $('#death').find('p').html(message+".<br><br>Please reload the page.");
    		    $('#respawn').hide();
    		});
	
    		game.onPlayerDeath(function() {
    		    if($('body').hasClass('credits')) {
    		        $('body').removeClass('credits');
    		    }
                $('body').addClass('death');
    		});
	
    		game.onPlayerEquipmentChange(function() {
    		    app.initEquipmentIcons();
    		});
	
    		game.onPlayerInvincible(function() {
    		    $('#hitpoints').toggleClass('invincible');
    		});

    		game.onNbPlayersChange(function(population) {
    		    $("#playercount").find("span.count").text(population);
    		});
	
    		game.onAchievementUnlock(function(id, name, description) {
    		    app.unlockAchievement(id, name);
    		});
	
    		game.onNotification(function(message) {
    		    app.showMessage(message);
    		});
	
            app.initHealthBar();
	
            $('#nameinput').attr('value', '');
    		$('#chatbox').attr('value', '');
    		
        	if(game.renderer.mobile || game.renderer.tablet) {
                $('#foreground').bind('touchstart', function(event) {
                    app.center();
                    app.setMouseCoordinates(event.originalEvent.touches[0]);
                	game.click();
                	app.hideWindows();
                });
            } else {
                $('#foreground').click(function(event) {
                    app.center();
                    app.setMouseCoordinates(event);
                    if(game) {
                	    game.click();
                	}
                	app.hideWindows();
                    // $('#chatinput').focus();
                });
            }

            $('body').unbind('click');
            $('body').click(function(event) {
                if(game.started && !game.renderer.mobile && game.player) {
                    game.click();
                }
                
                if($('#parchment').hasClass('credits')) {
                    if(game.started) {
                        app.closeInGameCredits();
                    } else {
                        app.toggleCredits();
                    }
                }
                
                if($('#parchment').hasClass('about')) {
                    if(game.started) {
                        app.closeInGameAbout();
                    } else {
                        app.toggleAbout();
                    }
                }
            });
            
            $('#respawn').click(function(event) {
                game.audioManager.playSound("revive");
                game.restart();
                $('body').removeClass('death');
            });
            
            $(document).mousemove(function(event) {
            	app.setMouseCoordinates(event);
            	if(game.started) {
            	    game.movecursor();
            	}
            });

            $(document).keydown(function(e) {
            	var key = e.which,
                    $chat = $('#chatinput');

                if(key === 13) {
                    if($('#chatbox').hasClass('active')) {
                        app.hideChat();
                    } else {
                        app.showChat();
                    }
                }
            });
            
            $('#chatinput').keydown(function(e) {
                var key = e.which,
                    $chat = $('#chatinput');

                if(key === 13) {
                    if($chat.attr('value') !== '') {
                        if(game.player) {
                            game.say($chat.attr('value'));
                        }
                        $chat.attr('value', '');
                        app.hideChat();
                        $('#foreground').focus();
                        return false;
                    } else {
                        app.hideChat();
                        return false;
                    }
                }
                
                if(key === 27) {
                    app.hideChat();
                    return false;
                }
            });

            $('#nameinput').keypress(function(event) {
                var $name = $('#nameinput'),
                    name = $name.attr('value');

                if(event.keyCode === 13) {
                    if(name !== '') {
                        app.tryStartingGame(name, function() {
                            $name.blur(); // exit keyboard on mobile
                        });
                        return false; // prevent form submit
                    } else {
                        return false; // prevent form submit
                    }
                }
            });
            
            $('#mutebutton').click(function() {
                game.audioManager.toggle();
            });
            
            $(document).bind("keydown", function(e) {
            	var key = e.which,
            	    $chat = $('#chatinput');

                if($('#chatinput:focus').size() == 0 && $('#nameinput:focus').size() == 0) {
                    if(key === 13) { // Enter
                        if(game.ready) {
                            $chat.focus();
                            return false;
                        }
                    }
                    if(key === 32) { // Space
                        // game.togglePathingGrid();
                        return false;
                    }
                    if(key === 70) { // F
                        // game.toggleDebugInfo();
                        return false;
                    }
                    if(key === 27) { // ESC
                        app.hideWindows();
                        _.each(game.player.attackers, function(attacker) {
                            attacker.stop();
                        });
                        return false;
                    }
                    if(key === 65) { // a
                        // game.player.hit();
                        return false;
                    }
                } else {
                    if(key === 13 && game.ready) {
                        $chat.focus();
                        return false;
                    }
                }
            });
            
            $(window).resize(function() {
                if(game && game.started) {
                    game.resize();
                    app.initHealthBar();
                    game.updateBars();
                }
            });
            
            if(game.renderer.tablet) {
                $('body').addClass('tablet');
            }
        });
    };
    
    initApp();
});
