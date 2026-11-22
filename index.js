let currentSong = new Audio();
async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
const playMusic = (track,pause=false) => {
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play();
        play.src = "assets/svg/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function main() {
    // get the list of all song
    let songs = await getsongs();
    playMusic(songs[0],true);
    console.log(songs)
    let songUL = document.querySelector(".SongList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="assets/svg/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Jatin</div>
                            </div>
                            <div class="playnow">
                                <span>PlayNow</span>
                                <img class="invert" src="assets/svg/play.svg" alt="">
                            </div>
                            </li>`
    }

    Array.from(document.querySelector(".SongList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/svg/pause.svg";
        } else {
            currentSong.pause();
            play.src = "assets/svg/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {

    let current = currentSong.currentTime;
    let duration = currentSong.duration;

    if (!isNaN(duration)) {

        // Current time
        let currentMin = Math.floor(current / 60);
        let currentSec = Math.floor(current % 60);

        // Total duration
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);

        // Format time (00:00)
        let currentTime = `${String(currentMin).padStart(2, "0")}:${String(currentSec).padStart(2, "0")}`;

        let totalTime = `${String(totalMin).padStart(2, "0")}:${String(totalSec).padStart(2, "0")}`;

        document.querySelector(".songtime").innerHTML = `${currentTime} / ${totalTime}`;
    }
});

    let seekbar = document.querySelector(".seekbar");
    let circle = document.querySelector(".circle");

    // Update seekbar according to song time
    currentSong.addEventListener("timeupdate", () => {
        let percentage = (currentSong.currentTime / currentSong.duration) * 100;
        circle.style.left = percentage + "%";
    });

    // Click on seekbar to change song time
    seekbar.addEventListener("click", (e) => {
        let percent = (e.offsetX / seekbar.clientWidth) * 100;

        circle.style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })
}
main()
