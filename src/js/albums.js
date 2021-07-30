{
    let view = {
        el: '.albums-container .swiper-wrapper',
        template: `
        <div data-id="{{album-id}}" class="swiper-slide album-slide">
                <div class="album-cover"><img src="{{album-cover}}" alt=""></div>
            <div class="album-info">
                <div>
                    <p class="album-name">{{album-name}}</p>
                    <p class="album-singer">{{album-singer}}</p>
                </div>
            </div>
        </div>
        `,
        albumTemplate: `
        <li data-song-id="{{song-id}}" class="song-iterm">
            <div class="song-cover">
                <img class="lazy" src="{{songs-cover}}" alt="">
            </div>
            <div class="song-info">
                <p class="song-name">{{songs-name}}</p>
                <p class="song-singer">{{songs-singer}}</p>
            </div>
        </li>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            return this.template.replace('{{album-id}}', data.id)
                .replace('{{album-cover}}', data.cover)
                .replace('{{album-name}}', data.name)
                .replace('{{album-singer}}', data.singer)
        },
        albumSongRender(data) {
            return this.albumTemplate.replace('{{songs-cover}}', data.cover)
                .replace('{{songs-name}}', data.name)
                .replace('{{songs-singer}}', data.singer)
                .replace('{{song-id}}', data.id)
        },
        replaceAlbumHeader(data) {
            $('#home-page .album-bg img').attr('src', data.cover)
            $('#home-page .album-name .single-album-name').text(data.name)
        },
        changePlayStatus() { //查询当前播放歌曲id，并改变dom样式
            let li = $('.song-iterm')
                //li.removeClass('playing')
            let li1 = []
            for (let i = 0; i < li.length; i++) {
                let songId = li[i].dataset.songId
                if (songId === this.getQueryVariable('id')) {
                    //console.log(li[i])
                    li1.push(li[i])
                        //console.log(songId)
                }

            }
            //console.log(li1)
            li.removeClass('playing')
            for (let i = 0; i < li1.length; i++) {
                $(li1[i]).addClass('playing')

            }
        },
        getQueryVariable(variable) { //从地址栏获取歌曲id
            let query = window.location.search.substring(1)
            let vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
        }
    }
    let model = {
        album: {},
        allAlbums: [],
        currentAlbumSongs: {},
        getAlbums() { //获取首页的专辑列表
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'get',
                    url: 'http://106.13.232.115:9999/hotAlbums',
                    success: function(response) {
                        model.allAlbums = JSON.parse(response)
                        resolve()
                    }
                })
            })
        },
        getAlbumSongs(albumId) { //查询专辑里面的歌曲
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'get',
                    url: 'http://106.13.232.115:9999/albumSongs',
                    data: albumId,
                    dataType: 'text',
                    success: function(response) {
                        model.currentAlbumSongs = JSON.parse(response)
                        resolve()
                    }
                })
            })

        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.getAlbums().then(() => {
                for (let i = 0; i < this.model.allAlbums.length; i++) {
                    this.view.$el.append(this.view.render(this.model.allAlbums[i]))
                }
                this.viewAlbum()
            })
        },
        //点击专辑封面，进入专辑详情
        viewAlbum() {
            let allAlbums = $('#home-page .albums-container .album-slide')


            allAlbums.on('click', (e) => {
                e.preventDefault()
                    //点击把专辑数组置空，避免点下一个专辑出现上一个专辑的数据
                this.model.currentAlbumSongs = {}
                    //把上一次生成的html置空，不然会变成追加歌曲
                $('#home-page .single-album>ul').html('')
                    //获取渲染到dom的id
                let albumId = e.currentTarget.dataset.id
                    //获取专辑内的歌曲
                this.model.getAlbumSongs(albumId).then(() => {
                    let albumData = this.model.currentAlbumSongs
                    for (const key in albumData) {
                        $('#home-page .single-album>ul').append(this.view.albumSongRender(albumData[key]))
                    }
                    $('#home-page .single-album .single-album-loader').hide()
                        //调用图片懒加载，截图图片不显示问题 
                    this.view.changePlayStatus() //查询地址栏歌曲id，改变dom样式
                    this.lazyload()
                    this.playSong()
                })

                for (let i = 0; i < this.model.allAlbums.length; i++) {
                    if (albumId === this.model.allAlbums[i].id) {
                        this.view.replaceAlbumHeader(this.model.allAlbums[i])
                        break
                    }
                }


                let albumContainer = $('#home-page .album-container')
                albumContainer.show(150)
                    .siblings().hide(150)
                $('.touchbar').hide()
            })

        },
        playSong() {
            //以下代码是点击歌曲，切换播放并更换封面

            let ul = $('#home-page .single-album>ul')
            ul.on('click', 'li', (e) => {
                e.preventDefault()
                let li = e.currentTarget

                let id = $(li).attr('data-song-id')
                let index

                for (const key in this.model.currentAlbumSongs) {
                    if (this.model.currentAlbumSongs[key].id === id) {
                        index = key
                        break
                    }
                }
                playListIndex.push(index)
                this.changeSongInfo(this.model.currentAlbumSongs[index])

                $('#audio')[0].play()
                isPlay = true
                window.isPlaying()
                    //给当前播放的歌曲列表添加背景色 
                $('.song-iterm').removeClass('playing')
                $(li).addClass('playing')
                playList = this.model.currentAlbumSongs
                console.log(playList)
                currentSongId = id
                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色
            })

        },
        changeSongInfo(data) { //将当前播放歌曲的数据渲染到dom

            $('#player').find('.player-name').text(data.name)
            $('#player').find('.player-singer').text(data.singer)
                //替换audio标签的src
            let audio = $('#audio')
            audio.attr('src', data.url)
                //替换2处封面
            let allCover = $('.player-cover>img')
            for (let i = 0; i < allCover.length; i++) {
                $(allCover[i]).attr('src', data.cover)
            }
            //控制歌曲暂停与播放
            //给当前播放的歌曲列表添加背景色
            this.view.changePlayStatus(data.id)
            this.generateUrl(data.id) //生成当前歌曲的url地址

        },
        generateUrl(data) { //将当前歌曲的歌曲url地址放到地址栏
            let host = window.location.host
            let url = 'http://' + host + '?id=' + data
            history.replaceState('null', 'null', url)
        },
        lazyload() {
            $("img.lazy").lazyload({
                effect: "fadeIn"
            });
        }
    }
    controller.init(view, model)
}