{
    let view = {
        el: '.netease_search_list>ul',
        template: `
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
            return this.template.replace('{{songs-cover}}', data.cover)
                .replace('{{songs-name}}', data.name)
                .replace('{{songs-singer}}', data.singer)
                .replace('{{song-id}}', data.id)
        },
        changePlayStatus(id) { //查询当前播放歌曲id，并改变dom样式
            let li = $('.song-iterm')
                //li.removeClass('playing')
            let li1 = []
            for (let i = 0; i < li.length; i++) {
                let songId = li[i].dataset.songId
                if (songId === id) {
                    li1.push(li[i])
                }

            }
            li.removeClass('playing')
            for (let i = 0; i < li1.length; i++) {
                $(li1[i]).addClass('playing')

            }
        }
    }
    let model = {
        songs: []
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventListener()
        },
        bindEventListener() {
            //获得焦点处理事件
            $('#netease_search_ipt').on('focus', () => {
                $('.recommendedList').hide(150)
                $('.player-min').hide()
                $('.search_cancel').show()
                $('.touchbar').hide()
            })

            //按下取消键处理事件
            $('.search_cancel').on('click', () => {
                $('.recommendedList').show(150)
                $('.player-min').show()
                $('#netease_search_ipt').val('')
                this.view.$el.html('')
                $('.search_list .single-album-loader').hide()
                $('.search_cancel').hide()
                $('.touchbar').show()
            })

            //按下enter键处理的事件
            $('#netease_search_ipt').on('keyup', (e) => {


                if (e.originalEvent.code === 'Enter') {
                    let searchVlue = $('#netease_search_ipt').val()
                    if (!searchVlue) {
                        alert('搜索内容为空')
                    } else {

                        //将已有的搜索结果清空
                        this.view.$el.html('')

                        //发起搜索后，显示loading动画
                        $('.netease_search_list .single-album-loader').show()

                        //点击enter，发起搜索请求
                        $.get('http://192.168.31.229:3000/search?keywords=' + searchVlue)
                            .then((response) => {
                                console.log(this)
                                console.log(response)
                                    //获取到所有搜索结果的歌曲id
                                let songsId = response.result.songs.map((song) => {
                                    return { id: song.id }
                                })

                                let ids = ''
                                for (let i = 0; i < songsId.length; i++) {
                                    if (i < songsId.length - 1) {
                                        ids += songsId[i].id + ','
                                    } else {
                                        ids += songsId[i].id
                                    }
                                }
                                console.log('ids', ids)
                                    //根据歌曲id，获取歌曲信息
                                $.get('http://192.168.31.229:3000/song/detail?ids=' + ids)
                                    .then((res) => {
                                            console.log(res)
                                            let songs = res.songs.map((song) => {
                                                return { id: song.id, name: song.name, singer: song.ar[0].name, cover: song.al.picUrl + '?param=500y500' }
                                            })
                                            this.model.songs = songs

                                            //---------------


                                            //获取到搜索数据后，隐藏loading动画
                                            $('.netease_search_list .single-album-loader').hide()

                                            if (this.model.songs.length < 1) {
                                                let nullTemplate = `
                                                    <div class="null_comment">
                                                        <div class="null_img">
                                                            <img src="./src/img/null.png" alt="没有评论">
                                                        </div>
                                                        <p class="null_text">没有搜到歌曲哦</p>
                                                    </div>
                                                    `
                                                this.view.$el.append(nullTemplate)
                                            } else {
                                                //生成渲染dom
                                                for (let i = 0; i < this.model.songs.length; i++) {
                                                    this.view.$el.append(this.view.render(this.model.songs[i]))
                                                }
                                                //绑定点击事件
                                                this.playSong()
                                                changePlayStatus(getQueryVariable('id'))
                                            }
                                            this.lazyLoad()
                                        },
                                        (req) => { console.log(req) })
                            }, (request) => {
                                console.log(request)
                                alert(JSON.stringify(request))
                            })
                    }
                }
            })
        },
        playSong() {
            this.view.$el.on('click', 'li', (e) => {
                e.preventDefault()
                isPlay = true
                let li = e.currentTarget

                //获取dom里面的歌曲id
                let id = Number($(li).attr('data-song-id'))
                let index
                console.log(id)

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
        },
        lazyLoad() {
            //图片懒加载方法
            $("img.lazy").lazyload({
                effect: "fadeIn"
            });
        }
    }
    controller.init(view, model)
}