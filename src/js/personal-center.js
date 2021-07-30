{
    let view = {
        el: '#personal-home',
        template: `
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
            this.viewFavoriteSong()
            this.returnPre()
        },
        viewFavoriteSong() {
            let favorite = this.view.$el.find('#favorite-library')
            favorite.on('click', () => {
                $('#favorite-list .null_comment').hide() //隐藏列表为空时展示的元素
                $('#favorite-list .comments-list').html('') //清空上一次生成的歌曲列表
                $('#favorite-list .single-album-loader').show() //显示loading动画

                $('#favorite-list').show()
                    .siblings().hide(150)
                $('.touchbar').hide()

                let uuser = localStorage.getItem('uuser')
                let userObjectId = uuser.split('&')[0] //数据库里的用户objId
                let userId = uuser.split('&')[1] //数据库里自定义的userId
                let data = {
                    userObjectId: userObjectId,
                    userId: userId

                }
                console.log('本地的data')
                console.log(data)


                $.post('http://106.13.232.115:9999/viewFavorite', JSON.stringify(data)) //调用请求验证码接口
                    .then((response) => {

                        $('#favorite-list .single-album-loader').hide() //隐藏loading动画


                        console.log(JSON.parse(response))
                        let songs = JSON.parse(response)
                        this.model.songs = songs.map((song) => {
                            return { url: song.url, cover: song.cover, id: song.id, name: song.name, singer: song.singer }
                        })
                        console.log(this.model.songs)

                        if (songs.length < 1) {
                            $('#favorite-list .null_comment').show()
                        } else {
                            let ul = $('#favorite-list .comments-list')
                            for (let i = 0; i < songs.length; i++) {
                                let li = view.render(songs[i])
                                ul.append(li)
                            }
                        }

                        this.playSong()
                            //图片懒加载方法
                        $("img.lazy").lazyload({
                            effect: "fadeIn"
                        });

                    }, (request) => {
                        alert(request.responseText)
                        console.log(request)
                    })

            })
        },
        returnPre() {
            $('#favorite-list .return').on('click', function() {
                $('#personal-home').show(150)
                    .siblings().hide()
                $('.touchbar').show()

            })
        },

        playSong() {
            $('#favorite-list .comments-list').on('click', 'li', (e) => {
                e.preventDefault()
                let li = e.currentTarget

                //获取dom里面的歌曲id
                let id = $(li).attr('data-song-id')
                let index

                //根据id在数据里面查找url
                for (let i = 0; i < this.model.songs.length; i++) {
                    if (this.model.songs[i].id === id) {
                        index = i
                        break
                    }
                }

                console.log('this.model.songs')
                console.log(this.model.songs)
                console.log(index)
                this.changeSongInfo(this.model.songs[index])

                playListIndex.push(index)

                //控制歌曲暂停与播放
                $('#audio')[0].play()
                isPlay = true
                window.isPlaying()
                    //给当前播放的歌曲列表添加背景色 
                $('.song-iterm').removeClass('playing')
                $(li).addClass('playing')

                playList = this.model.songs
                currentSongId = id
                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色

            })
        },
        changeSongInfo(data) { //将当前播放歌曲的数据渲染到dom
            console.log(data)

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
            //给当前播放的歌曲列表添加背景色
            this.view.changePlayStatus(data.id)
            this.generateUrl(data.id) //生成当前歌曲的url地址

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