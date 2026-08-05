let cameraEnabled = true;
let microphoneEnabled = true;

let isStreaming = false;
let isRecording = false;
let virtualCameraEnabled = false;

let streamSeconds = 0;
let streamTimer = null;

let scenes =
    JSON.parse(
        localStorage.getItem(
            "deskStreamScenes"
        ) || "[]"
    );

let channels =
    JSON.parse(
        localStorage.getItem(
            "deskStreamChannels"
        ) || "[]"
    );


/* =========================
   HOME
========================= */

function goHome() {

    window.location.href =
        "index.html";

}


/* =========================
   NOTIFICATIONS
========================= */

function notify(message) {

    const notification =
        document.getElementById(
            "notification"
        );

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 2500);

}


/* =========================
   DESCRIPTION
========================= */

function openDescriptionModal() {

    document
        .getElementById(
            "descriptionModal"
        )
        .classList.add("show");

}


function closeDescriptionModal() {

    document
        .getElementById(
            "descriptionModal"
        )
        .classList.remove("show");

}


function saveDescription() {

    localStorage.setItem(
        "deskStreamDescription",

        document.getElementById(
            "streamDescription"
        ).value
    );


    closeDescriptionModal();

    notify(
        "Stream description saved."
    );

}


/* =========================
   THUMBNAIL
========================= */

function previewThumbnail(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function () {

            document.getElementById(
                "thumbnailPreview"
            ).innerHTML =
                `<img src="${reader.result}" alt="Stream thumbnail">`;

        };


    reader.readAsDataURL(file);

}


function removeThumbnail() {

    document.getElementById(
        "thumbnailPreview"
    ).innerHTML =
        "No Thumbnail";


    document.getElementById(
        "thumbnailInput"
    ).value = "";

}


/* =========================
   CAMERA
========================= */

function toggleCamera() {

    cameraEnabled =
        !cameraEnabled;


    const button =
        document.getElementById(
            "cameraToggle"
        );


    button.textContent =
        cameraEnabled
            ? "ON"
            : "OFF";


    button.classList.toggle(
        "on",
        cameraEnabled
    );


    notify(
        cameraEnabled
            ? "Camera turned on."
            : "Camera turned off."
    );

}


/* =========================
   MICROPHONE
========================= */

function toggleMicrophone() {

    microphoneEnabled =
        !microphoneEnabled;


    const button =
        document.getElementById(
            "micToggle"
        );


    button.textContent =
        microphoneEnabled
            ? "ON"
            : "OFF";


    button.classList.toggle(
        "on",
        microphoneEnabled
    );


    notify(
        microphoneEnabled
            ? "Microphone turned on."
            : "Microphone turned off."
    );

}


/* =========================
   MULTI-VIEW
========================= */

function openMultiView() {

    const selection =
        document.getElementById(
            "multiviewSelect"
        ).value;


    notify(
        "Multi-View: " + selection
    );

}


/* =========================
   SCENES
========================= */

function addScene() {

    document
        .getElementById(
            "sceneNameInput"
        )
        .value = "";


    document
        .getElementById(
            "sceneModal"
        )
        .classList.add("show");


    setTimeout(() => {

        document
            .getElementById(
                "sceneNameInput"
            )
            .focus();

    }, 100);

}


function closeSceneModal() {

    document
        .getElementById(
            "sceneModal"
        )
        .classList.remove("show");

}


function saveScene() {

    const input =
        document.getElementById(
            "sceneNameInput"
        );


    const name =
        input.value.trim();


    if (!name) {

        notify(
            "Please enter a scene name."
        );

        return;
    }


    const scene = {

        id:
            crypto.randomUUID(),

        name:
            name,

        created:
            new Date().toISOString()

    };


    scenes.push(scene);


    saveScenes();

    renderScenes();

    closeSceneModal();


    notify(
        `Scene "${name}" created.`
    );

}


