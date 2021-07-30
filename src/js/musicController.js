var isPlay = false
var currentSongId
let lyrcScrolTimer

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


        clearInterval(lyrcScrolTimer) //先清除定时器，以免造成重复调用
            //歌词自动滚动
        lyrcScrolTimer = setInterval(() => {
            let percent = $('audio')[0].currentTime / $('audio')[0].duration
            let height = percent * $('#lyrcs')[0].scrollHeight - 120
            $('#lyrcs')[0].scrollTop = height
                // console.log('正在调用歌词滚动定时器')
        }, 1000);
        console.log(lyrcScrolTimer)

    } else {
        audio[0].pause()
        let cover = $($('.player-cover'))
        cover.addClass('paused')
        $('.pause-button').addClass('hide')
            .siblings().removeClass('hide')

        //清除二次自动滚动的定时器
        clearInterval(lyrcScrolTimer)

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
        url: 'http://106.13.232.115:3000/song/url?id=' + id + '&cookie=' + localStorage.getItem('cookie') + '&br=320000',
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(res) {
            //在model里面的歌曲里面查找songId
            //在找到的songId里面加上url属性
            songurl = res.data[0].url
        },
        error: function(req) {
            console.log(JSON.stringify(req))
        }
    })
    console.log('更新了url')
    return songurl
}

function generateUrl(data) { //将当前歌曲的歌曲url地址放到地址栏
    let host = window.location.host
    let url = 'http://' + host + '?id=' + data
    history.replaceState('null', 'null', url)
}

function changePlayStatus(id) { //查询当前播放歌曲id，并改变dom样式
    let li = $('.song-iterm')
        //li.removeClass('playing')
    let li1 = []
    for (let i = 0; i < li.length; i++) {
        let songId = li[i].dataset.songId
        if (songId == id) {
            // console.log(li[i])
            li1.push(li[i])
                // console.log(songId)
        }

    }
    li.removeClass('playing')
    for (let i = 0; i < li1.length; i++) {
        $(li1[i]).addClass('playing')

    }
}

function getQueryVariable(variable) { //从地址栏获取歌曲id
    let query = window.location.search.substring(1)
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}

$('#audio')[0].pause()