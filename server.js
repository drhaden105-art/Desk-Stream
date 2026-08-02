const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;

const MAX_CHANNELS_PER_ACCOUNT = 50;

app.use(cors());
app.use(express.json());

/*
====================================================
 DESK STREAM BACKEND
====================================================

 Features:
 - Account channel management
 - Maximum 50 channels per account
 - Stream management
 - Platform list
 - Health check

 IMPORTANT:
 This development version stores data in memory.
 Data will be lost when the server restarts.

 DO NOT store real passwords, stream keys,
 OAuth tokens, or other secrets in this file.
====================================================
*/


/* ==================================================
   DEVELOPMENT DATABASE
================================================== */

const accounts = new Map();

const streams = new Map();


/* ==================================================
   HELPER FUNCTIONS
================================================== */

function generateId(prefix) {

    return (
        prefix +
        "_" +
        crypto.randomBytes(8).toString("hex")
    );

}


function cleanText(value, maxLength = 100) {

    if (typeof value !== "string") {
        return "";
    }

    return value
        .trim()
        .slice(0, maxLength);

}


function getOrCreateAccount(accountId) {

    const id =
        cleanText(accountId, 100) ||
        "demo-account";

    if (!accounts.has(id)) {

        accounts.set(id, {

            id: id,

            channels: []

        });

    }

    return accounts.get(id);

}


/* ==================================================
   HEALTH CHECK
================================================== */

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        service: "Desk Stream",

        status: "online",

        version: "1.0.0",

        time: new Date().toISOString()

    });

});


/* ==================================================
   CHANNELS
================================================== */


/*
----------------------------------------------------
 CREATE CHANNEL
----------------------------------------------------
*/

