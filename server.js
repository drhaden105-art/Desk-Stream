const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/*
  Desk Stream Backend
  -------------------
  This server provides the API foundation for:
  - Stream management
  - Stream status
  - Platform configuration
  - Health monitoring

  IMPORTANT:
  Stream keys and API credentials should be stored
  as server environment variables, NOT in GitHub code.
*/


let currentStream = {
    active: false,
    title: "",
    category: "",
    quality: "",
    fps: "",
    platform: "",
    startedAt: null
};


/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        service: "Desk Stream",
        status: "online",
        time: new Date().toISOString()
    });

});


/* =========================
   STREAM STATUS
========================= */

app.get("/api/stream/status", (req, res) => {

    res.json({
        success: true,
        stream: currentStream
    });

});


/* =========================
   START STREAM
========================= */

app.post("/api/stream/start", (req, res) => {

    if (currentStream.active) {

        return res.status(409).json({
            success: false,
            message: "A stream is already active."
        });

    }

    const {
        title,
        category,
        quality,
        fps,
        platform
    } = req.body;


    if (!title) {

        return res.status(400).json({
            success: false,
            message: "Stream title is required."
        });

    }


    currentStream = {

        active: true,

        title: title,

        category: category || "Other",

        quality: quality || "1080p",

        fps: fps || "30 FPS",

        platform: platform || "Desk Stream",

        startedAt: new Date().toISOString()

    };


    console.log(
        "Desk Stream started:",
        currentStream
    );


    res.json({

        success: true,

        message: "Stream session created.",

        stream: currentStream

    });

});


/* =========================
   STOP STREAM
========================= */

app.post("/api/stream/stop", (req, res) => {

    if (!currentStream.active) {

        return res.status(400).json({

            success: false,

            message: "There is no active stream."

        });

    }


    const previousStream = {
        ...currentStream
    };


    currentStream = {

        active: false,

        title: "",

        category: "",

        quality: "",

        fps: "",

        platform: "",

        startedAt: null

    };


    console.log(
        "Desk Stream stopped."
    );


    res.json({

        success: true,

        message: "Stream stopped.",

        previousStream

    });

});


/* =========================
   PLATFORM LIST
========================= */

app.get("/api/platforms", (req, res) => {

    res.json({

        success: true,

        platforms: [

            {
                id: "desk-stream",
                name: "Desk Stream",
                type: "native"
            },

            {
                id: "youtube",
                name: "YouTube",
                type: "oauth"
            },

            {
                id: "tiktok",
                name: "TikTok",
                type: "oauth"
            },

            {
                id: "facebook",
                name: "Facebook",
                type: "oauth"
            },

            {
                id: "twitch",
                name: "Twitch",
                type: "oauth"
            },

            {
                id: "custom-rtmp",
                name: "Custom RTMP",
                type: "rtmp"
            }

        ]

    });

});


/* =========================
   SERVER
========================= */

app.listen(PORT, () => {

    console.log(
        `Desk Stream server running on port ${PORT}`
    );

});
