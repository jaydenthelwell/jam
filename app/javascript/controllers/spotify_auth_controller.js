import { Controller } from "@hotwired/stimulus";
import Rails from "@rails/ujs";

// Connects to data-controller="spotify-auth"
export default class extends Controller {
  // static values = { clientId: String };
  static targets = ['auth', 'genres']

  connect() {
    console.log("This is from Connect Spotify Stimulus");

    this.getTopGenres();
    this.getTopArtists();
    this.getTopTracks();

    let access_token = localStorage.getItem("access_token");

    if (access_token !== null) {
      console.log("Spotify Account Authozised")
      console.log(this.authTarget)

      console.log(this.genresTarget)
      // this.genresTarget.classList.remove("d-none")
    } else {
      console.log("Spotify Account Not Authozised")
      // this.authTarget.classList.remove("d-none")
    }

    // Check if there's any params in the URL, if yes, will call #handleRedirect() to clean up the URL
    if (window.location.search.length > 0) {
      this.#handleRedirect();
    } else {
      // let access_token = localStorage.getItem("access_token");
    }

    // let client_id = document.querySelector(".spotify-env").dataset.clientId;
    // let client_secret = document.querySelector(".spotify-env").dataset.clientSecret;

    // localStorage.setItem("client_id", client_id);
    // localStorage.setItem("client_secret", client_secret);
  }

  disconnect() {
    // localStorage.removeItem("access_token");
    // localStorage.removeItem("refresh_token");
  }


  #requestAuthorization() {
    console.log("This is requestAuthorization");

    // Your client id
    let client_id = "3cb7538518ab456b9caf81d7a965a2c6";
    let client_secret = "5567c114cf644cb4a0dee55b8faf5a38";
    console.log("client_id:", client_id);
    console.log("client_secret:", client_secret);

