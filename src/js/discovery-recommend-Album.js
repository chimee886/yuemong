{
    let view = {
        el: '.recommendedAlbumList .swiper-wrapper',
        template: `
        <div data-id="{{album-id}}" class="swiper-slide album-slide">
                <div class="album-cover"><img src="{{album-cover}}" alt=""></div>
            <div class="album-info">
                <div>
                    <p class="album-name">{{album-name}}</p>
                </div>
            </div>
        </div>
        `,
        songTemplate: `
            <li data-song-id="{{song-id}}" class="song-iterm">
                <div class="song-cover">
                    <img class="lazy" data-original="{{songs-cover}}" alt="">
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
                //.replace('{{album-singer}}', data.singer)
        },
        songRender(data) {
            return this.songTemplate.replace('{{songs-cover}}', data.cover)
                .replace('{{songs-name}}', data.name)
                .replace('{{songs-singer}}', data.singer)
                .replace('{{song-id}}', data.id)
        },
        show() {
            $('.recommendedAlbumList .album-slide').on('click', () => {
                console.log('点击了')
                $('.discover-home,.touchbar').hide(200)
                $('.discover .album-container').show(200)
            })
        },
        lazyload() {
            $("img.lazy").lazyload({
                effect: "fadeIn"
            });
        },
        return () {
            let returnBtn = $('.discover .album-container .return')
            returnBtn.on('click', () => {

                $('.discover-home,.touchbar').show(200)
                $('.discover .album-container').hide(200)
            })
        }
    }
    let model = {
        recommendedAlbumList: [],
        songs: [],
        getRecommendedAlbumList() { //获取发现页的推荐歌单数据
            return new Promise(function(resolve, reject) {
                $.ajax({
                    // type: 'get',
                    url: 'http://106.13.208.121:3000/recommend/resource?cookie=' + localStorage.getItem('cookie'),
                    xhrFields: {
                        withCredentials: true
                    },
                    　　　　 // 允许跨域
                    crossDomain: true,
                    success: function(response) {
                        console.log('歌单', response)
                            //将获取到的数据处理后存储到本地
                        model.recommendedAlbumList = response.recommend.map((list) => {
                            return { id: list.id, cover: list.picUrl, name: list.name }
                        })
                        resolve()
                    },
                    error: function(req) {
                        console.log('req', req)
                        reject()
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
            this.model.getRecommendedAlbumList().then(() => {
                for (let i = 0; i < this.model.recommendedAlbumList.length; i++) {
                    //生成dom
                    this.view.$el.append(this.view.render(this.model.recommendedAlbumList[i]))
                }
                this.view.show()
                this.getAblumSongList()
            })
            this.view.return()
        },
        getAblumSongList() {
            $('.recommendedAlbumList .album-slide').on('click', (e) => {

                console.log('点击了2')


                $('.discover .album-container .single-album-loader').show()

                $(window).unbind('scroll')
                    //歌曲渲染分页
                this.model.songs = []
                let page
                page = 1
                console.log('page', page)
                let albumId = e.currentTarget.dataset.id

                $('.discover .single-album ul').html('')
                    // identifyFavoriteSong()

                $.get('http://106.13.208.121:3000/playlist/detail?id=' + albumId)
                    .then((response) => {
                        //更换歌单详情页的封面和名字
                        let albumInfo = {}
                        albumInfo.name = response.playlist.name
                        albumInfo.cover = response.playlist.coverImgUrl
                        $('.discover .album-container .single-album-name').text(albumInfo.name)
                        $('.discover .album-container .album-bg img').attr('src', albumInfo.cover)
                        console.log('歌单', response)
                            //将获取到的数据处理后存储到本地
                        let songsId = response.playlist.trackIds
                            // model.recommendedAlbumList = response.recommend.map((list) => {
                            //     return { id: list.id, cover: list.picUrl, name: list.name }
                            // })



                        console.log(songsId.length)
                            // 定义每页歌曲的数量

                        let rankSongsNumber = 20
                            // ranks表示总的页数
                        let ranks = Math.ceil(songsId.length / rankSongsNumber)
                        console.log('ranks', ranks)



                        // 当前分页内的所有歌曲
                        let pageSongs = songsId.slice((page - 1) * rankSongsNumber, page * rankSongsNumber)
                            // console.log('list', pageSongs)
                        let ids = ''
                        for (let i = 0; i < pageSongs.length; i++) {
                            ids += pageSongs[i].id + ','
                        }
                        ids = ids.substring(0, ids.length - 1)
                            // console.log(ids)
                        console.log('ids,page,rankSongsNumber', ids, page, rankSongsNumber)
                        this.generateSong(ids, page, rankSongsNumber)



                        // 检测滚动到浏览器底部
                        $(window).on('scroll', () => {　　
                            console.log('page1', page, 'ranks', ranks)　
                            var scrollTop = $(window).scrollTop();　　
                            var scrollHeight = $(document).height();　　
                            var windowHeight = $(window).height();　　
                            if (scrollTop + windowHeight >= scrollHeight - 10) {　

                                console.log('page', page, 'ranks', ranks)　　　
                                if (page === ranks) {
                                    console.log('没有更多了')
                                        // $('.discover .single-album ul').append('<p class="null_text">没有更多歌曲了哦</p>')
                                } else {
                                    // console.log('到底部了')
                                    $('.discover .album-container .single-album-loader').show()
                                    page++
                                    pageSongs = songsId.slice((page - 1) * rankSongsNumber, page * rankSongsNumber)
                                        // console.log('list', pageSongs)
                                    let ids = ''
                                    for (let i = 0; i < pageSongs.length; i++) {
                                        ids += pageSongs[i].id + ','
                                    }
                                    ids = ids.substring(0, ids.length - 1)
                                    console.log(ids)
                                    this.generateSong(ids, page, rankSongsNumber)
                                }




                            }
                        })






                    }, (request) => {
                        console.log(request)
                        alert(JSON.stringify(request))
                    })
            })
        }

        ,
        generateSong(ids, page, rankSongsNumber) {
            $.get('http://106.13.208.121:3000/song/detail?ids=' + ids)
                .then((res) => {
                        console.log(res)
                        model.songs = model.songs.concat(res.songs.map((song) => {
                            return { id: song.id, name: song.name, singer: song.ar[0].name, cover: song.al.picUrl + '?param=500y500' }
                        }))

                        console.log('model.songs', model.songs)
                            // console.log(model.songs)
                            //获取到搜索数据后，隐藏loading动画
                        $('.discover .album-container .single-album-loader').hide()

                        if (model.songs.length < 1) {
                            let nullTemplate = `
                    <div class="null_comment">
                        <div class="null_img">
                            <img src="./src/img/null.png" alt="没有评论">
                        </div>
                        <p class="null_text">没有歌曲哦</p>
                    </div>
                    `
                            $('.discover .single-album ul').append(nullTemplate)
                        } else {
                            //生成渲染dom

                            let pageSongs1 = model.songs.slice((page - 1) * rankSongsNumber, page * rankSongsNumber)


                            for (let i = 0; i < pageSongs1.length; i++) {
                                $('.discover .single-album ul').append(view.songRender(pageSongs1[i]))
                            }
                            //绑定点击事件

                            this.playSong()
                            changePlayStatus(getQueryVariable('id'))
                            console.log('this', this)

                        }
                        $("img.lazy").lazyload({
                            effect: "fadeIn"
                        });

                    },
                    (req) => {
                        console.log(req)
                        alert(req.responseText)
                    })
        }

        ,
        playSong() {
            $('.discover .single-album ul').on('click', 'li', (e) => {
                e.preventDefault()
                isPlay = true
                let li = e.currentTarget

                //获取dom里面的歌曲id
                let id = Number($(li).attr('data-song-id'))
                let index
                console.log(id)
                console.log(this.model)

                //根据id在数据里面查找url
                for (let i = 0; i < this.model.songs.length; i++) {
                    if (this.model.songs[i].id === id) {
                        index = i
                        console.log(i)
                        break
                    }
                }

                console.log('this.model.songs')
                console.log(this.model.songs)
                console.log(index)
                this.changeSongInfo(this.model.songs[index], li)

                playListIndex.push(index)

                //控制歌曲暂停与播放
                window.isPlaying()
                    //给当前播放的歌曲列表添加背景色 

                generateUrl(id)
                playList = this.model.songs
                currentSongId = id
                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色

            })
        },
        changeSongInfo(data, li) { //将当前播放歌曲的数据渲染到dom

            let allCover = $('.player-cover>img')
            let audio = $('#audio')
            console.log('有问题', data)
            console.log('this', this.model.songs)
            if (!data.url) {
                console.log('url没有')
                let getUrl = getNeteaseSongUrl(data.id)
                if (getUrl) {
                    data.url = getUrl
                    audio.attr('src', data.url)
                    console.log('data.url', data.url)


                    $('#player').find('.player-name').text(data.name)
                    $('#player').find('.player-singer').text(data.singer)
                        //替换2处封面

                    for (let i = 0; i < allCover.length; i++) {
                        $(allCover[i]).attr('src', data.cover)
                    }
                    console.log('li', li)

                    //替换audio标签的src

                    audio.attr('src', data.url)
                    $('.song-iterm').removeClass('playing')
                    $(li).addClass('playing')

                } else {
                    alert('没有版权')
                    console.log('data.url', data.url)
                }
            } else {
                console.log('url有了')
                audio.attr('src', data.url)

                $('#player').find('.player-name').text(data.name)
                $('#player').find('.player-singer').text(data.singer)

                for (let i = 0; i < allCover.length; i++) {
                    $(allCover[i]).attr('src', data.cover)
                }

                //替换audio标签的src
                audio.attr('src', data.url)
                $('.song-iterm').removeClass('playing')
                $(li).addClass('playing')

            }

            //给当前播放的歌曲列表添加背景色
            //this.view.changePlayStatus(data.id)
            //this.generateUrl(data.id) //生成当前歌曲的url地址

        },
        generateUrl(data) { //将当前歌曲的歌曲url地址放到地址栏
            let host = window.location.host
            let url = 'http://' + host + '?id=' + data
            history.replaceState('null', 'null', url)
        }
    }
    controller.init(view, model)
}