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
        },
        shareUrl() {
            $('#shareUrl').on('click', () => {
                $('#shareUrl').attr('data-clipboard-text', window.location.href)
                new ClipboardJS('#shareUrl')
                alert('复制成功')
            })
        },
        downloadApp() {
            $('#downloadApp,#seekSong').on('click', () => {
                alert('请期待')
            })
        }
    }
    controller.init(view, model)
}