var favoriteSongs = [] //喜欢歌曲的列表
let publicData = {}
    //获取数据库的cookie，APP下载地址

async function getPublicData() {
    await $.ajax({
        type: 'get',
        url: 'http://106.13.232.115:9999/yuemongPublic',
        success: function(res) {
            publicData = JSON.parse(res)
                // console.log('publicData')
                // console.log(publicData)
            localStorage.setItem('cookie', publicData.cookie)
            localStorage.setItem('appUrl', publicData.appUrl)
        }
    })

}

getPublicData()










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