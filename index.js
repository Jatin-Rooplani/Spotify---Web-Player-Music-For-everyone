let currentSong = new Audio();
let songs
let currFolder
async function getsongs(folder) {

    currFolder = folder;

    let a = await fetch(`/${folder}/songs.json`);
    songs = await a.json();

    let songUL = document.querySelector(".SongList")
        .getElementsByTagName("ul")[0];

    songUL.innerHTML = "";

    for (const song of songs) {

        songUL.innerHTML += `<li>
            <img class="invert" src="assets/svg/music.svg" alt="">

            <div class="info">
                <div>${song}</div>
                <div>Jatin</div>
            </div>

            <div class="playnow">
                <span>PlayNow</span>
                <img class="invert" src="assets/svg/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(songUL.getElementsByTagName("li"))
        .forEach((e, index) => {

            e.addEventListener("click", () => {
                playMusic(songs[index]);
            });

        });

    return songs;
}
const playMusic = (track, pause = false) => {

    if (!track) return;

    currentSong.src = `/${currFolder}/${encodeURIComponent(track)}`;

    if (!pause) {
        currentSong.play();
        play.src = "assets/svg/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;

    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}
async function displayAlbum() {

    let a = await fetch("/songs/albums.json");
    let folders = await a.json();

    let cardContainer = document.querySelector(".CardContainer");

    cardContainer.innerHTML = "";

    for (const folder of folders) {

        let a = await fetch(`/songs/${folder}/info.json`);
        let response = await a.json();

        cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">

                <img src="/songs/${folder}/cover.jpg" alt="">

                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" width="35" height="35">

                        <circle cx="12" cy="12" r="10"
                            fill="rgb(7, 237, 7)"
                            stroke="black" stroke-width="1" />

                        <path d="M10 8L16 12L10 16V8Z"
                            fill="black" />

                    </svg>
                </div>

                <h6>${response.title}</h6>
                <p>${response.description}</p>

            </div>`;
    }

    Array.from(document.querySelectorAll(".card"))
        .forEach(e => {

            e.addEventListener("click", async items => {

                songs = await getsongs(
                    `songs/${items.currentTarget.dataset.folder}`
                );

                if (songs.length > 0) {
                    playMusic(songs[0]);
                }

            });

        });
}
async function main() {
    // get the list of all song
    await getsongs("songs/cs");
    playMusic(songs[0], true);
    displayAlbum()
    console.log(songs)
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
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    let currentSongIndex = 0;

    // Next Song
    document.getElementById("next").addEventListener("click", () => {

        currentSongIndex++;

        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }

        playMusic(songs[currentSongIndex]);

    });

    // Previous Song
    document.getElementById("previous").addEventListener("click", () => {

        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }

        playMusic(songs[currentSongIndex]);

    });


    let volume = document.getElementById("volume");
    let range = document.querySelector(".range");

    // Volume slider
    range.addEventListener("input", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;

        if (currentSong.volume == 0) {
            volume.src = "assets/svg/mute.svg";
        } else {
            volume.src = "assets/svg/volume.svg";
        }
    });

    // Mute / Unmute
    volume.addEventListener("click", () => {

        if (currentSong.volume > 0) {
            currentSong.volume = 0;
            range.value = 0;
            volume.src = "assets/svg/mute.svg";
        }
        else {
            currentSong.volume = 1;
            range.value = 100;
            volume.src = "assets/svg/volume.svg";
        }
    });
}
main()