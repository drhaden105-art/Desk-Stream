const app = document.getElementById("app");

const page = {

  /* HOME */

  home() {

    return `
      <section class="hero">

        <div class="eyebrow">
          Desk Stream
        </div>

        <h1>
          Stream, present, watch and share.
        </h1>

        <p>
          A browser-first streaming platform with
          channels, live broadcasts and Bible projection.
          Designed for creators, churches, communities
          and events.
        </p>

        <div class="actions">

          <button
            class="primary"
            data-page="studio"
          >
            Start a stream
          </button>

          <button
            class="ghost"
            data-page="bible"
          >
            Open Bible Projection
          </button>

        </div>

      </section>

      <section>

        <div class="row">

          <h2>
            Featured live
          </h2>

          <button
            class="ghost"
            data-page="live"
          >
            View all
          </button>

        </div>

        <div
          id="featured"
          class="grid"
        ></div>

      </section>

      <section style="margin-top:34px">

        <h2>
          Built into Desk Stream
        </h2>

        <div class="grid">

          <article class="card">

            <span class="badge live">
              LIVE
            </span>

            <h3>
              Low-latency streaming
            </h3>

            <p>
              Architecture ready for adaptive
              bitrate and multiple output qualities.
            </p>

          </article>

          <article class="card">

            <span class="badge">
              PRESENT
            </span>

            <h3>
              Bible Projection
            </h3>

            <p>
              Search scripture and display a clean
              full-screen presentation view.
            </p>

          </article>

          <article class="card">

            <span class="badge">
              CONNECT
            </span>

            <h3>
              OBS / RTMP
            </h3>

            <p>
              Create a stream configuration for
              compatible streaming software and platforms.
            </p>

          </article>

          <article class="card">

            <span class="badge">
              FREE
            </span>

            <h3>
              No required paid tier
            </h3>

            <p>
              The product experience is designed
              around free access.
            </p>

          </article>

        </div>

      </section>
    `;
  },


  /* LIVE */

  async live() {

    const channels =
      await fetch("/api/channels")
        .then(response => response.json());

    return `
      <h1>
        Live
      </h1>

      <p>
        Currently live channels.
      </p>

      <div class="grid">

        ${
          channels
            .filter(channel => channel.live)
            .map(channel => `

              <article class="card">

                <span class="badge live">
                  ● LIVE
                </span>

                <h3>
                  ${esc(channel.name)}
                </h3>

                <p>
                  ${esc(channel.category)}
                  •
                  ${channel.viewers}
                  viewers
                </p>

                <button
                  class="primary"
                  onclick="watch('${channel.id}')"
                >
                  Watch
                </button>

              </article>

            `)
            .join("")
            ||

          `
            <div class="empty">
              No channels are live right now.
            </div>
          `
        }

      </div>
    `;
  },


  /* CHANNELS */

  async channels() {

    const channels =
      await fetch("/api/channels")
        .then(response => response.json());

    return `
      <h1>
        Channels
      </h1>

      <p>
        Discover Desk Stream channels.
      </p>

      <div class="grid">

        ${
          channels
            .map(channel => `

              <article class="card">

                <span class="badge">
                  ${esc(channel.category)}
                </span>

                <h3>
                  ${esc(channel.name)}
                </h3>

                <p>
                  ${
                    channel.live
                      ? "Live now"
                      : "Offline"
                  }
                </p>

              </article>

            `)
            .join("")
        }

      </div>
    `;
  },


  /* BIBLE */

  bible() {

    return `
      <h1>
        Bible Projection
      </h1>

      <p>
        A presentation workspace for verses
        and church services.
      </p>

      <div class="grid">

        <section class="card form">

          <label>
            Book

            <input
              id="book"
              value="John"
            >

          </label>

          <label>
            Chapter

            <input
              id="chapter"
              type="number"
              value="3"
              min="1"
            >

          </label>

          <label>
            Verse

            <input
              id="verse"
              value="16"
            >

          </label>

          <button
            class="primary"
            onclick="projectVerse()"
          >
            Project verse
          </button>

        </section>

        <section
          class="video"
          id="projectionPreview"
        >
          Projection preview
        </section>

      </div>

      <p class="small">

        For production use, licensed or
        public-domain Bible text should be
        connected through an appropriate Bible
        text source.

      </p>
    `;
  },


  /* VIDEOS */

  videos() {

    return `
      <h1>
        Videos
      </h1>

      <div class="empty">
        Your on-demand library will appear here.
      </div>
    `;
  },


  /* CREATOR STUDIO */

  async studio() {

    return `
      <h1>
        Creator Studio
      </h1>

      <p>
        Create a Desk Stream stream configuration
        for OBS or another compatible RTMP encoder.
      </p>

      <section class="card form">

        <label>
          Stream title

          <input
            id="title"
            value="Sunday Service"
          >

        </label>

        <label>
          Category

          <select id="category">

            <option>
              Churches
            </option>

            <option>
              Gaming
            </option>

            <option>
              Music
            </option>

            <option>
              Education
            </option>

            <option>
              Sports
            </option>

            <option>
              Entertainment
            </option>

            <option>
              Other
            </option>

          </select>

        </label>

        <label>
          Preferred quality

          <select id="quality">

            <option>
              1440p
            </option>

            <option>
              2160p 4K
            </option>

            <option>
              1080p
            </option>

          </select>

        </label>

        <button
          class="primary"
          onclick="createStream()"
        >
          Create stream
        </button>

      </section>

      <div
        id="streamResult"
        style="margin-top:20px"
      ></div>

      <section style="margin-top:30px">

        <h2>
          Destination options
        </h2>

        <div
          id="platforms"
          class="grid"
        ></div>

      </section>
    `;
  }

};


