const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const channels = [
  {
    id: "joy-church",
    name: "Joy Church",
    category: "Churches",
    live: true,
    viewers: 128
  },
  {
    id: "desk-demo",
    name: "Desk Stream Demo",
    category: "Education",
    live: false,
    viewers: 0
  }
];

const streams = new Map();

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Desk Stream",
    version: "1.0.0"
  });
});

app.get("/api/channels", (_req, res) => {
  res.json(channels);
});

app.get("/api/streaming/platforms", (_req, res) => {
  res.json([
    {
      id: "youtube",
      name: "YouTube",
      auth: "google",
      rtmp: true
    },
    {
      id: "tiktok",
      name: "TikTok",
      auth: "stream-key",
      rtmp: true
    },
    {
      id: "facebook",
      name: "Facebook",
      auth: "stream-key",
      rtmp: true
    },
    {
      id: "twitch",
      name: "Twitch",
      auth: "stream-key",
      rtmp: true
    },
    {
      id: "custom",
      name: "Custom RTMP",
      auth: "stream-key",
      rtmp: true
    }
  ]);
});

app.post("/api/stream/create", (req, res) => {
  const {
    title = "Untitled Stream",
    category = "Other",
    quality = "1440p"
  } = req.body || {};

  const id = crypto.randomUUID();
  const streamKey =
    "ds_" + crypto.randomBytes(18).toString("hex");

  const stream = {
    id,
    title,
    category,
    quality,
    streamKey,
    rtmpServer: "rtmps://stream.deskstream.local/live",
    status: "ready",
    createdAt: new Date().toISOString()
  };

  streams.set(id, stream);

  res.status(201).json(stream);
});

app.get("/api/stream/:id", (req, res) => {
  const stream = streams.get(req.params.id);

  if (!stream) {
    return res.status(404).json({
      error: "Stream not found"
    });
  }

  res.json({
    ...stream,
    streamKey: "••••••••••••••••••••"
  });
});

app.post("/api/stream/:id/status", (req, res) => {
  const stream = streams.get(req.params.id);

  if (!stream) {
    return res.status(404).json({
      error: "Stream not found"
    });
  }

  const allowed = [
    "ready",
    "live",
    "offline"
  ];

  if (!allowed.includes(req.body?.status)) {
    return res.status(400).json({
      error: "Invalid status"
    });
  }

  stream.status = req.body.status;

  res.json(stream);
});

app.get("*splat", (_req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

app.listen(PORT, () => {
  console.log(
    `Desk Stream running at http://localhost:${PORT}`
  );
});
