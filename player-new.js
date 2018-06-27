'use strict';
(function ($) {

    $.widget("custom.playerGF", {
        options: {
            volume: 0.5,
            volume_muted: -1,
            trackElements: [],
            list_items: [],
            activeTrack: null,
            last_down_and_move_index: null,
            bar_prev_button: null,
            bar_play_button: null,
            bar_next_button: null,
            bar_name_label: null,
            bar_progress: null,
            bar_seek: null,
            bar_volume: null,
            bar_volume_seek: null,
            mouse_down_volume: false,
            bar_volume_button: null,
        },

        _create: function () {

            var that = this;

            if ($(this.element).find('li').length > 0) {
                this.trackElements = this.element.children().toArray();
                this.trackElements.forEach(function (item, i) {

                    var track_name = $(item).data('track-name');
                    var audio_url = $(item).data('audio-src');
                    var artist_name = $(item).data('artist');
                    var track_long = $(item).data('track-long');

                    var trackAudio = document.createElement('audio');
                    trackAudio.index = i;
                    trackAudio.setAttribute('src', audio_url);
                    trackAudio.setAttribute('title', track_name);
                    trackAudio.setAttribute('artist', artist_name);
                    var sourceAudio = document.createElement('source');
                    sourceAudio.setAttribute('src', audio_url);
                    sourceAudio.setAttribute('type', 'audio/mpeg');
                    trackAudio.appendChild(sourceAudio);

                    that.options.list_items.push({
                        'audio': trackAudio,
                        'list_item': item,
                        'trackName': track_name,
                        'audio_url': audio_url,
                        'artist_name': artist_name,
                        'track_long': track_long,
                        'track_long_element': null,
                        'play_button': null,
                        'progress_bar': null,
                        'seek_bar': null,
                        'mouseDowned': false,
                    })
                });

            }
            if (this.options.list_items.length > 0) {
                this._renderPlayer();
                this._addEvents();
            }
        },
        _renderPlayer: function () {

            this.options.list_items.forEach(function (item, i) {

                var buttons = document.createElement("div");
                buttons.setAttribute("class", "ui-audio-list__item--buttons");
                var play_button = document.createElement("button");
                play_button.setAttribute("class", "play on_pause");

                buttons.appendChild(play_button);
                item.list_item.appendChild(buttons);
                item.play_button = play_button;

                // Add label with name and artist

                var labels = document.createElement("div");
                labels.setAttribute("class", "ui-audio-list__item--labels");

                var name_label = document.createElement("div");
                name_label.setAttribute("class", "name");
                name_label.innerHTML = item.trackName;

                var divider = document.createElement("div");
                divider.setAttribute("class", "divider");
                divider.innerHTML = "-";

                var artist_label = document.createElement("div");
                artist_label.setAttribute("class", "artists");
                artist_label.innerHTML = item.artist_name;

                labels.appendChild(name_label);
                labels.appendChild(divider);
                labels.appendChild(artist_label);

                item.list_item.appendChild(labels);

                // Add controls label

                var controls = document.createElement("div");
                controls.setAttribute("class", "ui-audio-list__item--controls");

                var button_prev = document.createElement("button");
                button_prev.setAttribute("class", "prev");

                var button_next = document.createElement("div");
                button_next.setAttribute("class", "next");

                controls.appendChild(button_prev);
                controls.appendChild(button_next);

                item.list_item.appendChild(controls);

                // Add time Time

                var time_left = document.createElement("div");
                time_left.setAttribute("class", "ui-audio-list__item--left_time");
                time_left.innerHTML = "0:00";

                var time_long = document.createElement("div");
                time_long.setAttribute("class", "ui-audio-list__item--time");
                time_long.innerHTML = item.track_long;


                item.list_item.appendChild(time_left);
                item.list_item.appendChild(time_long);
                item.track_long_element = time_long;
                item.time_left = time_left;

                // Add time_controls

                var proggress_bar = document.createElement("div");
                proggress_bar.setAttribute("class", "ui-audio-list__item--progress");

                var seek_bar = document.createElement("div");
                seek_bar.setAttribute("class", "seek-bar");
                proggress_bar.appendChild(seek_bar);

                item.progress_bar = proggress_bar;
                item.seek_bar = seek_bar;
                item.list_item.appendChild(proggress_bar);


            });

            // Create Player Bar

            var player_bar = document.createElement("div");
            player_bar.setAttribute("class", "ui-player-bar");

            var bar_prev_button = document.createElement("div");
            bar_prev_button.setAttribute("class", "ui-player-bar--prev");

            var bar_play_button = document.createElement("div");
            bar_play_button.setAttribute("class", "ui-player-bar--play on_pause");
            this.options.bar_play_button = bar_play_button;

            var bar_next_button = document.createElement("div");
            bar_next_button.setAttribute("class", "ui-player-bar--next");

            var name_label = document.createElement("div");
            name_label.setAttribute("class", "ui-player-bar--label");
            this.options.bar_name_label = name_label;

            var bar_progress = document.createElement("div");
            bar_progress.setAttribute("class", "ui-player-bar--progress");
            this.options.bar_progress = bar_progress;

            var bar_seek = document.createElement("div");
            bar_seek.setAttribute("class", "ui-player-bar--seek");
            this.options.bar_seek = bar_seek;

            bar_progress.appendChild(bar_seek);

            var bar_volume = document.createElement("div");
            bar_volume.setAttribute("class", "ui-player-bar--volume");
            this.options.bar_volume = bar_volume;

            var bar_volume_seek = document.createElement("div");
            bar_volume_seek.setAttribute("class", "ui-player-bar--volume__seek");
            bar_volume.appendChild(bar_volume_seek);
            this.options.bar_volume_seek = bar_volume_seek;

            var bar_volume_button = document.createElement("div");
            bar_volume_button.setAttribute("class", "ui-player-bar--volume_button");
            this.options.bar_volume_button = bar_volume_button;


            player_bar.appendChild(bar_prev_button);
            player_bar.appendChild(bar_play_button);
            player_bar.appendChild(bar_next_button);
            player_bar.appendChild(name_label);
            player_bar.appendChild(bar_progress);
            player_bar.appendChild(bar_volume);
            player_bar.appendChild(bar_volume_button);


            document.body.appendChild(player_bar);
            console.log("11");

        },
        _addEvents: function () {

            var that = this;

            this.options.list_items.forEach(function (item, i) {

                var audio = $(item["audio"])[0];

                audio.addEventListener('play', function () {
                    var current_activeTrack = this;
                    that.options.list_items.forEach(function (item_i, i) {
                        var track = $(item_i['audio'])[0];
                        if (track.index != current_activeTrack.index) {
                            track.pause();
                            $(item_i.play_button).addClass("on_pause");
                            $(item_i.list_item).removeClass("active");
                        } else {
                            console.log("play")
                            that.options.activeTrack = track;
                            $(item_i.play_button).removeClass("on_pause");
                            $(that.options.bar_play_button).removeClass("on_pause");
                            var minutes = Math.floor(track.duration / 60).toFixed(0);
                            minutes = minutes < 10 ? minutes : minutes;
                            var seconds = (track.duration - minutes * 60).toFixed(0);
                            seconds = seconds < 10 ? "0" + seconds : seconds;
                            item_i.track_long_element.innerHTML = minutes + ":" + seconds;
                            $(item_i.list_item).addClass("active");
                            that.setName(item_i.trackName + " - " + item_i.artist_name);
                        }
                    });
                    that.setVolume(that.options.volume);

                }, false);

                audio.addEventListener('onpause ', function () {
                }, false);


                audio.addEventListener('ended', function () {

                    if (that.mouseDowned == false) {
                        //audio.currentTime = 0;
                        var current_activeTrack = this;
                        that.options.list_items.forEach(function (item_i, i) {
                            var track = $(item_i['audio'])[0];
                            if (track.index != current_activeTrack.index) {

                            } else {

                                item_i['time_left'].innerHTML = item_i.track_long_element.innerHTML;
                                if (audio.index < that.options.list_items.length - 1) {
                                    var nextTrack = $(that.options.list_items[audio.index + 1]['audio'])[0];
                                    nextTrack.currentTime = 0;
                                    nextTrack.play();
                                } else {
                                    $(item["play_button"]).addClass("on_pause");
                                    $(that.options.bar_play_button).addClass("on_pause")
                                }
                            }
                        });
                    }
                }, false);


                $(item.play_button).on('click', function () {

                    that.options.activeTrack = $(item.audio)[0];
                    if ($(item["audio"])[0].paused) {
                        $(item["audio"])[0].play();
                    } else {
                        $(item["audio"])[0].pause();
                        $(item["play_button"]).addClass("on_pause");
                        $(that.options.bar_play_button).addClass("on_pause");
                    }
                });
                $(item.progress_bar).on('click', function (e) {
                    that.options.activeTrack = $(item.audio)[0];
                    var ratio = that.options.activeTrack.duration / $(this).width();
                    that.options.activeTrack.currentTime = e.offsetX * ratio;
                    $(item.seek_bar).width(that.options.activeTrack.currentTime / ratio);
                });
                $(item.progress_bar).on('mousedown', function (e) {
                    that.options.activeTrack = $(item.audio)[0];
                    that.options.last_down_and_move_index = $(item.audio)[0].index;
                    item.mouseDowned = true;
                });
                $(item.progress_bar).on('mouseup', function (e) {
                    that.options.last_down_and_move_index = -1;
                });




                document.addEventListener("mouseup", function (e) {
                    item.mouseDowned = false;
                });
            });


            document.addEventListener('mousedown', function (e) {
                that.mouseDowned = true;

            });
            document.addEventListener('mouseup', function (e) {
                that.mouseDowned = false;
                that.options.last_down_and_move_index = -1;
                that.options.mouse_down_volume = false;
            });
            window.addEventListener("mousemove", function (e) {
                if (that.options.activeTrack && that.mouseDowned && that.options.last_down_and_move_index > -1) {
                    var list_item = that.options.list_items[that.options.activeTrack.index];
                    if (e.clientX > that.getCoords(list_item.progress_bar).left && e.offsetX < that.getCoords(list_item.progress_bar).left + list_item.progress_bar.offsetWidth) {
                        var ratio = that.options.activeTrack.duration / list_item.progress_bar.offsetWidth;
                        var offset = e.clientX - that.getCoords(list_item.progress_bar).left;
                        that.options.activeTrack.currentTime = offset * ratio;
                        $(list_item.seek_bar).width(that.options.activeTrack.currentTime / ratio);
                    }
                } else if (that.options.mouse_down_volume){
                    if (e.clientX > that.getCoords(that.options.bar_volume).left && e.offsetX < that.getCoords(that.options.bar_volume).left + that.options.bar_volume.offsetWidth) {
                        var new_volume = (e.clientX - that.getCoords(that.options.bar_volume).left)/$(that.options.bar_volume).width();
                        console.log("new_volume :: "+new_volume)

                        that.disableMuteSetVolume(new_volume);
                    }
                }
            });

            $(".ui-player-bar--prev").on('click', function () {

                that.options.list_items.forEach(function (item_i, i) {
                    var track = $(item_i['audio'])[0];
                    if (track.index == that.options.activeTrack.index && track.index != 0) {
                        var prevTrack = $(that.options.list_items[i - 1]['audio'])[0];
                        prevTrack.play();
                    }
                });

            });
            $(".ui-player-bar--next").on('click', function () {
                that.options.list_items.forEach(function (item_i, i) {
                    var track = $(item_i['audio'])[0];
                    if (track.index == that.options.activeTrack.index && track.index != that.options.list_items.length - 1) {
                        var nextTrack = $(that.options.list_items[i + 1]['audio'])[0];
                        nextTrack.play();
                    }
                });
            });

            $(".ui-player-bar--play").on('click', function () {


                if ($(this).hasClass("on_pause")) {
                    if (that.options.activeTrack) {
                        that.options.list_items[that.options.activeTrack.index].audio.play();

                    } else {
                        that.options.list_items[0].audio.play();
                    }
                    $(this).removeClass("on_pause");
                } else {
                    if (that.options.activeTrack) {
                        that.options.list_items[that.options.activeTrack.index].audio.pause();
                        $(that.options.list_items[that.options.activeTrack.index].play_button).addClass("on_pause");
                        $(this).addClass("on_pause");
                    }
                }

            });

            setInterval(function () {
                that.options.list_items.forEach(function (item) {
                    if (that.options.activeTrack && that.options.activeTrack.index == item.audio.index) {
                        if (item.audio.ended) {
                        } else {
                            var audio = $(item['audio'])[0];
                            var s = parseInt(audio.currentTime % 60);
                            s = (s < 10) ? '0' + s : s;
                            var m = parseInt((audio.currentTime / 60) % 60);
                            m = (m < 10) ? m : m;
                            $(item['time_left']).text(m + ':' + s);
                            //console.log(audio.currentTime);
                            if (!audio.paused && that.mouseDowned != true) {
                                var ratio = $(item['progress_bar']).width() / audio.duration;
                                $(item['seek_bar']).width(ratio * audio.currentTime);

                                var ratio_bar = $(that.options.bar_progress).width() / audio.duration;
                                $(that.options.bar_seek).width(ratio_bar * audio.currentTime);

                            }
                        }
                    }
                });


            }, 100);


            // Add Event to volume in bar

            $(this.options.bar_volume).on('click', function (e) {
                that.disableMuteSetVolume(e.offsetX / $(this).width());
            });

            $(this.options.bar_volume).on('mousedown', function (e) {
                that.options.mouse_down_volume = true;
            });

            // Add Event button to bar

            $(this.options.bar_volume_button).on('click', function (e) {
                if (that.options.volume_muted < 0 ){
                    that.options.volume_muted = that.options.volume;
                    that.setVolume(0);
                    $(that.options.bar_volume_button).addClass("muted");
                } else {
                    that.setVolume(that.options.volume_muted);
                    that.options.volume_muted = -1;
                    $(that.options.bar_volume_button).removeClass("muted");
                }
            });



            this.setVolume();

        },

        destroy: function () {
            // remove this instance from $.ui.mywidget.instances
            var element = this.element,
                position = $.inArray(element, $.ui.mywidget.instances);

            // if this instance was found, splice it off
            if (position > -1) {
                $.ui.mywidget.instances.splice(position, 1);
            }

            // call the original destroy method since we overwrote it
            $.Widget.prototype.destroy.call(this);
        },

        _getOtherInstances: function () {
            var element = this.element;

            return $.grep($.ui.mywidget.instances, function (el) {
                return el !== element;
            });
        },

        _setOption: function (key, value) {
            this.options[key] = value;

            switch (key) {
                case "something":
                    // perform some additional logic if just setting the new
                    // value in this.options is not enough.
                    break;
            }
        },

        getCoords: function (elem) {
            // (1)
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docEl = document.documentElement;

            // (2)
            var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

            // (3)
            var clientTop = docEl.clientTop || body.clientTop || 0;
            var clientLeft = docEl.clientLeft || body.clientLeft || 0;

            // (4)
            var top = box.top + scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return {
                top: top,
                left: left
            };
        },
        setName: function (text) {
            this.options.bar_name_label.innerHTML = text;
        },
        setVolume: function (value) {

            if (value !=null) {
                if (value>1){
                    value = 1;
                } else if (value<0.06){
                    value = 0;
                }
                value>1? value = 1 : "";
                value<0? value = 0 : "";
                this.options.volume = value;
                console.log(this.options.volume);
            }
            $(this.options.bar_volume_seek).width($(this.options.bar_volume).width() * this.options.volume);

            if (this.options.activeTrack){
                this.options.activeTrack.volume = this.options.volume;
            }
        },
        disableMuteSetVolume: function (value) {
            if (value !=null && value<0.06) {
                this.options.volume_muted = 0;
                $(this.options.bar_volume_button).addClass("muted");
                this.setVolume(0);
            } else {
                this.options.volume_muted = -1;
                $(this.options.bar_volume_button).removeClass("muted");
                this.setVolume(value);
            }

        }
    });


})(jQuery);