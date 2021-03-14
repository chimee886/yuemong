{
    {
        let view = {
            el: '#player',
            template: `
                <li>
                    <p class="lyrc-item">{{content}}</p>
                </li>
            `,
            init() {
                this.$el = $(this.el)
            },
            render(data) {
                return this.template.replace('{{content}}', data)
            },
            test() {
                this.$el.find('.player-cover-max').on('click', () => {
                    this.$el.find('.player-cover-max').hide()
                    this.$el.find('#lyrcs').fadeIn()
                })
                this.$el.find('#lyrcs').on('click', () => {
                    this.$el.find('#lyrcs').hide()
                    this.$el.find('.player-cover-max').fadeIn()
                })
            }
        }
        let model = {
            getLyrcs() {
                $('audio').on('canplay', () => {
                    // 调用获取歌词接口
                    // console.log('调用获取歌词接口', currentSongId)
                    $.get('http://106.13.208.121:3000/lyric?id=' + currentSongId)
                        .then((req) => {
                            let lyrc = req.lrc.lyric
                                // console.log(lyrc)

                            let regx = new RegExp(/\s*\n*\[.*?\]\s*/)

                            let lyrcs = lyrc.split(regx)

                            let str = ''
                            for (let i = 0; i < lyrcs.length; i++) {
                                str += view.render(lyrcs[i])
                            }
                            $('#lyrcs ul').html('')
                            $('#lyrcs ul').append(str)


                            // console.log(lyrcs)
                        }, (req) => {
                            console.log(req)
                            $('#lyrcs ul').html('')
                            $('#lyrcs ul').append('<p class="null-lyrc">暂无歌词</p>')
                        })
                })
            }
        }
        let controller = {
            init(view, model) {
                this.view = view
                this.model = model
                this.view.init()
                this.view.test()
                this.model.getLyrcs()
            }

        }
        controller.init(view, model)
    }
}