    // Your redirect uri
    let redirect_uri = "https://jam-portfolio-6bb344866d62.herokuapp.com/profile";
    console.log("redirect_uri:", redirect_uri);

    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);
    localStorage.setItem("redirect_uri", redirect_uri);

    // Application requests authorization
    let scope =
    "user-top-read user-follow-read user-read-playback-state user-modify-playback-state";
    let params = new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    });

    let spotifyUrl =
      "https://accounts.spotify.com/authorize?" + params.toString();

    // Call handleUnauthorizedError if it exists

    // Direct the Spotify API Authorization Page
    window.location.href = spotifyUrl;
  }

  #handleRedirect() {
    console.log("This is handle redirect");
    let code = this.#getCode();

    this.#fetchAccessToken(code);

    // Your redirect uri
    // let redirect_uri = "https://lfc-sandbox-c15f95ad1922.herokuapp.com/profile";
    // let redirect_uri = "https://jam-portfolio-6bb344866d62.herokuapp.com/profile";

    let redirect_uri = localStorage.getItem("redirect_uri");

    window.history.pushState("", "", redirect_uri);
  }

  #getCode() {
    console.log("This is get code");

    let code = null;

    const queryString = window.location.search;

    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get("code");
    }

    return code;
  }

  #fetchAccessToken(code) {

    let client_id = "3cb7538518ab456b9caf81d7a965a2c6";
    let client_secret = "5567c114cf644cb4a0dee55b8faf5a38";
    let redirect_uri = localStorage.getItem("redirect_uri");

    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    console.log("Fetch token");

    this.#callAuthorizationApi(body);
  }

  #callAuthorizationApi(body) {
    console.log("Calling authorization api");
    let client_id = "3cb7538518ab456b9caf81d7a965a2c6";
    let client_secret = "5567c114cf644cb4a0dee55b8faf5a38";

    const TOKEN = "https://accounts.spotify.com/api/token";

    fetch(TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(client_id + ":" + client_secret),
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.token_type === "Bearer") {
          this.#handleAuthorizationResponse(data);
        }
      })
      .catch((error) => {
          this.handleUnauthorizedError(error);
      });
  }

  #handleAuthorizationResponse(data) {
    let access_token;
    let refresh_token;

    if (data.access_token != undefined) {
      access_token = data.access_token;
      localStorage.setItem("access_token", access_token);
    }

    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
      console.log("Handling authorization");
      localStorage.setItem("refresh_token", refresh_token);
    }
  this.getTopArtists
    // this.connect();
  }



  linkToSpotify(e) {
    e.preventDefault();
    console.log("This is linkToSpotify");
    this.#requestAuthorization();
  }

  refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      console.error("Refresh token not found in local storage.");
      return;
    }

    // Call your method to request a new access token using the refresh token
    this.#fetchAccessToken(refreshToken);
  }

  playTrack(e) {
    console.log("This is playTrack Stimulus");

    const trackId = e.currentTarget.dataset.trackId;
    console.log(trackId);

    let access_token = localStorage.getItem("access_token");
    console.log("Access Token:", access_token);
    this.fetchValidDeviceId(access_token, trackId);
  }

  pauseTrack() {
    console.log("This is pauseTrack Stimulus");

    let access_token = localStorage.getItem("access_token");
    console.log("Access Token:", access_token);
    let deviceId = localStorage.getItem("device");
    console.log(deviceId);

    const pauseUrl = "https://api.spotify.com/v1/me/player/pause";
    // const pauseUrl = `https://api.spotify.com/v1/me/player/pause/${deviceId}`;

    fetch(pauseUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        // Handle error
      });
  }

  async saveTopGenres(genre) {
    try {
      const response = await fetch("/top_genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": Rails.csrfToken(),
          // You might need to include other headers, like authorization headers
        },
        body: JSON.stringify({ genre: genre }), // Assuming your genre data is an object
      })

      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      }

      const data = await response.json();
      console.log(data);

      console.log("Genre instance created:", data);

      // const topGenres = document.querySelector(".top-genres-list");
      const topGenres = document.querySelector(".genres-list");
      topGenres.insertAdjacentHTML("beforeend", `<p>${genre}</p>`);
    } catch (error) {
      console.log(error)
    }
  }

  handleUnauthorizedError(response) {
    if (response.status === 401) {
      // Token has expired or is invalid
      console.log("Access token expired or invalid, refreshing...");

      // Call your method to refresh access token
      this.refreshAccessToken();
    }

    // Return the response for further processing
    return response;
  }



  getTopArtists() {
    console.log("This is getTopArtists Stimulus");
    let access_token = localStorage.getItem("access_token");
    console.log("Access Token:", access_token);
    this.retryFailedRequest(this.fetchTopArtists, access_token);
    fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching top artists: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const topArtists = document.querySelector(".top-artists-container");

      data.items.forEach((artist) => {
        topArtists.insertAdjacentHTML(
          "beforeend",
          `<p><a href="${artist.external_urls.spotify}" target="_blank">${artist.name}</a></p>`
        );
      });
    })
    .catch((error) => {
      console.error("Error in getTopArtists:", error);
      // Optionally, call handleUnauthorizedError if it exists
      if (this.handleUnauthorizedError) {
        this.handleUnauthorizedError(error);
      }
    });
  }

  getTopGenres() {
    console.log("Fetching top genres...");

    let access_token = localStorage.getItem("access_token");
    console.log("Access Token:", access_token);

    fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching top genres: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Received data from Spotify API:", data);

      if (data.items) {
        let genres = [];

        data.items.forEach((artist) => {
          genres = genres.concat(artist.genres);
        });

        let topFiveGenres = this.#topNMostFrequentElements(genres, 5);

        console.log("Top 5 genres:", topFiveGenres);

        if (topFiveGenres.length >= 5) {
          console.log("Updating top genres in HTML...");

          // Update HTML to display the top genres
          let topGenresContainer = document.querySelector(".top-genres-container");
          topGenresContainer.innerHTML = ""; // Clear previous content

          topFiveGenres.forEach((genre) => {
            let genreElement = document.createElement("div");
            genreElement.textContent = genre;
            topGenresContainer.appendChild(genreElement);
          });

          console.log("Genres updated successfully.");
        }
      } else {
        console.log("No data received from the Spotify API.");
      }
    })
    .catch((error) => {
      console.error("Error fetching top genres:", error);
      // Optionally, call handleUnauthorizedError if it exists
      if (this.handleUnauthorizedError) {
        this.handleUnauthorizedError(error);
      }
    });

    let redirectLink = "https://jam-portfolio-6bb344866d62.herokuapp.com/profile";
    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);

    if (currentUrl !== redirectLink) {
      console.log("Redirecting to:", redirectLink);
      window.location.href = redirectLink;
    }
  }

  getTopTracks() {
    console.log("This is getTopTracks Stimulus");

    let access_token = localStorage.getItem("access_token");
    console.log("Access Token:", access_token);

    fetch("https://api.spotify.com/v1/me/top/tracks?limit=5", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching top tracks: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Received top tracks data:", data);

      const topTracks = document.querySelector(".top-tracks-container");
      topTracks.innerHTML = "";

      data.items.forEach((track) => {
        topTracks.insertAdjacentHTML(
          "beforeend",
          `<p><a href="${track.external_urls.spotify}" target="_blank">${track.name}</a></p>`
        );
      });
    })
    .catch((error) => {
      console.error("Error fetching top tracks:", error);
      // Optionally, call handleUnauthorizedError if it exists
      if (this.handleUnauthorizedError) {
        this.handleUnauthorizedError(error);
      }
    });

    let redirectLink = "https://jam-portfolio-6bb344866d62.herokuapp.com/profile";
    const currentUrl = window.location.href;
    console.log("Current URL:", currentUrl);

    if (currentUrl !== redirectLink) {
      console.log("Redirecting to:", redirectLink);
      window.location.href = redirectLink;
    }
  }

  async fetchValidDeviceId(access_token, trackId) {
    const playUrl = "https://api.spotify.com/v1/me/player";
    let body;

    while (true) {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/devices",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + access_token,
            },
          }
        );

        const data = await response.json();
        console.log("This is fetching Spotify device");
        console.log(data);

        const smartPhoneDevice = data.devices.find(
          (device) => device.type === "Smartphone"
        );

        // if (smartPhoneDevice && smartPhoneDevice.is_active) {
        if (smartPhoneDevice) {
          const smartPhoneId = smartPhoneDevice.id;
          console.log(smartPhoneId);
          localStorage.setItem("device", smartPhoneId);

          // const playUrl = "https://api.spotify.com/v1/me/player";
          body = {
            device_ids: [smartPhoneId],
            play: true,
          };

          // Perform the 'play' action or any other relevant action here.
          // For example, you can use another fetch to play music on the device.

          break; // Exit the loop if a valid device ID is found.
        } else {
          console.log("No valid smartphone device found. Retrying...");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }

      // Wait for a short duration before trying again.
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
    }

    this.playMusicAsync(playUrl, access_token, body);

    console.log(trackId);

    const playTrackUrl = "https://api.spotify.com/v1/me/player/play";
    const bodyTrack = {
      uris: [`spotify:track:${trackId}`],
    };

    fetch(playTrackUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify(bodyTrack),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        // Handle error
      });
  }

  async playMusicAsync(playUrl, access_token, body) {
    try {
      const response = await fetch(playUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Request failed with status: " + response.status);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      // Handle error
      // console.error(error);
    }
  }




  #topNMostFrequentElements(array, n) {
    const frequencyMap = new Map();

    // Count the frequency of each element
    array.forEach((element) => {
      frequencyMap.set(element, (frequencyMap.get(element) || 0) + 1);
    });

    // Sort elements by frequency in descending order
    const sortedElements = Array.from(frequencyMap.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    // Get the top N most frequent elements
    const topN = sortedElements.slice(0, n).map((entry) => entry[0]);

    return topN;
  }
}
