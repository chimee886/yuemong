var favoriteSongs = [] //喜欢歌曲的列表


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