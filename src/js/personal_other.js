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
            $('#downloadApp').on('click', function() {
                $('#downloadApp a').attr('href', localStorage.getItem('appUrl'))
            })
        }
    }
    controller.init(view, model)
}