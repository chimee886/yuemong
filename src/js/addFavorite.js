{
    let view = {
        el: '',
        template: ``,
        init() {
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.addFavoriteSong()
        },
        addFavoriteSong() {
            $('#add-favorite').on('click', () => {
                let source = 0
                for (let i = 0; i < playList.length; i++) {
                    if (currentSongId == playList[i].id) {
                        console.log(playList[i])
                        source = playList[i].source
                        break
                    }

                }

                //获取本地的user，当前歌曲数据
                let uuser = localStorage.getItem('uuser')
                let userObjectId = uuser.split('&')[0] //数据库里的用户objId
                let userId = uuser.split('&')[1] //数据库里自定义的userId
                let data = {
                    songId: currentSongId,
                    userObjectId: userObjectId,
                    userId: userId
                }
                console.log('本地的data')
                console.log(data)

                if (source === 0) {
                    $.post('http://106.13.208.121:9999/addToFavorite', JSON.stringify(data)) //调用请求验证码接口
                        .then((response) => {
                            console.log(response)
                            if (response === 'saveSuccess') {
                                favoriteSongs.push(currentSongId)
                                identifyFavoriteSong() //检测当前歌曲是否是喜欢的歌曲，改变图标颜色
                            }
                            console.log(favoriteSongs)
                            if (favoriteSongs.indexOf("") !== -1) {
                                $('#personal_library .song-singer').text('共有' + (favoriteSongs.length - 1) + '首歌曲')
                            } else {
                                $('#personal_library .song-singer').text('共有' + favoriteSongs.length + '首歌曲')
                            }
                        }, (request) => {
                            alert(request.responseText)
                            console.log(request)
                        })
                } else {
                    alert('该歌曲不支持收藏')
                }


            })

        }
    }
    controller.init(view, model)
}