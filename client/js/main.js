
define(['jquery', 'app'], function($, App) {
    var app, game;

    var initApp = function() {
        $(document).ready(function() {
            app = new App();
            app.center();

            if(Detect.isWindows()) {
                // Workaround for graphical glitches on text
                $('body').addClass('windows');
            }

            if(Detect.isOpera()) {
                // Fix for no pointer events
                $('body').addClass('opera');
            }

            if(Detect.isFirefoxAndroid()) {
                // Remove chat placeholder
                $('#chatinput').removeAttr('placeholder');
            }

            $('body').click(function(event) {
                if($('#parchment').hasClass('credits')) {
                    app.toggleScrollContent('credits');
                }

                if($('#parchment').hasClass('legal')) {
                    app.toggleScrollContent('legal');
                }

                if($('#parchment').hasClass('about')) {
                    app.toggleScrollContent('about');
                }
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
                if($('body').hasClass('about')) {
                    app.closeInGameScroll('about');
                    $('#helpbutton').removeClass('active');
                } else {
                    app.toggleScrollContent('about');
                }
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

            $('#playercount').click(function() {
                app.togglePopulationInfo();
            });

            $('#population').click(function() {
                app.togglePopulationInfo();
            });

            $('.clickable').click(function(event) {
                event.stopPropagation();
            });

            $('#toggle-credits').click(function() {
                app.toggleScrollContent('credits');
            });

            $('#toggle-legal').click(function() {
                app.toggleScrollContent('legal');
                if(game.renderer.mobile) {
                    if($('#parchment').hasClass('legal')) {
                        $(this).text('close');
                    } else {
                        $(this).text('Privacy');
                    }
                };
            });

            $('#create-new span').click(function() {
                app.animateParchment('loadcharacter', 'confirmation');
            });

            $('.delete').click(function() {
                app.storage.clear();
                app.animateParchment('confirmation', 'createcharacter');
                $('body').removeClass('returning');
            });

            $('#cancel span').click(function() {
                app.animateParchment('confirmation', 'loadcharacter');
            });

            $('.ribbon').click(function() {
                app.toggleScrollContent('about');
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

            $('#resize-check').bind("transitionend", app.resizeUi.bind(app));
            $('#resize-check').bind("webkitTransitionEnd", app.resizeUi.bind(app));
            $('#resize-check').bind("oTransitionEnd", app.resizeUi.bind(app));

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
                $('#death').find('p').html(message+"<em>Please reload the page.</em>");
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

            game.onNbPlayersChange(function(worldPlayers, totalPlayers) {
                var setWorldPlayersString = function(string) {
                        $("#instance-population").find("span:nth-child(2)").text(string);
                        $("#playercount").find("span:nth-child(2)").text(string);
                    },
                    setTotalPlayersString = function(string) {
                        $("#world-population").find("span:nth-child(2)").text(string);
                    };

                $("#playercount").find("span.count").text(worldPlayers);

                $("#instance-population").find("span").text(worldPlayers);
                if(worldPlayers == 1) {
                    setWorldPlayersString("player");
                } else {
                    setWorldPlayersString("players");
                }

                $("#world-population").find("span").text(totalPlayers);
                if(totalPlayers == 1) {
                    setTotalPlayersString("player");
                } else {
                    setTotalPlayersString("players");
                }
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
                });
            }

            $('body').unbind('click');
            $('body').click(function(event) {
                var hasClosedParchment = false;

                if($('#parchment').hasClass('credits')) {
                    if(game.started) {
                        app.closeInGameScroll('credits');
                        hasClosedParchment = true;
                    } else {
                        app.toggleScrollContent('credits');
                    }
                }

                if($('#parchment').hasClass('legal')) {
                    if(game.started) {
                        app.closeInGameScroll('legal');
                        hasClosedParchment = true;
                    } else {
                        app.toggleScrollContent('legal');
                    }
                }

                if($('#parchment').hasClass('about')) {
                    if(game.started) {
                        app.closeInGameScroll('about');
                        hasClosedParchment = true;
                    } else {
                        app.toggleScrollContent('about');
                    }
                }

                if(game.started && !game.renderer.mobile && game.player && !hasClosedParchment) {
                    game.click();
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

                if(key === Types.Keys.ENTER) {
                    if($('#chatbox').hasClass('active')) {
                        app.hideChat();
                    } else {
                        app.showChat();
                    }
                }
                if (game.started && !$('#chatbox').hasClass('active'))
                {
                    pos = {
                        x: game.player.gridX,
                        y: game.player.gridY
                    };
                    switch(key) {
                        case Types.Keys.LEFT:
                        case Types.Keys.A:
                        case Types.Keys.KEYPAD_4:
                            pos.x -= 1;
                            game.keys(pos, Types.Orientations.LEFT);
                            break;
                        case Types.Keys.RIGHT:
                        case Types.Keys.D:
                        case Types.Keys.KEYPAD_6:
                            pos.x += 1;
                            game.keys(pos, Types.Orientations.RIGHT);
                            break;
                        case Types.Keys.UP:
                        case Types.Keys.W:
                        case Types.Keys.KEYPAD_8:
                            pos.y -= 1;
                            game.keys(pos, Types.Orientations.UP);
                            break;
                        case Types.Keys.DOWN:
                        case Types.Keys.S:
                        case Types.Keys.KEYPAD_2:
                            pos.y += 1;
                            game.keys(pos, Types.Orientations.DOWN);
                            break;
                        case Types.Keys.SPACE:
                            game.makePlayerAttackNext();
                            break;
                        case Types.Keys.I:
                            $('#achievementsbutton').click();
                            break;
                        case Types.Keys.H:
                            $('#helpbutton').click();
                            break;
                        case Types.Keys.M:
                            $('#mutebutton').click();
                            break;
                        case Types.Keys.P:
                            $('#playercount').click();
                            break;
                        default:
                            break;
                    }
                }
            });

            $('#chatinput').keydown(function(e) {
                var key = e.which,
                    $chat = $('#chatinput'),
                    placeholder = $(this).attr("placeholder");

                if (!(e.shiftKey && e.keyCode === 16) && e.keyCode !== 9) {
                    if ($(this).val() === placeholder) {
                        $(this).val('');
                        $(this).removeAttr('placeholder');
                        $(this).removeClass('placeholder');
                    }
                }

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

            $('#chatinput').focus(function(e) {
                var placeholder = $(this).attr("placeholder");

                if(!Detect.isFirefoxAndroid()) {
                    $(this).val(placeholder);
                }

                if ($(this).val() === placeholder) {
                    this.setSelectionRange(0, 0);
                }
            });

            $('#nameinput').focusin(function() {
                $('#name-tooltip').addClass('visible');
            });

            $('#nameinput').focusout(function() {
                $('#name-tooltip').removeClass('visible');
            });

            $('#nameinput').keypress(function(event) {
                var $name = $('#nameinput'),
                    name = $name.attr('value');

                $('#name-tooltip').removeClass('visible');

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

            if(game.renderer.tablet) {
                $('body').addClass('tablet');
            }
        });
    };

    initApp();
});
