var isPlay = false
var currentSongId


window.isPlaying = function() {
    console.log(isPlay)
    let audio = $('#audio')
    if (isPlay) {
        audio[0].play()
        let cover = $($('.player-cover'))
        cover.removeClass('paused')
        $('.play-button').addClass('hide')
            .siblings().removeClass('hide')

    } else {
        audio[0].pause()
        let cover = $($('.player-cover'))
        cover.addClass('paused')
        $('.pause-button').addClass('hide')
            .siblings().removeClass('hide')
    }
}
var playList = {}
var playMode //播放模式[singleLoop/listOrder/listRandom]
var playListIndex = []