/* PAGE RENDERER */

async function render(name = "home") {

  const selectedPage =
    page[name] || page.home;

  app.innerHTML =
    await selectedPage();


  if (name === "home") {

    const channels =
      await fetch("/api/channels")
        .then(response => response.json());

    document.getElementById(
      "featured"
    ).innerHTML =

      channels
        .filter(channel => channel.live)
        .map(channel => `

          <article class="card">

            <span class="badge live">
              ● LIVE
            </span>

            <h3>
              ${esc(channel.name)}
            </h3>

            <p>
              ${esc(channel.category)}
              •
              ${channel.viewers}
              viewers
            </p>

            <button
              class="primary"
              onclick="watch('${channel.id}')"
            >
              Watch
            </button>

          </article>

        `)
        .join("")

      ||

      `
        <div class="empty">
          No live streams right now.
        </div>
      `;
  }


  if (name === "studio") {

    loadPlatforms();

  }

}


/* STREAMING PLATFORMS */

async function loadPlatforms() {

  const platforms =
    await fetch(
      "/api/streaming/platforms"
    ).then(response => response.json());

  document.getElementById(
    "platforms"
  ).innerHTML =

    platforms
      .map(platform => `

        <article class="card">

          <h3>
            ${esc(platform.name)}
          </h3>

          <p>
            ${
              platform.auth === "google"
                ? "Google authorization"
                : "Stream key / RTMP"
            }

            • RTMP capable
          </p>

        </article>

      `)
      .join("");
}


/* CREATE STREAM */

async function createStream() {

  const body = {

    title:
      document.getElementById(
        "title"
      ).value,

    category:
      document.getElementById(
        "category"
      ).value,

    quality:
      document.getElementById(
        "quality"
      ).value

  };


  const data =
    await fetch(
      "/api/stream/create",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(body)
      }
    ).then(response => response.json());


  document.getElementById(
    "streamResult"
  ).innerHTML = `

    <section class="card">

      <div class="row">

        <h2>
          Stream created
        </h2>

        <span class="badge">
          ${esc(data.quality)}
        </span>

      </div>

      <p>
        Use these settings in an
        RTMP-compatible encoder.
      </p>

      <label>
        Server

        <input
          readonly
          value="${esc(data.rtmpServer)}"
        >

      </label>

      <label>
        Stream key

        <input
          readonly
          value="${esc(data.streamKey)}"
        >

      </label>

      <p class="small">

        This starter generates a local
        demo configuration.

        A production deployment needs
        a real media server and secure
        secret storage before live video
        can be transmitted.

      </p>

    </section>
  `;
}


/* BIBLE PROJECTION */

function projectVerse() {

  const book =
    document.getElementById(
      "book"
    ).value;

  const chapter =
    document.getElementById(
      "chapter"
    ).value;

  const verse =
    document.getElementById(
      "verse"
    ).value;


  document.getElementById(
    "projectionPreview"
  ).innerHTML = `

    <div>

      <div class="eyebrow">
        ${esc(book)}
        ${esc(chapter)}:${esc(verse)}
      </div>

      <h2>
        Projection Preview
      </h2>

      <p>
        Connect your licensed Bible text
        source to display the selected
        verse here.
      </p>

    </div>
  `;
}


/* WATCH */

function watch(id) {

  app.innerHTML = `

    <h1>
      Live Player
    </h1>

    <div class="video">

      Video player will appear here
      when the media backend is connected.

    </div>

    <div
      class="card"
      style="margin-top:18px"
    >

      <h2>
        ${esc(id)}
      </h2>

      <p>
        This browser UI is ready for a
        production HLS/WebRTC player.
      </p>

    </div>
  `;
}


/* SECURITY */

function esc(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,

      character => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"

      }[character])
    );
}


/* NAVIGATION */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-page]"
      );

    if (!button) {
      return;
    }

    render(
      button.dataset.page
    );

  }
);


/* SEARCH */

document
  .getElementById("searchBtn")
  .addEventListener(
    "click",
    () => {

      const query =
        prompt(
          "Search Desk Stream"
        );

      if (query) {

        alert(
          `Search for "${query}" will connect to the full search index in the next backend stage.`
        );

      }

    }
  );


/* START */

render();
