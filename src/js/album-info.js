{
    let view = {
        el: '#home-page .album-container',
        template: ``,
        init() {
            this.$el = $(this.el)
        },
        return () {
            let returnBtn = this.$el.find('.return')
            returnBtn.on('click', () => {
                this.showElement('.home')
                this.$el.hide(150)
                this.showElement('.single-album .single-album-loader')
                    //.siblings().hide(200)
                $('.touchbar').show()
            })
        },
        showElement(element) {
            $(element).show(150)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.return()
        }
    }
    controller.init(view, model)
}