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
        getNewSongList() {
            return new Promise(function(resolve, reject) { //获取发现页最新歌曲列表
                $.ajax({
                    type: 'get',
                    url: 'http://192.168.31.135:3000/personalized/newsong?limit=20',
                    success: function(response) {
                        //将获取到的数据处理后存储到本地
                        console.log(response)
                        model.newSongList = response.result.map((list) => {
                            return { id: list.id, cover: list.picUrl + '?param=500y500', name: list.name, singer: list.song.artists[0].name, album: list.song.album.name }
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
                for (let i = 0; i < this.model.newSongList.length; i++) {
                    this.view.$el.append(this.view.render(this.model.newSongList[i]))
                }
            })
        }
    }
    controller.init(view, model)
}