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
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            return this.template.replace('{{album-id}}', data.id)
                .replace('{{album-cover}}', data.cover)
                .replace('{{album-name}}', data.name)
                //.replace('{{album-singer}}', data.singer)
        }
    }
    let model = {
        recommendedAlbumList: [],
        getRecommendedAlbumList() { //获取发现页的推荐歌单数据
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'get',
                    url: 'http://169.1.0.68:3000/personalized',
                    success: function(response) {
                        //将获取到的数据处理后存储到本地
                        model.recommendedAlbumList = response.result.map((list) => {
                            return { id: list.id, cover: list.picUrl, name: list.name }
                        })
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
            this.model.getRecommendedAlbumList().then(() => {
                for (let i = 0; i < this.model.recommendedAlbumList.length; i++) {
                    this.view.$el.append(this.view.render(this.model.recommendedAlbumList[i]))
                }
            })
        }
    }
    controller.init(view, model)
}