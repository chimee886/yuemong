{
    let view = {
        el: '.songs-list>ul',
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
        },
        hideElement(element) {
            $(element).hide()
        }
    }
    let model = {
        songs: [],
        getSongs() {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'get',
                    url: 'http://192.168.31.135:9999/hotSongs',
                    success: function(response) {
                        model.songs = JSON.parse(response)
                        resolve()
                    },
                    error: function(xhr) {
                        console.log(xhr)
                        reject()
                    }
                })

                // 异步处理
                // 处理结束后、调用resolve 或 reject
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.getSongs().then(() => {
                //渲染歌曲列表

                //index为随机生成的0到n-1的整数

                this.view.hideElement('.loader')

                for (let i = 0; i < 25; i++) {
                    let index = Math.floor(Math.random() * 303)
                    this.view.$el.append(this.view.render(this.model.songs[index]))

                }
                this.playSong()
                this.lazyLoad()
                this.duration()
                this.initFirstSong()
                playList = this.model.songs //避免出现生成第一首歌曲之后，播放列表为空，无法点击控制下一曲

            }, () => {
                alert('获取失败,请稍后再试')
            })
        },
        playSong() {
            //以下代码是点击歌曲，切换播放并更换封面

            let ul = $('.songs-list>ul')
            ul.on('click', 'li', (e) => {
                e.preventDefault()
                isPlay = true
                let li = e.currentTarget

                //获取dom里面的歌曲id
                let id = $(li).attr('data-song-id')
                let index

                //根据id在数据里面查找url
                for (const key in this.model.songs) {
                    if (this.model.songs[key].id === id) {
                        index = key
                        break
                    }
                }
                this.changeSongInfo(this.model.songs[index])

                playListIndex.push(index)

                //控制歌曲暂停与播放
                window.isPlaying()
                    //给当前播放的歌曲列表添加背景色 
                $('.song-iterm').removeClass('playing')
                $(li).addClass('playing')

                playList = this.model.songs
                currentSongId = id
                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色
            })

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
        },
        duration() {
            //获取当前歌曲的总时长
            let musicDom = document.getElementsByTagName('audio')[0]; // 获取AudioDom节点
            musicDom.load(); //因为source标签不能直接更改路径，所以整个audio标签必须重新加载一次
            musicDom.oncanplay = function() {
                console.log("音乐时长", musicDom.duration); //音乐总时长
                //处理时长
                var time = musicDom.duration;
                //分钟
                var minute = time / 60;
                var minutes = parseInt(minute);
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                //秒
                var second = time % 60;
                var seconds = Math.round(second);
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                console.log('处理音乐时长', minutes + "：" + seconds)
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
        },
        initFirstSong() { //首次进入时在播放器生成一首歌
            if (!this.getQueryVariable('id')) { //地址栏没有id时，生成一个随机数到model里面去取一首歌
                let index = Math.floor(Math.random() * Object.keys(this.model.songs).length)
                console.log('this.model.songs[index]')
                console.log(this.model.songs[index])
                this.changeSongInfo(this.model.songs[index])
                currentSongId = this.model.songs[index].id
            } else {
                let urlId = this.getQueryVariable('id')
                let index
                for (let key in this.model.songs) {
                    if (this.model.songs[key].id === urlId) {
                        index = key
                            //this.changeSongInfo(this.model.songs[key])
                        break
                    } else {
                        index = Math.floor(Math.random() * Object.keys(this.model.songs).length)
                    }
                }
                this.changeSongInfo(this.model.songs[index])
                currentSongId = this.model.songs[index].id
            }
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
            this.view.changePlayStatus(data.id)
            this.generateUrl(data.id) //生成当前歌曲的url地址

        }
    }
    controller.init(view, model)
}