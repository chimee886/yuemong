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
                    url: 'http://192.168.31.135:3000/personalized/newsong?limit=20',
                    success: function(response) {
                        //将获取到的数据处理后存储到本地
                        console.log(response)
                        model.newSongList = response.result.map((list) => {
                            return { source: 1, id: list.id, cover: list.picUrl + '?param=500y500', name: list.name, singer: list.song.artists[0].name, album: list.song.album.name }
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
            $(ul).on('click', 'li', (e) => {
                //let songId = e.currentTarget.dataset.songId
                console.log(model)
                for (let i = 0; i < model.length; i++) {
                    if (!model[i].url) {
                        //在找到的songId里面加上url属性
                        console.log(i)
                        console.log(model[i].id)
                        console.log(getNeteaseSongUrl(model[i].id))
                        model[i].url = getNeteaseSongUrl(model[i].id)
                    } else {
                        console.log('url有了')
                        break
                    }
                }

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
                this.changeSongInfo(this.model.newSongList[index])
                $('#audio')[0].play()
                isPlay = true
                window.isPlaying()
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
            //给当前播放的歌曲列表添加背景色
            //this.view.changePlayStatus(data.id)
            //this.generateUrl(data.id) //生成当前歌曲的url地址

        }
    }
    controller.init(view, model)
}