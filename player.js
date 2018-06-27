"use strict";

// jQuery plugin initialization
(function ($) {

    $.fn.old_player = function () {
        var Player = {
            index: 0,
            tracks: [],
            _volume: 0.5,
            _muted: false,
            pre_init: function (selector) {

                if (selector.length > 0 && selector.find('li').length > 0) {
                    //      this.container = selector;
                    var trackElements = selector.find('li').toArray();
                    var player = this;

                    trackElements.forEach(function (item, i) {


                        var url = $(item).data('url');
                        var artist = $(item).data('artist');
                        var desc_text = $(item).data('desc');

                        var trumb_url = $(item).data('trumb');
                        var genre = $(item).data('genre');

                        var title = $(item).text();
                        var trackAudio = document.createElement('audio');
                        trackAudio.index = i;
                        trackAudio.setAttribute('src', url);
                        trackAudio.setAttribute('title', title);
                        trackAudio.setAttribute('artist', artist);
                        trackAudio.setAttribute('desc', desc_text);

                        /* Play button */
                        var trackPlayButton = document.createElement('button');
                        $(trackPlayButton).text('');
                        $(trackPlayButton).addClass('play-track-btn');

                        /* Time label */
                        var trackTimeLabel = document.createElement('span');
                        $(trackTimeLabel).text('00:00');
                        $(trackTimeLabel).addClass('track-time-label');

                        /* Pause button */
                        var trackPauseButton = document.createElement('button');
                        $(trackPauseButton).text('');
                        $(trackPauseButton).addClass('pause-track-btn');

                        /* Prev button */
                        var trackPrevButton = document.createElement('button');
                        $(trackPrevButton).text('');
                        $(trackPrevButton).addClass('prev-track-btn');

                        /* Next button */
                        var trackNextButton = document.createElement('button');
                        $(trackNextButton).text('');
                        $(trackNextButton).addClass('next-track-btn');

                        /* Loop button */
                        var trackLoopButton = document.createElement('button');
                        $(trackLoopButton).text('');
                        $(trackLoopButton).addClass('loop-track-btn');

                        /* Mute button */
                        var trackMuteButton = document.createElement('button');
                        $(trackMuteButton).text('');
                        $(trackMuteButton).addClass('mute-track-btn');

                        /* iTunes link */
                        var trackLink = document.createElement('a');
                        trackLink.setAttribute('href', url);
                        $(trackLink).addClass('track-link');

                        /* Seek bar */
                        var seekBar = document.createElement('div');
                        $(seekBar).addClass('seek-bar');

                        var playBar = document.createElement('div');
                        $(playBar).addClass('play-bar');

                        seekBar.appendChild(playBar);

                        /* Volume bar */
                        var volumeBar = document.createElement('div');
                        $(volumeBar).addClass('volume-bar');

                        var volumeBarValue = document.createElement('div');
                        $(volumeBarValue).addClass('volume-bar-value');

                        volumeBar.appendChild(volumeBarValue);

                        /* Mobile Seek bar */
                        var mobileSeekBar = document.createElement('div');
                        $(mobileSeekBar).addClass('mobile-seek-bar');

                        player.tracks.push({
                            'need-event': true,
                            'need-render': true,
                            'need-setup': true,
                            'audio': trackAudio,
                            'play-button': trackPlayButton,
                            'pause-button': trackPauseButton,
                            'time-label': trackTimeLabel,
                            'prev-button': trackPrevButton,
                            'next-button': trackNextButton,
                            'loop-button': trackLoopButton,
                            'mute-button': trackMuteButton,
                            'seek-bar': seekBar,
                            'play-bar': playBar,
                            'volume-bar': volumeBar,
                            'volume-bar-value': volumeBarValue,
                            'li': item
                        });
                    });


                    this.render();
                    this.addEvents();
                    this.setup();
                }
            },
            render: function () {
                if (this.tracks.length) {
                    var player = this;
                    player.tracks.forEach(function (it, i) {

                        if (player.tracks[i]['need-render'] === true) {
                            $(player.tracks[i]['li']).html('');
                            $(player.tracks[i]['li']).append(player.tracks[i]['audio']);

                            var trackNameContainer = document.createElement('div');
                            $(trackNameContainer).addClass('track-name-container');
                            $(trackNameContainer).append(player.tracks[i]['play-button']);
                            $(trackNameContainer).append('<span class="track-desc">asdasdasd</span>');
                            $(trackNameContainer).append('<span class="track-name">' + player.tracks[i]['audio'].getAttribute('title') + '</span>');

                            $(player.tracks[i]['li']).append(trackNameContainer);

                            var progressBar = document.createElement('div');
                            $(progressBar).addClass('progress-bar');
                            $(progressBar).append(player.tracks[i]['time-label']);
                            $(player.tracks[i]['time-label']).wrap('<div class="time-label-container"></div>');
                            $(progressBar).append(player.tracks[i]['seek-bar']);
                            $(player.tracks[i]['li']).append(progressBar);

                            var controlBar = document.createElement('div');
                            $(controlBar).addClass('control-bar');
                            $(controlBar).append(player.tracks[i]['pause-button']);
                            $(controlBar).append(player.tracks[i]['prev-button']);
                            $(controlBar).append(player.tracks[i]['next-button']);
                            $(controlBar).append(player.tracks[i]['loop-button']);
                            $(player.tracks[i]['li']).append(controlBar);

                            var volumeControlContainer = document.createElement('div');
                            $(volumeControlContainer).addClass('volume-control-container');
                            $(volumeControlContainer).append(player.tracks[i]['mute-button']);
                            $(volumeControlContainer).append(player.tracks[i]['volume-bar']);
                            $(player.tracks[i]['li']).append(volumeControlContainer);

                            $(player.tracks[i]['li']).wrapInner('<div class="container"><div class="row"><div class="col-xs-12 col-md-6 col-md-offset-3 inner"></div></div></div>');

                            player.tracks[i]['need-render'] = false;
                        }
                    });


                }
            },
            addEvents: function () {
                var player = this;

                player.tracks.forEach(function (item, i) {

                    if (item['need-event'] === true) {

                        var audio = $(item['audio'])[0];
                        audio.needLoop = false;

                        /* Load duration data for each track*/

                        // audio.onloadedmetadata = function () {
                        //
                        //     var m = i;
                        //     var minutes = Math.floor(player.tracks[m].audio.duration / 60).toFixed(0);
                        //     minutes = minutes < 10 ? "0" + minutes : minutes;
                        //     var seconds = (player.tracks[m].audio.duration - minutes * 60).toFixed(0);
                        //     seconds = seconds < 10 ? "0" + seconds : seconds;
                        //     player.tracks[m].durationLabel.innerHTML = minutes + ':' + seconds;
                        //
                        // };

                        /* Play button */
                        $(item['play-button']).on('click', function () {
                            if (audio.paused) {
                                audio.play();
                            } else {
                                audio.pause();
                            }
                        });

                        /* Pause button */
                        $(item['pause-button']).on('click', function () {
                            audio.pause();
                        });


                        /* Mute button */
                        $(item['mute-button']).on('click', function () {
                            if (audio.muted) {
                                audio.volume = audio.lastVolume;
                                $(this).removeClass('active');
                                audio.muted = false;
                            } else {
                                audio.lastVolume = audio.volume;
                                audio.volume = 0;
                                $(this).addClass('active');
                                audio.muted = true;
                            }
                        });

                        /* Audio events */
                        audio.addEventListener('play', function () {
                            var activeTrack = this;

                            player.tracks.forEach(function (item) {

                                var track = $(item['audio'])[0];

                                console.log("Track Index :: "+ track.index );
                                if (track.index != activeTrack.index) {
                                    track.pause();
                                    $(player.tracks[track.index]['play-button']).addClass('paused');
                                    $(player.tracks[track.index]['audio']).closest('li').removeClass('active');
//                                    $(player.trackContainers[track.index]).removeClass('active');
                                } else {
                                    player.activeTrack = track;

                                    $(player.tracks[player.activeTrack.index]['play-button']).removeClass('paused');
                                    $(player.tracks[player.activeTrack.index]['audio']).closest('li').addClass('active');
                                    //$(player.trackContainers[player.activeTrack.index]).addClass('active');
                                }
                            });

                            $(player.container).parent().addClass('active');

                            //    if (player.isMobile) {
                            if (true) {
                                $(player.mobileTrackPlayButton).removeClass('paused');
                            }

                            //  console.log(player._volume);

                            console.log(player._muted + " :: " + player._volume);

                            if (player._muted === true) {


                                this.volume = 0;
                                this.muted = true;

                            } else {

                                this.volume = player._volume;
                                this.muted = false;

                            }


                            var minutes = Math.floor(this.duration / 60).toFixed(0);
                            minutes = minutes < 10 ? "0" + minutes : minutes;
                            var seconds = (this.duration - minutes * 60).toFixed(0);
                            seconds = seconds < 10 ? "0" + seconds : seconds;


                            $(player.lengthLabel).text(minutes + ':' + seconds);


                        }, false);

                        audio.addEventListener('pause', function () {
                            if (this.index == player.activeTrack.index) {
                                $(player.container).parent().removeClass('active');
                                $(player.tracks[player.activeTrack.index]['play-button']).addClass('paused');

                                //  if (player.isMobile) {
                                if (true) {
                                    $(player.mobileTrackPlayButton).addClass('paused');
                                }
                            }
                        }, false);

                        audio.addEventListener('ended', function () {
                            audio.currentTime = 0;
                            $(item['play-bar']).width(0);

                            if (audio.needLoop == true) {
                                audio.play();
                            } else {
                                if (audio.index < player.tracks.length - 1) {
                                    var nextTrack = $(player.tracks[audio.index + 1]['audio'])[0];
                                    nextTrack.currentTime = 0;
                                    nextTrack.play();
                                }
                            }
                        }, false);

                        audio.addEventListener('volumechange', function () {
                            $(item['volume-bar-value']).width($(item['volume-bar']).width() * $(this).volume);
                        }, false);

                    }

                    item['need-event'] = false;
                });


                if (1 != 0) {
                } else {

                    $(player.mobileSeekBar).on('click', function (e) {

                        var ratio = player.activeTrack.duration / $(this).width();
                        player.activeTrack.currentTime = e.offsetX * ratio;
                        $(player.mobilePlayBar).width(player.activeTrack.currentTime / ratio);


                    });

                    $(player.mobileSeekBar).on('mousedown', function (e) {
                        this.mouseDowned = true;
                    });

                    document.addEventListener('mouseup', function () {
                        player.mobileSeekBar.mouseDowned = false;
                    });

                    $(player.mobileSeekBar).on('mousemove', function (e) {
                        if (this.mouseDowned) {

                            var ratio = player.activeTrack.duration / $(this).width();
                            player.activeTrack.currentTime = e.offsetX * ratio;
                            $(player.mobilePlayBar).width(player.activeTrack.currentTime / ratio);

                        }
                    });
                }
                //Track progress bar update timer
                setInterval(function () {


                    //if (!player.isMobile) {
                    if (false) {
                        player.tracks.forEach(function (item) {
                            var audio = $(item['audio'])[0];
                            var s = parseInt(audio.currentTime % 60);
                            s = (s < 10) ? '0' + s : s;
                            var m = parseInt((audio.currentTime / 60) % 60);
                            m = (m < 10) ? '0' + m : m;
                            $(item['time-label']).text(m + ':' + s);

                            if (!audio.paused && item['seek-bar'].mouseDowned != true) {
                                var ratio = $(item['seek-bar']).width() / audio.duration;
                                $(item['play-bar']).width(ratio * audio.currentTime);
                            }
                        });
                    } else {
                        if (player.activeTrack !== undefined) {
                            var ratio = $(player.mobileSeekBar).width() / player.activeTrack.duration;
                            $(player.mobilePlayBar).width(ratio * player.activeTrack.currentTime);
                        }


                        var curTime = player.activeTrack.currentTime;
                        var s = parseInt(curTime % 60);

                        s = (s < 10) ? '0' + s : s;
                        var m = parseInt((curTime / 60) % 60);
                        m = (m < 10) ? '0' + m : m;
                        $(player.timeLabel).text(m + ':' + s);
                    }
                }, 100);
            },
            setup: function (params) {

                var player = this;
                var volumeLevel = 0.5;

                this.tracks.forEach(function (item) {
                    var audio = $(item['audio'])[0];

                    audio.volume = volumeLevel;
                    player._volume = volumeLevel;
                    audio.lastVolume = volumeLevel;
                    $(item['play-button']).addClass('paused');


                });

                // set default value

                if (volumeLevel < 0) {
                    volumeLevel = 0;
                } else if (volumeLevel > 1) {
                    volumeLevel = 1;
                }

                var offsetX = volumeLevel * $(player.volumeBar).width();

                if (offsetX > $(player.volumeBar).width()) {
                    offsetX = $(player.volumeBar).width();
                }

                $(player.volumeBarValue).width(offsetX);
                player.activeTrack = player.tracks[0].audio;

               // console.log(player._volume);
            },
            addElems: function (selector) {
                this.pre_init(selector);
            }

        };

        Player.pre_init($(this));
        //Player.init($(this));
    };
    $.fn.audioplayerAdd_golosa = function () {

        if (Player) {
            Player.addElems($(this));
        }
    }

})(jQuery);