let selectedScene = "Main Service";
let isLive = false;
let isRecording = false;
let streamSeconds = 0;
let timerInterval = null;


/* =========================
   HOME
========================= */

function goHome() {

    window.location.href = "index.html";

}


/* =========================
   NOTIFICATIONS
========================= */

function notify(message) {

    const box =
        document.getElementById("notification");

    box.textContent = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 2500);

}


/* =========================
   SCENES
========================= */

function selectScene(button) {

    document
        .querySelectorAll(".scene")
        .forEach(scene => {

            scene.classList.remove("active");

        });


    button.classList.add("active");


    selectedScene =
        button.dataset.scene;


    document.getElementById(
        "previewScene"
    ).textContent =
        selectedScene;


    document.getElementById(
        "previewTitle"
    ).textContent =
        selectedScene;


    notify(
        "Preview: " + selectedScene
    );

}


function addScene() {

    const name =
        prompt(
            "Enter a name for the new scene:"
        );


    if (!name) {
        return;
    }


    const list =
        document.getElementById(
            "sceneList"
        );


    const button =
        document.createElement("button");


    button.className =
        "scene";


    button.dataset.scene =
        name;


    button.innerHTML =
        `<span>▣</span>${escapeHTML(name)}`;


    button.onclick =
        function () {

            selectScene(this);

        };


    list.appendChild(button);


    notify(
        "Scene created: " + name
    );

}


/* =========================
   SOURCES
========================= */

function toggleSource(button) {

    const source =
        button.parentElement;


    source.classList.toggle(
        "disabled"
    );


    if (
        source.classList.contains(
            "disabled"
        )
    ) {

        button.textContent = "○";

    } else {

        button.textContent = "◉";

    }

}


function addSource() {

    const source =
        prompt(
            "Enter source name:"
        );


    if (!source) {
        return;
    }


    const list =
        document.getElementById(
            "sourceList"
        );


    const item =
        document.createElement("div");


    item.className =
        "source";


    item.innerHTML = `

        <span>▣</span>

        ${escapeHTML(source)}

        <button
            onclick="toggleSource(this)"
        >
            ◉
        </button>

    `;


    list.appendChild(item);


    notify(
        "Source added: " + source
    );

}


/* =========================
   TRANSITIONS
========================= */

function transitionScene() {

    changeProgram();

    notify("Transition complete.");

}


function cutScene() {

    changeProgram();

    notify("Cut complete.");

}


function fadeScene() {

    const window =
        document.getElementById(
            "programWindow"
        );


    window.style.opacity = "0.2";


    setTimeout(() => {

        changeProgram();

        window.style.opacity = "1";

    }, 350);


    notify("Fade complete.");

}


function changeProgram() {

    document.getElementById(
        "programScene"
    ).textContent =
        selectedScene;


    document.getElementById(
        "programTitle"
    ).textContent =
        selectedScene;

}


/* =========================
   STREAMING
========================= */

function startStream() {

    if (isLive) {
        return;
    }


    isLive = true;

    streamSeconds = 0;


    const status =
        document.getElementById(
            "streamStatus"
        );


    const timer =
        document.getElementById(
            "streamTimer"
        );


    const dot =
        document.querySelector(
            ".big-status-dot"
        );


    const topDot =
        document.querySelector(
            ".status-dot"
        );


    const startButton =
        document.getElementById(
            "goLiveButton"
        );


    const stopButton =
        document.getElementById(
            "stopButton"
        );


    status.textContent =
        "LIVE";


    timer.textContent =
        "00:00:00";


    dot.classList.add("live");

    topDot.classList.add("live");


    startButton.disabled =
        true;


    stopButton.disabled =
        false;


    timerInterval =
        setInterval(
            updateStreamTimer,
            1000
        );


    notify(
        "Desk Stream is now live."
    );

}


function stopStream() {

    if (!isLive) {
        return;
    }


    isLive = false;


    clearInterval(
        timerInterval
    );


    const status =
        document.getElementById(
            "streamStatus"
        );


    const timer =
        document.getElementById(
            "streamTimer"
        );


    const dot =
        document.querySelector(
            ".big-status-dot"
        );


    const topDot =
        document.querySelector(
            ".status-dot"
        );


    status.textContent =
        "OFFLINE";


    timer.textContent =
        "Ready to stream";


    dot.classList.remove(
        "live"
    );


    topDot.classList.remove(
        "live"
    );


    document.getElementById(
        "goLiveButton"
    ).disabled = false;


    document.getElementById(
        "stopButton"
    ).disabled = true;


    notify(
        "Stream stopped."
    );

}


function updateStreamTimer() {

    streamSeconds++;


    const hours =
        Math.floor(
            streamSeconds / 3600
        );


    const minutes =
        Math.floor(
            (streamSeconds % 3600) / 60
        );


    const seconds =
        streamSeconds % 60;


    const formatted =

        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    document.getElementById(
        "streamTimer"
    ).textContent =
        formatted;

}


/* =========================
   RECORDING
========================= */

function toggleRecording() {

    isRecording =
        !isRecording;


    const button =
        document.getElementById(
            "recordButton"
        );


    if (isRecording) {

        button.textContent =
            "■ STOP RECORDING";


        notify(
            "Recording started."
        );

    } else {

        button.textContent =
            "● START RECORDING";


        notify(
            "Recording stopped."
        );

    }

}


/* =========================
   AUDIO
========================= */

function changeVolume(
    slider,
    channel
) {

    const value =
        slider.value;


    const element =
        document.getElementById(
            channel + "Volume"
        );


    if (element) {

        element.textContent =
            value;

    }

}


function muteChannel(button) {

    const muted =
        button.textContent === "🔇";


    button.textContent =
        muted ? "🔊" : "🔇";


    notify(
        muted
            ? "Audio unmuted."
            : "Audio muted."
    );

}


/* =========================
   TOOLS
========================= */

function openBible() {

    notify(
        "Bible Projection source selected."
    );

}


function openLyrics() {

    notify(
        "Lyrics source selected."
    );

}


function openCamera() {

    notify(
        "Camera source selected."
    );

}


function screenCapture() {

    notify(
        "Screen capture source selected."
    );

}


function addTextSource() {

    const text =
        prompt(
            "Enter text:"
        );


    if (!text) {
        return;
    }


    notify(
        "Text source created."
    );

}


function openSettings() {

    notify(
        "Control Room settings opened."
    );

}


/* =========================
   FULLSCREEN
========================= */

function fullscreenPreview() {

    const preview =
        document.getElementById(
            "previewWindow"
        );


    if (
        document.fullscreenElement
    ) {

        document.exitFullscreen();

    } else {

        preview.requestFullscreen();

    }

}


/* =========================
   CHANNEL
========================= */

document
    .getElementById(
        "channelSelect"
    )
    .addEventListener(
        "change",
        function () {

            notify(
                "Channel switched to " +
                this.options[
                    this.selectedIndex
                ].text
            );

        }
    );


/* =========================
   FAKE HEALTH MONITOR
========================= */

setInterval(() => {

    const fps =
        document.getElementById(
            "fpsValue"
        );


    const cpu =
        document.getElementById(
            "cpuValue"
        );


    const gpu =
        document.getElementById(
            "gpuValue"
        );


    if (!fps) {
        return;
    }


    fps.textContent =
        isLive
            ? "60"
            : "—";


    cpu.textContent =
        Math.floor(
            15 + Math.random() * 8
        ) + "%";


    gpu.textContent =
        Math.floor(
            20 + Math.random() * 8
        ) + "%";

}, 2000);


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