function renderScenes() {

    const list =
        document.getElementById(
            "sceneList"
        );


    list.innerHTML = "";


    if (scenes.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                No scenes yet.

                <br>

                Click
                <strong>+ Add Scene</strong>
                to create your first scene.

            </div>

        `;

        return;
    }


    scenes.forEach(
        (scene, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "scene-item";


            if (index === 0) {

                item.classList.add(
                    "active"
                );

            }


            item.innerHTML = `

                <div
                    class="scene-thumbnail"
                >
                    SCENE
                </div>

                <div
                    class="scene-name"
                >
                    ${escapeHTML(scene.name)}
                </div>

                <div
                    class="scene-actions"
                >

                    <button
                        onclick="deleteScene('${scene.id}')"
                        title="Delete scene"
                    >
                        🗑
                    </button>

                </div>

            `;


            item.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {
                        return;
                    }


                    document
                        .querySelectorAll(
                            ".scene-item"
                        )
                        .forEach(
                            element =>
                                element.classList.remove(
                                    "active"
                                )
                        );


                    item.classList.add(
                        "active"
                    );


                    notify(
                        "Scene selected: " +
                        scene.name
                    );

                }
            );


            list.appendChild(
                item
            );

        }
    );

}


function deleteScene(id) {

    const scene =
        scenes.find(
            item =>
                item.id === id
        );


    if (!scene) {
        return;
    }


    if (
        !confirm(
            `Delete "${scene.name}"?`
        )
    ) {

        return;

    }


    scenes =
        scenes.filter(
            item =>
                item.id !== id
        );


    saveScenes();

    renderScenes();


    notify(
        "Scene deleted."
    );

}


function saveScenes() {

    localStorage.setItem(
        "deskStreamScenes",

        JSON.stringify(
            scenes
        )
    );

}


/* =========================
   CHANNELS
========================= */

function addChannel() {

    if (
        channels.length >= 50
    ) {

        notify(
            "You have reached the 50-channel limit."
        );

        return;
    }


    document.getElementById(
        "channelNameInput"
    ).value = "";


    document.getElementById(
        "channelStreamKey"
    ).value = "";


    document
        .getElementById(
            "channelModal"
        )
        .classList.add("show");

}


function closeChannelModal() {

    document
        .getElementById(
            "channelModal"
        )
        .classList.remove(
            "show"
        );

}


function saveChannel() {

    if (
        channels.length >= 50
    ) {

        notify(
            "50-channel limit reached."
        );

        return;
    }


    const name =
        document.getElementById(
            "channelNameInput"
        ).value.trim();


    const platform =
        document.getElementById(
            "channelPlatform"
        ).value;


    const method =
        document.getElementById(
            "connectionMethod"
        ).value;


    const streamKey =
        document.getElementById(
            "channelStreamKey"
        ).value.trim();


    if (!name) {

        notify(
            "Please enter a channel name."
        );

        return;
    }


    if (
        method === "Stream Key" &&
        !streamKey
    ) {

        notify(
            "Please enter a stream key."
        );

        return;
    }


    const channel = {

        id:
            crypto.randomUUID(),

        name:
            name,

        platform:
            platform,

        method:
            method,

        /*
         * IMPORTANT:
         * This demo stores a placeholder
         * rather than exposing a real key.
         *
         * Production stream keys should
         * be stored securely on a backend.
         */

        hasStreamKey:
            method === "Stream Key"
                ? true
                : false,

        connected:
            false

    };


    channels.push(
        channel
    );


    saveChannels();

    renderChannels();

    closeChannelModal();


    notify(
        `Channel "${name}" added.`
    );

}


function renderChannels() {

    const list =
        document.getElementById(
            "channelList"
        );


    list.innerHTML = "";


    document.getElementById(
        "channelCount"
    ).textContent =
        `${channels.length} / 50`;


    document.getElementById(
        "addChannelButton"
    ).disabled =
        channels.length >= 50;


    if (
        channels.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                No channels connected yet.

                <br>

                Click
                <strong>+ Add Channel</strong>
                to add one.

            </div>

        `;

        return;
    }


    channels.forEach(
        channel => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "channel-item";


            item.innerHTML = `

                <div
                    class="channel-icon"
                >
                    ${getPlatformIcon(
                        channel.platform
                    )}
                </div>


                <div
                    class="channel-info"
                >

                    <strong>
                        ${escapeHTML(
                            channel.name
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            channel.platform
                        )}
                        •
                        ${
                            channel.connected
                                ? "Connected"
                                : "Not Connected"
                        }
                    </span>

                </div>


                <div
                    class="channel-actions"
                >

                    <button
                        onclick="toggleChannel('${channel.id}')"
                    >
                        ${
                            channel.connected
                                ? "Disconnect"
                                : "Connect"
                        }
                    </button>


                    <button
                        onclick="deleteChannel('${channel.id}')"
                    >
                        🗑
                    </button>

                </div>

            `;


            list.appendChild(
                item
            );

        }
    );

}


function toggleChannel(id) {

    const channel =
        channels.find(
            item =>
                item.id === id
        );


    if (!channel) {
        return;
    }


    channel.connected =
        !channel.connected;


    saveChannels();

    renderChannels();


    notify(
        channel.connected
            ? `${channel.name} connected.`
            : `${channel.name} disconnected.`
    );

}


function deleteChannel(id) {

    const channel =
        channels.find(
            item =>
                item.id === id
        );


    if (!channel) {
        return;
    }


    if (
        !confirm(
            `Remove "${channel.name}"?`
        )
    ) {

        return;

    }


    channels =
        channels.filter(
            item =>
                item.id !== id
        );


    saveChannels();

    renderChannels();


    notify(
        "Channel removed."
    );

}


function saveChannels() {

    localStorage.setItem(
        "deskStreamChannels",

        JSON.stringify(
            channels
        )
    );

}


function getPlatformIcon(
    platform
) {

    const icons = {

        "YouTube": "▶",

        "Facebook": "f",

        "TikTok": "♪",

        "Twitch": "◈",

        "Custom RTMP": "↗"

    };


    return icons[
        platform
    ] || "●";

}


/* =========================
   STREAMING
========================= */

