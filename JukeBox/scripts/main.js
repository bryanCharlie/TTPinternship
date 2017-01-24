jQuery(document).ready(function($) {
    // Widget settup
    var widget = {
            init: function(width, height, pic, functionality) {
                this.width = width;
                this.height = height;
                this.pic = pic;
                this.functionality = functionality;
                this.$elem = null;
            },
            insert: function() {
                if (this.$elem) {
                    this.$elem.css({
                        "height": this.height + 'px',
                        "width": this.width + 'px',
                        "background-image": 'url( imgs/' + this.pic + ')'
                    });
                }
            },
            error: function(error) {
                console.log(error);
            }
        }
        //create a new Button "object"
    var Button = Object.create(widget);

    Button.setup = function(width, height, pic, functionality, id) {
        this.init(width, height, pic, functionality);
        this.$elem = $('#' + id);
    }

    Button.build = function() {
            this.insert();
            this.$elem.click(this.onClick.bind(this));
        }
        //Button click functions
    Button.onClick = function(e) {
            if (this.functionality == 'back') {
                jukeBox.back();
            } else if (this.functionality == 'pause') {
                if (this.pic == 'pause.png') {
                    jukeBox.pause();
                    this.pic = 'play-button.png';
                    this.$elem.css({
                        "background-image": 'url( imgs/' + this.pic + ')'
                    });
                } else if (this.pic == 'play-button.png') {
                    jukeBox.play();
                    this.pic = 'pause.png';
                    this.$elem.css({
                        "background-image": 'url( imgs/' + this.pic + ')'
                    });
                }
            } else if (this.functionality == 'forward') {
                jukeBox.forward();
            } else if (this.functionality == 'search') {
                e.preventDefault();
                var title = $('#song-input').val();
                $.ajax({
                    type: "GET",
                    url: "https://api.spotify.com/v1/search",
                    data: {
                        q: title,
                        type: 'track'

                    },
                    success: function(response) {
                        var song = response.tracks.items[0].preview_url;
                        $('.audio-container').append('<audio> <source src=' + song + ' type="audio/mpeg"> ' +
                            '</audio>');
                        jukeBox.refreshPlaylist();
                        jukeBox.refreshList();
                    }
                })
            }
        }
        //JUKEBOX functions
    var songFunctions = {
            init: function() {
                this.$playlist = $('.audio-container').children();
                this.refreshList();
                this.currentindex = 0;
            },
            back: function() {
                this.$playlist[this.currentindex].pause();
                this.$playlist[this.currentindex].currentTime = 0;
                this.currentindex = (this.currentindex - 1) < 0 ? 0 : --this.currentindex;
                this.$playlist[this.currentindex].play();
                console.log(this.currentindex);
            },
            forward: function() {
                this.$playlist[this.currentindex].pause();
                this.$playlist[this.currentindex].currentTime = 0;
                this.currentindex = ++this.currentindex % (this.$playlist.length);
                this.$playlist[this.currentindex].play();
                console.log(this.currentindex);
            },
            pause: function() {
                this.$playlist[this.currentindex].pause();
            },
            play: function() {
                this.$playlist[this.currentindex].play();
            },
            resetInterval: function() {
                this.$playlist[this.currentindex].currentTime = 0;
            },
            refreshPlaylist: function() {
                this.$playlist = $('.audio-container').children();
            },
            refreshList: function() {
                $('#list').empty();
                for (var i = 0; i < this.$playlist.length; i++) {
                    $('#list').append('<li> Track ' + (i + 1) + '</li>');
                }
            },
            setCurrentIndex: function(i) {
                this.currentindex = i;
            }
        }
        //change album image on input
    $('#song-input').on('keyup', function(e) {
        e.preventDefault();
        var title = $('#song-input').val();
        $.ajax({
            type: "GET",
            url: "https://api.spotify.com/v1/search",
            data: {
                q: title,
                type: 'track'

            },
            success: function(response) {
                console.log(response);
                var pic = response.tracks.items[0].album.images[0].url;
                console.log(pic);
                $('#song-img').attr('src', pic);
                $('#song-img').attr('height', 200);
                $('#song-img').attr('width', 200);
                $('#song-img').css('border', '6px solid black');
            }
        })

        if (title.length == 0) {
            $('#song-img').attr('src', "");
            $('#song-img').removeAttr('height');
            $('#song-img').removeAttr('width');
        }
    });

    $('#input-song').on('change', function(e) {
        $('.audio-container').append('<audio> <source src= "songs/' + this.value.replace(/.*[\/\\]/, '') + '" type="audio/mpeg"> ' +
            '</audio>');
        jukeBox.refreshPlaylist();
        jukeBox.refreshList();
    })

    $('ul').on('click', 'li', function() {
        var i = $('li').index(this);
        jukeBox.pause();
        jukeBox.resetInterval();
        jukeBox.setCurrentIndex(i);
        jukeBox.play();
        pauseButton.swapButton();
    })

    var jukeBox = Object.create(songFunctions);

    jukeBox.init();

    //"Instantiate" buttons
    var backButton = Object.create(Button);
    var pauseButton = Object.create(Button);
    var forwardButton = Object.create(Button);
    var searchButton = Object.create(Button);

    pauseButton.swapButton = function() {
        this.pic = 'pause.png';
        this.$elem.css({
            "background-image": 'url( imgs/' + this.pic + ')'
        });
    }

    //Set Button images
    backButton.setup(128, 128, 'back.png', 'back', 'back');
    backButton.build();
    pauseButton.setup(128, 128, 'play-button.png', 'pause', 'pause');
    pauseButton.build();
    forwardButton.setup(128, 128, 'forward.png', 'forward', 'forward');
    forwardButton.build();
    searchButton.setup(70, 70, '1484267146_plus_circle.png', 'search', 'search');
    searchButton.build();



});
