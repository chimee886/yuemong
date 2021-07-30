{
    let view = {
        el: '#netEaseNewMusic',
        template: `
        <li data-song-id="{{song-id}}" class="song-iterm">
            <div class="song-cover">
                <img  src="{{songs-cover}}" alt="">
            </div>
            <div class="song-info">
                <p class="song-name">{{songs-name}}</p>
                <p class="song-singer">{{songs-singer}}-{{song-album}}</p>
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
                .replace('{{song-album}}', data.album)
        },
    }
    let model = {
        newSongList: [],
        index: 0,
        getNewSongList() { //获取首页新歌列表
            return new Promise(function(resolve, reject) { //获取发现页最新歌曲列表
                $.ajax({
                    type: 'get',
                    url: 'http://106.13.232.115:3000/recommend/songs?cookie=' + localStorage.getItem('cookie'),
                    xhrFields: {
                        withCredentials: true
                    },
                    　　　　 // 允许跨域
                    crossDomain: true,
                    success: function(response) {
                        //将获取到的数据处理后存储到本地
                        console.log(response)
                        model.newSongList = response.data.dailySongs.map((list) => {
                            return { source: 1, id: list.id, cover: list.al.picUrl + '?param=300y300', name: list.name, singer: list.ar[0].name, album: list.al.name }
                        })
                        console.log(model.newSongList)
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
            this.model.getNewSongList().then(() => {
                //将歌曲渲染到发现页面
                for (let i = 0; i < this.model.newSongList.length; i++) {
                    this.view.$el.append(this.view.render(this.model.newSongList[i]))
                }
                console.log(playList)
                console.log(this.model.newSongList)
                console.log('this.model.newSongList')
                this.playNeteaseSong('#netEaseNewMusic', this.model.newSongList)





                //this.changeSongInfo()
            })
        },
        playNeteaseSong(ul, model) {
            $(ul).off().on('click', 'li', (e) => {
                //let songId = e.currentTarget.dataset.songId
                let li = e.currentTarget

                //获取dom里面的歌曲id
                let id = Number($(li).attr('data-song-id'))
                let index
                console.log(id)

                //根据id在数据里面查找url
                for (let i = 0; i < this.model.newSongList.length; i++) {
                    //console.log(this.model.newSongList[i].id)
                    if (this.model.newSongList[i].id === id) {
                        index = i
                        break
                    }
                }
                console.log(index)
                this.changeSongInfo(this.model.newSongList[index], li)
                $('#audio')[0].play()
                isPlay = true
                window.isPlaying()
                playList = this.model.newSongList
                console.log('playlist', playList)
                generateUrl(id)
                currentSongId = id
                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色
                    //给当前播放的歌曲列表添加背景色 
                $('.song-iterm').removeClass('playing')
                $(li).addClass('playing')

            })
        },
        changeSongInfo(data, li) { //将当前播放歌曲的数据渲染到dom

            let allCover = $('.player-cover>img')
            let audio = $('#audio')



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
                console.log('没有版权')
                console.log('data.url', data.url)
                $('.next').trigger('click')
            }


            //给当前播放的歌曲列表添加背景色
            //this.view.changePlayStatus(data.id)
            //this.generateUrl(data.id) //生成当前歌曲的url地址

        }
    }
    controller.init(view, model)
}