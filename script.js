let humbar = document.querySelector(".arrow1");
let left = document.querySelector(".left");
let cross1 = document.querySelector(".cross1");

humbar.addEventListener("click", () => {
    left.classList.add("show-sidebar");
});
cross1.addEventListener("click", () => {
    left.classList.remove("show-sidebar");
});



async function getsongs(folder) {
    let a = await fetch(`http://127.0.0.1:5500/music/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (const songss of as) {
        if (songss.href.endsWith(".mp3")) {
            let mp3 = songss.href;
            songs.push(mp3);
        }
    }
    return songs;
}


function volume() {
    let down = document.querySelector(".down");
    let up = document.querySelector(".up");
    up.addEventListener("click", () => {
        cruntsrc.volume = Math.min(cruntsrc.volume + 0.1, 1);
        volumbar.value = (cruntsrc.volume) * 100
    })
    down.addEventListener("click", () => {
        cruntsrc.volume = Math.max(cruntsrc.volume - 0.1, 0);
        volumbar.value = (cruntsrc.volume) * 100
    });

    volumbar.addEventListener("input", (e) => {
        cruntsrc.volume = (e.target.value) / 100;
    })
}



let circle = document.querySelector(".circle");

function timeupdate() {
    let time = document.querySelector(".time");
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // total duration
    cruntsrc.addEventListener("loadedmetadata", () => {
        time.innerText = `00:00 / ${formatTime(cruntsrc.duration)}`;
    });

    // current time update

    cruntsrc.addEventListener("timeupdate", () => {
        time.innerText = `${formatTime(cruntsrc.currentTime)} / ${formatTime(cruntsrc.duration)}`;

        if (!isNaN(cruntsrc.duration)) {
            circle.style.left =
                (cruntsrc.currentTime / cruntsrc.duration) * 100 + "%";
        }
    });
    document.querySelector(".shikbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        cruntsrc.currentTime = ((cruntsrc.duration) * percent) / 100;
    })
}
function playpause() {
    play2.addEventListener("click", () => {
        if (cruntsrc.paused) {
            cruntsrc.play();
            play2.src = "svg/pause.svg";
        } else {
            cruntsrc.pause();
            play2.src = "svg/playsong.svg";
        }
    })
}



let play2 = document.querySelector(".play2");

let cruntsrc = new Audio();
cruntsrc.volume = 0.2;
let volumbar = document.querySelector("#volumbar");
volumbar.value = (cruntsrc.volume) * 100
let allmusic;
const musiclist = document.querySelector(".musiclist");


async function letsong(folder) {
    allmusic = await getsongs(folder);
    if (allmusic.length === 0) {
        return;
    }
    let firstFile = decodeURIComponent(allmusic[0].split(`${folder}/`)[1]);
    playmusic(allmusic[0], true)
    songinfo(firstFile);
    play2.src = "svg/playsong.svg"

    let listHTML = "";

    for (const musics of allmusic) {
        let filename = musics.split(`${folder}/`)[1];
        let display = decodeURIComponent(filename);
        listHTML += ` <li>
                            <img class="img" src="playlist-img/_.jpeg" alt="">
                            <div class="details">
                                <h2 class="name">Arjit singh</h2>
                                <div class="songname">${display}</div>
                                <span class="hidden-url" style="display:none">${musics}</span>
                            </div>
                        </li>`
    }

    musiclist.innerHTML = listHTML;


    Array.from(musiclist.getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", (el) => {
            let name = e.querySelector(".hidden-url").innerText;
            let name1 = e.querySelector(".songname").innerText;
            playmusic(name);
            songinfo(name1);
        })
    })
}


async function getfolder() {
    let a = await fetch(`http://127.0.0.1:5500/music/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let parent = div.children[6].children[1];
    let folders = [];
    let lis = parent.querySelectorAll("a");
    Array.from(lis).forEach(async (e) => {
        if (e.href.split("/").slice(3, 4) == "music" && !e.href.endsWith(".mp3")) {
            let folder = e.href.split("/music/")[1].replace("/", "");
            if (folder) {
                folders.push(folder);
                let infos = await getinfo(folder)
                createcard(folder, infos)
            }
        }

    })

}


async function getinfo(folder) {

    let a = await fetch(`http://127.0.0.1:5500/music/${folder}/info.json`)

    let data = await a.json()

    return data;
}


let cards = document.querySelector(".cards");
let card = document.querySelector(".card")

async function createcard(folder, info) {
    let card = document.createElement("div");
    card.classList.add("card", "flex");
    card.dataset.folder = folder;
    card.innerHTML = `<img src="playlist-img/_.jpeg" alt="">
                        <h2>${info.name}</h2>
                        <p>${info.discription}</p>
                        <div class="play flex">
                            <img src="svg/play.svg" alt="">
                        </div>`;
    cards.appendChild(card);
    card.addEventListener("click", () => {
        circle.style.left = 0;
        letsong(folder);
    })
}

getfolder()


let previous1 = document.querySelector(".previous1");
let next = document.querySelector(".next");

previous1.addEventListener("click", () => {
    let index = allmusic.indexOf(cruntsrc.src)
    if (index > 0) {
        playmusic(allmusic[index - 1]);
        let name = decodeURIComponent(allmusic[index - 1].split("/music/")[1]);
        songinfo(name);
    }
})

next.addEventListener("click", () => {
    let index = allmusic.indexOf(cruntsrc.src)
    if ((index - 1) < allmusic.length - 1) {
        playmusic(allmusic[index + 1])
        let name = decodeURIComponent(allmusic[index + 1].split("/music/")[1]);
        songinfo(name);
    }
})

function songinfo(name1) {
    let musicname = document.querySelector(".musicname");
    musicname.innerText = name1;
}
function initPlayer() {
    playpause();
    timeupdate();
    volume();
}
function playmusic(plays, pause = false) {
    cruntsrc.pause();
    cruntsrc.currentTime = 0;
    cruntsrc.src = plays;
    cruntsrc.load();
    if (!pause) {
        cruntsrc.play().catch(err =>
            console.log("Playback error:", err));
        play2.src = "svg/pause.svg";
    } else {
        play2.src = "svg/playsong.svg";
    }
}
letsong("cs")
initPlayer()