function startStreaming() {

    if (isStreaming) {
        return;
    }


    const title =
        document.getElementById(
            "streamTitle"
        ).value.trim();


    if (!title) {

        notify(
            "Enter a stream title first."
        );

        document.getElementById(
            "streamTitle"
        ).focus();

        return;
    }


    const connectedChannels =
        channels.filter(
            channel =>
                channel.connected
        );


    if (
        connectedChannels.length === 0
    ) {

        notify(
            "Connect at least one channel first."
        );

        return;
    }


    isStreaming = true;

    streamSeconds = 0;


    document.getElementById(
        "streamStatus"
    ).textContent =
        "LIVE";


    document.getElementById(
        "streamTimer"
    ).textContent =
        "00:00:00";


    document.getElementById(
        "liveDot"
    ).classList.add(
        "live"
    );


    document.getElementById(
        "connectionDot"
    ).classList.add(
        "live"
    );


    document.getElementById(
        "connectionStatus"
    ).textContent =
        "LIVE";


    document.getElementById(
        "startStreamButton"
    ).textContent =
        "■ Stop Streaming";


    document.getElementById(
        "startStreamButton"
    ).onclick =
        stopStreaming;


    /*
     * Save public stream metadata
     * for the Live page to use later.
     *
     * This is NOT a real video stream.
     * A real streaming backend is required.
     */

    localStorage.setItem(
        "deskStreamActiveStream",

        JSON.stringify({

            title:
                title,

            description:
                localStorage.getItem(
                    "deskStreamDescription"
                ) || "",

            category:
                document.getElementById(
                    "streamCategory"
                ).value,

            quality:
                document.getElementById(
                    "videoQuality"
                ).value,

            frameRate:
                document.getElementById(
                    "frameRate"
                ).value,

            startedAt:
                new Date().toISOString()

        })
    );


    streamTimer =
        setInterval(
            updateStreamTimer,
            1000
        );


    notify(
        "Stream started in demo mode."
    );

}


function stopStreaming() {

    if (!isStreaming) {
        return;
    }


    isStreaming = false;


    clearInterval(
        streamTimer
    );


    document.getElementById(
        "streamStatus"
    ).textContent =
        "OFFLINE";


    document.getElementById(
        "streamTimer"
    ).textContent =
        "Ready";


    document.getElementById(
        "liveDot"
    ).classList.remove(
        "live"
    );


    document.getElementById(
        "connectionDot"
    ).classList.remove(
        "live"
    );


    document.getElementById(
        "connectionStatus"
    ).textContent =
        "Ready";


    const button =
        document.getElementById(
            "startStreamButton"
        );


    button.textContent =
        "▶ Start Streaming";


    button.onclick =
        startStreaming;


    /*
     * Move active stream information
     * into past stream history.
     */

    const active =
        localStorage.getItem(
            "deskStreamActiveStream"
        );


    if (active) {

        const history =
            JSON.parse(
                localStorage.getItem(
                    "deskStreamPastStreams"
                ) || "[]"
            );


        const stream =
            JSON.parse(active);


        stream.endedAt =
            new Date().toISOString();


        history.unshift(
            stream
        );


        localStorage.setItem(
            "deskStreamPastStreams",

            JSON.stringify(
                history
            )
        );


        localStorage.removeItem(
            "deskStreamActiveStream"
        );

    }


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


    const time =

        String(hours)
            .padStart(2, "0")

        + ":" +

        String(minutes)
            .padStart(2, "0")

        + ":" +

        String(seconds)
            .padStart(2, "0");


    document.getElementById(
        "streamTimer"
    ).textContent =
        time;

}


/* =========================
   RECORDING
========================= */

function toggleRecording() {

    isRecording =
        !isRecording;


    const button =
        document.getElementById(
            "startRecordingButton"
        );


    button.textContent =
        isRecording
            ? "■ Stop Recording"
            : "● Start Recording";


    notify(
        isRecording
            ? "Recording started in demo mode."
            : "Recording stopped."
    );

}


/* =========================
   VIRTUAL CAMERA
========================= */

function toggleVirtualCamera() {

    virtualCameraEnabled =
        !virtualCameraEnabled;


    document.getElementById(
        "virtualCameraButton"
    ).textContent =

        virtualCameraEnabled

            ? "■ Stop Virtual Camera"

            : "📷 Start Virtual Camera";


    notify(

        virtualCameraEnabled

            ? "Virtual Camera enabled in demo mode."

            : "Virtual Camera stopped."

    );

}


/* =========================
   STUDIO MODE
========================= */

function openStudioMode() {

    notify(
        "Studio Mode opened in demo mode."
    );

}


/* =========================
   SETTINGS
========================= */

function openSettings() {

    notify(
        "Settings opened."
    );

}


/* =========================
   ESCAPE HTML
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


/* =========================
   STARTUP
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderScenes();

        renderChannels();


        const savedDescription =
            localStorage.getItem(
                "deskStreamDescription"
            );


        if (savedDescription) {

            document.getElementById(
                "streamDescription"
            ).value =
                savedDescription;

        }

    }
);