app.post("/api/channels", (req, res) => {

    const accountId =
        cleanText(
            req.body.accountId,
            100
        ) || "demo-account";


    const account =
        getOrCreateAccount(accountId);


    /*
      Maximum 50 channels
    */

    if (
        account.channels.length >=
        MAX_CHANNELS_PER_ACCOUNT
    ) {

        return res.status(409).json({

            success: false,

            message:
                "Channel limit reached. " +
                "Each account can have up to " +
                MAX_CHANNELS_PER_ACCOUNT +
                " channels.",

            limit: MAX_CHANNELS_PER_ACCOUNT,

            current:
                account.channels.length

        });

    }


    const name =
        cleanText(
            req.body.name,
            80
        );


    if (!name) {

        return res.status(400).json({

            success: false,

            message:
                "Channel name is required."

        });

    }


    /*
      Prevent duplicate channel names
      within the same account.
    */

    const duplicate =
        account.channels.some(
            channel =>
                channel.name.toLowerCase() ===
                name.toLowerCase()
        );


    if (duplicate) {

        return res.status(409).json({

            success: false,

            message:
                "You already have a channel " +
                "with that name."

        });

    }


    const channel = {

        id: generateId("channel"),

        accountId: account.id,

        name: name,

        username:
            cleanText(
                req.body.username,
                50
            ),

        description:
            cleanText(
                req.body.description,
                500
            ),

        category:
            cleanText(
                req.body.category,
                50
            ) || "Other",

        profileImage:
            cleanText(
                req.body.profileImage,
                500
            ),

        bannerImage:
            cleanText(
                req.body.bannerImage,
                500
            ),

        isLive: false,

        followers: 0,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    account.channels.push(channel);


    res.status(201).json({

        success: true,

        message:
            "Channel created successfully.",

        channel: channel,

        channelCount:
            account.channels.length,

        channelLimit:
            MAX_CHANNELS_PER_ACCOUNT

    });

});


/*
----------------------------------------------------
 LIST CHANNELS
----------------------------------------------------
*/

app.get("/api/channels", (req, res) => {

    const accountId =
        cleanText(
            req.query.accountId,
            100
        ) || "demo-account";


    const account =
        getOrCreateAccount(accountId);


    res.json({

        success: true,

        accountId: account.id,

        channels:
            account.channels,

        channelCount:
            account.channels.length,

        channelLimit:
            MAX_CHANNELS_PER_ACCOUNT,

        remaining:
            MAX_CHANNELS_PER_ACCOUNT -
            account.channels.length

    });

});


/*
----------------------------------------------------
 GET ONE CHANNEL
----------------------------------------------------
*/

app.get("/api/channels/:channelId", (req, res) => {

    const channelId =
        req.params.channelId;


    const accountId =
        cleanText(
            req.query.accountId,
            100
        ) || "demo-account";


    const account =
        getOrCreateAccount(accountId);


    const channel =
        account.channels.find(
            item =>
                item.id === channelId
        );


    if (!channel) {

        return res.status(404).json({

            success: false,

            message:
                "Channel not found."

        });

    }


    res.json({

        success: true,

        channel: channel

    });

});


/*
----------------------------------------------------
 UPDATE CHANNEL
----------------------------------------------------
*/

app.put("/api/channels/:channelId", (req, res) => {

    const channelId =
        req.params.channelId;


    const accountId =
        cleanText(
            req.body.accountId,
            100
        ) || "demo-account";


    const account =
        getOrCreateAccount(accountId);


    const channel =
        account.channels.find(
            item =>
                item.id === channelId
        );


    if (!channel) {

        return res.status(404).json({

            success: false,

            message:
                "Channel not found."

        });

    }


    if (req.body.name !== undefined) {

        const newName =
            cleanText(
                req.body.name,
                80
            );


        if (!newName) {

            return res.status(400).json({

                success: false,

                message:
                    "Channel name cannot be empty."

            });

        }


        const duplicate =
            account.channels.some(
                item =>
                    item.id !== channel.id &&
                    item.name.toLowerCase() ===
                    newName.toLowerCase()
            );


        if (duplicate) {

            return res.status(409).json({

                success: false,

                message:
                    "Another channel already " +
                    "uses that name."

            });

        }


        channel.name = newName;

    }


    if (req.body.username !== undefined) {

        channel.username =
            cleanText(
                req.body.username,
                50
            );

    }


    if (req.body.description !== undefined) {

        channel.description =
            cleanText(
                req.body.description,
                500
            );

    }


    if (req.body.category !== undefined) {

        channel.category =
            cleanText(
                req.body.category,
                50
            ) || "Other";

    }


    if (req.body.profileImage !== undefined) {

        channel.profileImage =
            cleanText(
                req.body.profileImage,
                500
            );

    }


    if (req.body.bannerImage !== undefined) {

        channel.bannerImage =
            cleanText(
                req.body.bannerImage,
                500
            );

    }


    channel.updatedAt =
        new Date().toISOString();


    res.json({

        success: true,

        message:
            "Channel updated successfully.",

        channel: channel

    });

});


/*
----------------------------------------------------
 DELETE CHANNEL
----------------------------------------------------
*/

app.delete("/api/channels/:channelId", (req, res) => {

    const channelId =
        req.params.channelId;


    const accountId =
        cleanText(
            req.query.accountId,
            100
        ) || "demo-account";


    const account =
        getOrCreateAccount(accountId);


    const index =
        account.channels.findIndex(
            channel =>
                channel.id === channelId
        );


    if (index === -1) {

        return res.status(404).json({

            success: false,

            message:
                "Channel not found."

        });

    }


    const removedChannel =
        account.channels.splice(
            index,
            1
        )[0];


    /*
      Stop any stream associated
      with the deleted channel.
    */

    streams.delete(channelId);


    res.json({

        success: true,

        message:
            "Channel deleted successfully.",

        channel:
            removedChannel,

        channelCount:
            account.channels.length,

        channelLimit:
            MAX_CHANNELS_PER_ACCOUNT

    });

});


/* ==================================================
   STREAM MANAGEMENT
================================================== */


/*
----------------------------------------------------
 START STREAM
----------------------------------------------------
*/

app.post("/api/stream/start", (req, res) => {

    const channelId =
        cleanText(
            req.body.channelId,
            100
        );


    const accountId =
        cleanText(
            req.body.accountId,
            100
        ) || "demo-account";


    if (!channelId) {

        return res.status(400).json({

            success: false,

            message:
                "A channel ID is required."

        });

    }


    const account =
        getOrCreateAccount(accountId);


    const channel =
        account.channels.find(
            item =>
                item.id === channelId
        );


    if (!channel) {

        return res.status(404).json({

            success: false,

            message:
                "Channel not found."

        });

    }


    if (streams.has(channelId)) {

        return res.status(409).json({

            success: false,

            message:
                "This channel is already streaming."

        });

    }


    const stream = {

        id: generateId("stream"),

        channelId: channelId,

        accountId: accountId,

        title:
            cleanText(
                req.body.title,
                150
            ) || "Untitled Stream",

        category:
            cleanText(
                req.body.category,
                50
            ) || channel.category,

        quality:
            cleanText(
                req.body.quality,
                20
            ) || "1080p",

        fps:
            cleanText(
                req.body.fps,
                20
            ) || "30 FPS",

        platform:
            cleanText(
                req.body.platform,
                50
            ) || "Desk Stream",

        active: true,

        startedAt:
            new Date().toISOString()

    };


    streams.set(
        channelId,
        stream
    );


    channel.isLive = true;


    channel.updatedAt =
        new Date().toISOString();


    res.status(201).json({

        success: true,

        message:
            "Stream session created.",

        stream: stream,

        channel: channel

    });

});


/*
----------------------------------------------------
 STOP STREAM
----------------------------------------------------
*/

app.post("/api/stream/stop", (req, res) => {

    const channelId =
        cleanText(
            req.body.channelId,
            100
        );


    if (!channelId) {

        return res.status(400).json({

            success: false,

            message:
                "A channel ID is required."

        });

    }


    const stream =
        streams.get(channelId);


    if (!stream) {

        return res.status(404).json({

            success: false,

            message:
                "No active stream found."

        });

    }


    streams.delete(channelId);


    const account =
        getOrCreateAccount(
            stream.accountId
        );


    const channel =
        account.channels.find(
            item =>
                item.id === channelId
        );


    if (channel) {

        channel.isLive = false;

        channel.updatedAt =
            new Date().toISOString();

    }


    res.json({

        success: true,

        message:
            "Stream stopped.",

        previousStream:
            stream

    });

});


/*
----------------------------------------------------
 STREAM STATUS
----------------------------------------------------
*/

app.get("/api/stream/status", (req, res) => {

    const channelId =
        cleanText(
            req.query.channelId,
            100
        );


    if (!channelId) {

        return res.status(400).json({

            success: false,

            message:
                "A channel ID is required."

        });

    }


    const stream =
        streams.get(channelId);


    if (!stream) {

        return res.json({

            success: true,

            active: false,

            stream: null

        });

    }


    res.json({

        success: true,

        active: true,

        stream: stream

    });

});


/* ==================================================
   PLATFORM LIST
================================================== */

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


/* ==================================================
   CHANNEL LIMIT
================================================== */

app.get(
    "/api/channels/limit",
    (req, res) => {

        const accountId =
            cleanText(
                req.query.accountId,
                100
            ) || "demo-account";


        const account =
            getOrCreateAccount(
                accountId
            );


        res.json({

            success: true,

            limit:
                MAX_CHANNELS_PER_ACCOUNT,

            used:
                account.channels.length,

            remaining:
                MAX_CHANNELS_PER_ACCOUNT -
                account.channels.length,

            canCreate:
                account.channels.length <
                MAX_CHANNELS_PER_ACCOUNT

        });

    }
);


/* ==================================================
   ERROR HANDLER
================================================== */

app.use(
    (err, req, res, next) => {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                "Desk Stream encountered a server error."

        });

    }
);


/* ==================================================
   START SERVER
================================================== */

app.listen(
    PORT,
    () => {

        console.log(
            "===================================="
        );

        console.log(
            "       DESK STREAM SERVER"
        );

        console.log(
            "===================================="
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Maximum channels per account: ${MAX_CHANNELS_PER_ACCOUNT}`
        );

    }
);
