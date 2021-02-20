var favoriteSongs = [] //喜欢歌曲的列表
var neteaseCookie = 'MUSIC_U=7e4df20da163cdcf5c7b8435f560458e5e9b5233b736633d562e7fae5003f3ea219bf91c24f8a0266c0b02903764249b; Max-Age=1296000; Expires=Wed, 10 Feb 2021 02:50:12 GMT; Path=/;;__csrf=6985668ceb9a05aa31dcc7e6af1efb35; Max-Age=1296010; Expires=Wed, 10 Feb 2021 02:50:22 GMT; Path=/;;__remember_me=true; Max-Age=1296000; Expires=Wed, 10 Feb 2021 02:50:12 GMT; Path=/;'

function getFavoriteSongs() { //获取本地的收藏歌曲列表
    favoriteSongs = localStorage.getItem('favoriteSongs').split('&')
}

function identifyFavoriteSong() { //识别歌曲是否为喜欢歌曲
    for (let i = 0; i < favoriteSongs.length; i++) {
        if (currentSongId === favoriteSongs[i]) {
            console.log(i)
            $('#add-favorite>img').attr('src', './src/icon/isFavorites.png')
            break
        } else {
            $('#add-favorite>img').attr('src', './src/icon/addToFavorites.png')
        }
    }
}