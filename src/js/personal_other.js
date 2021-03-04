{
    let view = {
        el: '#personal_other',
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
            this.shareUrl()
            this.downloadApp()
            this.seekSong()
        },
        shareUrl() {
            $('#shareUrl').on('click', () => {
                $('#shareUrl').attr('data-clipboard-text', window.location.href)
                new ClipboardJS('#shareUrl')
                alert('地址已复制到剪切板')
            })
        },
        downloadApp() {
            $('#downloadApp').on('click', function(e) {
                if (!localStorage.getItem('appUrl') == 0) {
                    e.preventDefault()
                    alert('暂未开放')
                } else {
                    $('#downloadApp a').attr('href', localStorage.getItem('appUrl'))
                }
            })
        },
        seekSong() {
            $('#seekSong').on('click', function(e) {
                e.preventDefault()
                alert('暂未开放')
            })
        }
    }
    controller.init(view, model)
}