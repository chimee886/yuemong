var isPlay = false
var currentSongId

//检测歌曲是否播放，控制图标与cover状态
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
var playListIndex = [] //播放历史记录角标


//根据当前点击的歌曲，获取歌曲的url
function getNeteaseSongUrl(id) {
    let songurl = null
    $.ajax({
        type: 'get',
        url: 'http://192.168.31.135:3000/song/url?id=' + id,
        async: false,
        success: function(res) {
            //在model里面的歌曲里面查找songId
            //在找到的songId里面加上url属性
            songurl = res.data[0].url
        },
        error: function(req) {
            console.log(JSON.stringify(req))
        }
    })
    return songurl
}