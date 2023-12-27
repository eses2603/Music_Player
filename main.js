const prevButton = document.getElementById("prev")

const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton = document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')


//index for song
let index

//loop
let loop = true

//mixer open?
let isShuffleActive = false

//Song list
const songsList = [
    {
        name: "Perdono",
        link: "assets/Tiziano Ferro - Perdono.mp3",
        artist: "Tiziano Ferro",
        image: "assets/tiziano.jpg"
        
    },
    {
        name: "Bring Me To Life",
        link: "assets/Evanesance - Evanescense - Bring Me To Life.mp3",
        artist: "Evanescense",
        image: "assets/Evanesance.jpg"
    },
    {
        name: "Remember the Name",
        link: "assets/Mike Shinoda- remember the name.mp3",
        artist: "Mike Shinoda",
        image: "assets/mike.jpg"
    },
    {
        name: "Die Another Day",
        link: "assets/Madonna - Die Another Day.mp3",
        artist: "Madonna",
        image: "assets/Madonna.jpg"
    },
    {
        name: "Dont Stop The Music",
        link: "assets/Rihanna - Dont Stop The Music.mp3",
        artist: "Rihanna",
        image: "assets/Rihanna.jpg"
    }
]

//time format
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" + second : second
    return `${minute}:${second}`
}



//play song
const playAudio = () => {
    console.log("playAudio")
    audio.play()
    pauseButton.classList.remove("hide")
    playButton.classList.add("hide")
}

//assign song
const setSong = (arrayIndex) => {
    if (loop == true && isShuffleActive == true) {
        arrayIndex = Math.floor(Math.random()*100)%5
    }
    console.log(arrayIndex  + isShuffleActive)

    let { name, link, artist, image } = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () => {

        maxDuration.innerText = timeFormatter(audio.duration)
    }
    playListContainer.classList.add("hide")
    playAudio()
}


//play next
const nextSong = () => {
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0
        } else {
            index += 1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
}

playListButton.addEventListener('click', () => {
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click', () => {
    playListContainer.classList.add('hide')
})

const pauseAudio = () => {
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
    //
}, 1000);

progressBar.addEventListener("click", (event) => {
    let coordStart = progressBar.getBoundingClientRect().left

    let coordEnd = event.clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    currentProgress.style.width = progressBar * 100 + "%"

    audio.currentTime = progress * audio.duration
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

const previousSong = () => {
    console.log(index)
    if (index > 0) {
        index -= 1
    } else {
        index = songsList.length - 1 //4
    }
    setSong(index)

}

repeatButton.addEventListener('click', () => {
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log('tekrar kapatildi')
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
        console.log('tekrar acildi')
    }
})

shuffleButton.addEventListener('click', () => {
    if (shuffleButton.classList.contains('active')) {
        isShuffleActive = false
        shuffleButton.classList.remove('active')
        audio.loop = true
        console.log('karistirici kapatildi')
    } else {
        isShuffleActive = true
        shuffleButton.classList.add('active')
        audio.loop = false
        console.log('karistirici acildi')
    }
})

const initializePlaylist = () => {
    for (let i in songsList) {
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container"> 
          <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">
            ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
            ${songsList[i].artist}
          </span>
        </div>
        </li>`
    }
}

//keep to click
nextButton.addEventListener('click', nextSong)
pauseButton.addEventListener('click', pauseAudio)
playButton.addEventListener('click', playAudio)
prevButton.addEventListener('click', previousSong)



//keep to end of song
audio.onended = () => {
    nextSong()
}

audio.addEventListener('timeupdate', () => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//while loading the screen
window.onload = () => {
    index = 0
    setSong(index)
    //stop and create song list

    pauseAudio()
    initializePlaylist()
}