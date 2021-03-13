{
    let view = {
        el: '#player',
        template: `
        <div class="timed-off-wrapper"></div>
        <div class="player-header clearfix">
            <div class="return">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
            </div>
            <div class="player-info">
                <p class="player-name">歌曲名字</p>
                <p class="player-singer">歌手</p>
            </div>
        </div>
        <div class="player-cover-max player-cover paused">
            <img src="">
        </div>
        <div class="functional-area">
            <span id="play-mode-btn"><img src="" alt=""></span>
            <span id="timed-off-btn"><img src="./src/icon/timedOff.png" alt=""></span>
            <span id="view-comments"><img src="./src/icon/checkComments.png" alt=""></span>
            <span  id="add-favorite"><img src="./src/icon/addToFavorites.png" alt=""></span>
        </div>
        <div class="player-controller clearfix">
            <div class="previous">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shangyibi"></use>
                </svg>
            </div>
            <div class="play-button controll">
                <div class="play-button-bg">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bofangda"></use>
                    </svg>
                </div>
            </div>
            <div class="pause-button controll hide">
                <div class="pause-button-bg">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zantingda"></use>
                    </svg>
                </div>
            </div>
            <div class="next">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiayibi"></use>
                </svg>
            </div>
        </div>
        `,
        init() {
            this.$el = $(this.el)
            this.$el.hide()
            this.$el.html(this.template)
        },
        changePlayStatus(id) { //查询当前播放歌曲id，并改变dom样式
            let li = $('.song-iterm')
                //li.removeClass('playing')
            let li1 = []
            for (let i = 0; i < li.length; i++) {
                let songId = li[i].dataset.songId
                if (songId == id) {
                    console.log(li[i])
                    li1.push(li[i])
                    console.log(songId)
                }

            }
            li.removeClass('playing')
            for (let i = 0; i < li1.length; i++) {
                $(li1[i]).addClass('playing')

            }
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
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.playPause()
            this.playerMixum()
            this.playerMax()
            this.nextSong()
            this.previousSong()
            this.autoNext()
            this.changePlayMode()
            this.timedOff()
            this.viewComments()
            this.autoPause()
            this.view.duration()
        },
        playPause() {
            //点击暂停按钮控制
            this.view.$el.find('.controll').on('click', (e) => {
                isPlay = !isPlay
                window.isPlaying()
            })

            // document.onkeypress = function(e) { //阻止按空格键页面滚动
            //     e.preventDefault()
            // }

            /* $('#player').onkeyup = function(e) { //按空格键控制音乐播放
                e.preventDefault()
                if (e.keyCode == 32) {
                    isPlay = !isPlay
                    window.isPlaying()
                }
            } */
        },
        playerMixum() {
            this.view.$el.find('.player-header>.return').on('click', (e) => {
                e.preventDefault()
                this.view.$el.hide(150)
                $('.home').show()
                $('.touchbar').show()
            })
        },
        playerMax() {
            $('.player-min').on('click', () => {
                this.view.$el.show(150)
                    .siblings().hide()
                $('.touchbar').hide()

            })
        },
        nextSong() {
            let nextButton = this.view.$el.find('.next')
            nextButton.on('click', (e) => {
                console.log(playListIndex)
                e.preventDefault()

                //获取当前音乐来源
                let source = 0
                console.log(playList)
                console.log(typeof playList)
                for (let i = 0; i < playList.length; i++) {
                    if (currentSongId == playList[i].id) {
                        console.log(playList[i])
                        source = playList[i].source
                        break
                    }

                }
                console.log('source', source)



                //列表随机模式
                if (playMode === 'listRandom') {
                    let keys = Object.keys(playList)
                    let listLength = keys.length

                    let index = Math.floor(Math.random() * listLength) //生成一个0-plyList长度的随机数
                    console.log('playList')
                    console.log(playList)

                    if (source == 1) {
                        playList[index].url = getNeteaseSongUrl(playList[index].id)

                    }
                    let { url, cover, id, name, singer } = playList[index]

                    if (url) {
                        currentSongId = id //将当前播放的歌曲id存到model
                        this.changeSongInfo(url, cover, id, name, singer)
                        playListIndex.push(index)
                    } else {
                        alert('暂时没有版权哦')
                    }



                    //随机与单曲循环模式
                } else if (playMode === 'listOrder' | playMode === 'singleLoop') {
                    let keys = Object.keys(playList) //playList获取所有key，获取对象长度
                    let index //声明一个index，获取到当前播放的歌曲的id后，去playList里面找到当前歌曲的角标
                    for (let i = 0; i < keys.length; i++) {
                        if (playList[i].id == this.getQueryVariable('id')) {
                            index = i
                        }
                    }
                    index++
                    if (index === keys.length) { index = 0 }
                    console.log(playList)
                    console.log(index)
                    console.log(playList[index])
                        //检查url是否存在，不存在就掉接口获取
                    if (source == 1) {
                        playList[index].url = getNeteaseSongUrl(playList[index].id)
                    }

                    let { url, cover, id, name, singer } = playList[index]

                    if (url) {
                        currentSongId = id //将当前播放的歌曲id存到model
                        this.changeSongInfo(url, cover, id, name, singer)
                        playListIndex.push(index)
                    } else {
                        alert('暂时没有版权哦')
                    }
                }
                isPlay = true
                console.log('触发了下一曲', isPlay)
                window.isPlaying()
                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色
            })
        },
        previousSong() {
            let previousButton = this.view.$el.find('.previous')
            previousButton.on('click', (e) => {
                e.preventDefault()

                //获取当前音乐来源
                let source = 0
                console.log(playList)
                console.log(typeof playList)
                for (let i = 0; i < playList.length; i++) {
                    if (currentSongId == playList[i].id) {
                        console.log(playList[i])
                        source = playList[i].source
                        break
                    }

                }
                console.log('source', source)

                if (playMode) {
                    console.log('playListIndex' + playListIndex)
                    let lastSongIndex = playListIndex[playListIndex.length - 2] //获取到上一周歌曲在playList的角标

                    playListIndex.pop() //删除最后一首歌曲

                    if (playListIndex.length === 0) {
                        console.log('前面没有歌曲啦')
                        $('.next').trigger('click')
                    } else {

                        console.log('前面还有歌曲？')
                        console.log(playList)
                        if (source == 1) {
                            playList[lastSongIndex].url = getNeteaseSongUrl(playList[lastSongIndex].id)
                        }

                        let { url, cover, id, name, singer } = playList[lastSongIndex]
                        currentSongId = id //将当前播放的歌曲id存到model
                        this.changeSongInfo(url, cover, id, name, singer)
                    }
                }
                isPlay = true
                console.log('触发了上一曲', isPlay)
                window.isPlaying()
                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色
            })
        },
        changeSongInfo(url, cover, id, name, singer) { //将当前播放歌曲的数据渲染到dom


            this.view.$el.find('.player-name').text(name)
            this.view.$el.find('.player-singer').text(singer)
                //替换audio标签的src
            let audio = $('#audio')
            audio.attr('src', url)
                //替换2处封面
            let allCover = $('.player-cover>img')
            for (let i = 0; i < cover.length; i++) {
                $(allCover[i]).attr('src', cover)
            }
            //控制歌曲暂停与播放
            window.isPlaying()
                //给当前播放的歌曲列表添加背景色
            this.view.changePlayStatus(id)
            this.generateUrl(id) //生成当前歌曲的url地址

        },
        changePlayMode() { //更换播放模式


            let playModeArr = [{
                    playMode: 'listOrder',
                    image: './src/icon/listLoop.png',
                    loop: false
                }, {
                    playMode: 'singleLoop',
                    image: './src/icon/singleLoop.png',
                    loop: true
                },

                {
                    playMode: 'listRandom',
                    image: './src/icon/randomPlay.png',
                    loop: false
                }
            ]


            if (!localStorage.getItem('playMode')) {
                localStorage.setItem('playMode', 'listRandom')
            }
            playMode = localStorage.getItem('playMode')



            for (let i = 0; i < playModeArr.length; i++) { //
                if (playMode === playModeArr[i].playMode) {
                    $('#play-mode-btn>img').attr('src', playModeArr[i].image)
                    $('#audio').attr('loop', playModeArr[i].loop)
                    break
                }
            }
            $('#play-mode-btn').on('click', 'img', () => {
                let nextIndex = 0
                for (let i = 0; i < playModeArr.length; i++) {
                    if (playMode === playModeArr[i].playMode) {
                        nextIndex = i + 1
                    }
                }
                if (nextIndex < playModeArr.length) {
                    playMode = playModeArr[nextIndex].playMode
                    $('#play-mode-btn>img').attr('src', playModeArr[nextIndex].image)
                    $('#audio').attr('loop', playModeArr[nextIndex].loop)
                    console.log(nextIndex)
                    localStorage.setItem('playMode', playMode)
                } else if (nextIndex === playModeArr.length) {
                    nextIndex = 0
                    playMode = playModeArr[nextIndex].playMode
                    $('#play-mode-btn>img').attr('src', playModeArr[nextIndex].image)
                    $('#audio').attr('loop', playModeArr[nextIndex].loop)
                    console.log(nextIndex)
                    localStorage.setItem('playMode', playMode)
                }
            })
        },
        timedOff() {
            $('.timed-off-wrapper').hide()
            $('#timed-off-btn').on('click', (e) => { //点击时钟按钮出现界面
                e.preventDefault()
                let initHtml = $('.timed-off-wrapper').html()
                let html = `
                <div class="timed-off-bg"></div>
                        <div class="timed-off">
                            <div class="timed-off-title">定时关闭</div>
                            <ul>
                                <li data-time="10000" class="no-timed-off active">不开启</li>
                                <li data-time="10">10分钟后</li>
                                <li data-time="20">20分钟后</li>
                                <li data-time="30">30分钟后</li>
                                <li data-time="60">60分钟后</li>
                                <li data-time="90">90分钟后</li>
                            </ul>
                        </div>
                `

                !initHtml && $('.timed-off-wrapper').html(html)
                $('.timed-off-wrapper').show(150)


                $('.timed-off-bg').on('click', (e) => { //点击空白处设置界面消失
                    e.preventDefault()
                    $('.timed-off-wrapper').hide(150)
                })
                var timer = null
                $('.timed-off>ul').on('click', 'li', (e) => {
                    e.preventDefault()
                    clearTimeout(timer)
                    console.log(timer)
                    let current = e.currentTarget
                    $(current).addClass('active')
                        .siblings().removeClass('active')
                    console.log(current.dataset.time)

                    timer = window.setTimeout(() => {
                        isPlay = false
                        window, isPlaying()
                        $('.no-timed-off').addClass('active')
                            .siblings().removeClass('active')
                    }, current.dataset.time * 6000 * 10)
                    console.log(timer)
                })
            })


        },
        viewComments() {
            let template = `
            <li>
                <div class="comments-item">
                    <div class="avatar"><img src="{{avatar}}" alt=""></div>
                    <div>
                        <p class="username">{{nickName}}</p>
                        <p class="send-date">{{createTime}}</p>
                    </div>
                    <p class="comments-content">{{content}}</p>
                </div>
            </li>
            `
            $('.view-comments-wrapper').hide()
                //点击评论按钮出现评论界面
            $('#view-comments').on('click', function() { //点击评论按钮执行的函数

                console.log('currentSongId')
                console.log(currentSongId)

                let source = 0
                console.log(playList)
                console.log(typeof playList)
                for (let i = 0; i < playList.length; i++) {
                    if (currentSongId == playList[i].id) {
                        console.log(playList[i])
                        source = playList[i].source
                        break
                    }

                }
                console.log(source)
                $('.view-comments-wrapper').show(200).siblings().hide()
                $('.touchbar').hide()
                if (source == 0) {

                    $.post('http://106.13.208.121:9999/viewComment', currentSongId) //调用评论查询接口
                        .then((response) => {
                            let data = JSON.parse(response)
                            console.log(data)
                            $('.view-comments-wrapper .single-album-loader').hide()
                            if (data.length < 1) {
                                let nullTemplate = `
                                <div class="null_comment">
                                    <div class="null_img">
                                        <img src="./src/img/null.png" alt="没有评论">
                                    </div>
                                    <p class="null_text">暂时没有评论哦</p>
                                </div>
                                `
                                $('.comments-list').append(nullTemplate)

                            } else {
                                //获取到后端返回的数据，渲染页面
                                for (let i = 0; i < data.length; i++) {
                                    let li = template.replace('{{avatar}}', data[i].avatar)
                                        .replace('{{nickName}}', data[i].nickName)
                                        .replace('{{createTime}}', fmtDate(data[i].createTime))
                                        .replace('{{content}}', data[i].content)
                                    $('.comments-list').append(li)
                                }
                            }


                            function fmtDate(date) {
                                var dateee = new Date(date).toJSON();
                                return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                            }

                        }, (request) => {
                            alert(request.responseText)
                            console.log(request)
                        })
                } else {
                    console.log(currentSongId)
                        //获取网易云音乐的歌曲评论
                    $.get('http://106.13.208.121:3000/comment/music?id=' + currentSongId + '&limit=20')
                        .then((res) => {
                            console.log(res)
                            let data = res.hotComments.map((item) => {
                                return { avatar: item.user.avatarUrl, nickName: item.user.nickname, createTime: format(item.time), content: item.content }
                            })
                            console.log(data)

                            $('.view-comments-wrapper .single-album-loader').hide()
                            if (data.length < 1) {
                                let nullTemplate = `
                                <div class="null_comment">
                                    <div class="null_img">
                                        <img src="./src/img/null.png" alt="没有评论">
                                    </div>
                                    <p class="null_text">暂时没有评论哦</p>
                                </div>
                                `
                                $('.comments-list').append(nullTemplate)

                            } else {
                                //获取到后端返回的数据，渲染页面
                                for (let i = 0; i < data.length; i++) {
                                    let li = template.replace('{{avatar}}', data[i].avatar)
                                        .replace('{{nickName}}', data[i].nickName)
                                        .replace('{{createTime}}', data[i].createTime)
                                        .replace('{{content}}', data[i].content)
                                    $('.comments-list').append(li)
                                }
                            }
                            //时间戳转日期函数
                            function add0(m) { return m < 10 ? '0' + m : m }

                            function format(shijianchuo) {
                                //shijianchuo是整数，否则要parseInt转换
                                var time = new Date(shijianchuo);
                                var y = time.getFullYear();
                                var m = time.getMonth() + 1;
                                var d = time.getDate();
                                var h = time.getHours();
                                var mm = time.getMinutes();
                                var s = time.getSeconds();
                                return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
                            }


                        }, (req) => {
                            console.log(req)
                            alert('获取失败，请稍后再试')
                        })
                }



            })

            //点击返回按钮隐藏评论界面
            $('.view-comments-wrapper .return').on('click', function() {
                    $('.view-comments-wrapper .single-album-loader').show()
                    $('#player').show(150)
                        .siblings().hide(150)
                    $('.comments-list').html('')
                })
                //点击发送按钮

            $('#send_comments_btn').on('click', () => {
                let commentContent = $('#send_comments_input').val()
                    //获取当前音乐的来源
                let source = 0
                console.log(playList)
                console.log(typeof playList)
                for (let i = 0; i < playList.length; i++) {
                    if (currentSongId == playList[i].id) {
                        console.log(playList[i])
                        source = playList[i].source
                        break
                    }

                }
                console.log(source)

                console.log(commentContent)
                if (!commentContent) {
                    console.log('内容不存在')
                    alert('请输入内容')
                } else {
                    //data里面需要user的objid和song的objid
                    if (source == 0) {
                        //来源为leancloud的的方法
                        let uuser = localStorage.getItem('uuser')
                        let userObjectId = uuser.split('&')[0] //数据库里的用户objId
                        let userId = uuser.split('&')[1] //数据库里自定义的userId

                        let data = {
                            songId: currentSongId,
                            userObjectId: userObjectId,
                            content: commentContent,
                            userId: userId

                        }
                        console.log(data)
                        console.log(commentContent)
                        $.post('http://106.13.208.121:9999/postComment', JSON.stringify(data)) //调用请求验证码接口
                            .then((response) => {
                                let data = JSON.parse(response)
                                console.log(data)

                                if ($('.comments-list>.null_comment').length !== 0) {
                                    $('.comments-list').html('')
                                }
                                //获取到后端返回的数据，渲染页面
                                let li = template.replace('{{avatar}}', data.avatar)
                                    .replace('{{nickName}}', data.nickName)
                                    .replace('{{createTime}}', fmtDate(data.createTime))
                                    .replace('{{content}}', data.content)

                                $('.comments-list').append(li)
                                $('#send_comments_input').val('')


                                function fmtDate(date) { //解析时间戳显示年月日
                                    var dateee = new Date(date).toJSON();
                                    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                                }

                            }, (request) => {
                                alert(request.responseText)
                                console.log(request)
                            })

                    } else if (source == 1) {
                        //来源为网易
                        alert('该歌曲暂不支持评论')
                    }

                }
            })
        },
        generateUrl(data) { //将当前歌曲的歌曲url地址放到地址栏
            let host = window.location.host
            let url = 'http://' + host + '?id=' + data
            history.replaceState('null', 'null', url)
        },
        autoNext() {
            let audio = $('#audio')
            audio.on('ended', () => {
                $('.next').trigger('click')
            })
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
        autoPause() {
            let audio = $('#audio')
            audio.on('pause', () => {
                console.log('播放暂停了')
                window.isPlay = false
                window.isPlaying()
            })
            audio.on('play', () => {
                console.log('播放开始')
                window.isPlay = true
                window.isPlaying()
            })
        }

    }
    controller.init(view, model)
}