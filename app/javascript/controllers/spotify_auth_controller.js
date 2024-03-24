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

    console.log("Access Token:", access_token);

    if (access_token !== null) {
      console.log("Spotify Account Authorized");

      // Check if access token is expired
      const access_token_expiry = localStorage.getItem("access_token_expiry");
      const current_time = Math.floor(Date.now() / 1000);
      if (!access_token_expiry || current_time >= access_token_expiry) {
        console.log("Access token expired. Refreshing...");
        this.refreshAccessToken();
      }

      // Additional actions if the account is authorized
    } else {
      console.log("Spotify Account Not Authorized");
      // Additional actions if the account is not authorized
    }

    // Check if there's any params in the URL, if yes, will call #handleRedirect() to clean up the URL
    if (window.location.search.length > 0) {
      this.#handleRedirect();
    }
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
    let scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read';

    let params = new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    });

    let spotifyUrl =
      "https://accounts.spotify.com/authorize?" + params.toString();

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
    const client_id = "3cb7538518ab456b9caf81d7a965a2c6";
    const client_secret = "5567c114cf644cb4a0dee55b8faf5a38";
    const redirect_uri = "https://jam-portfolio-6bb344866d62.herokuapp.com/profile";

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('redirect_uri', redirect_uri);

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
      },
      body: body.toString()
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Access token:', data.access_token);
      console.log('Refresh token:', data.refresh_token);

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  refreshAccessToken() {
    console.error("Handling refresh access token...");
    const refreshToken = localStorage.getItem("refresh_token");
    const access_token_expiry = localStorage.getItem("access_token_expiry");
    const current_time = Math.floor(Date.now() / 1000);

    if (access_token_expiry && parseInt(access_token_expiry) < current_time) {
      console.log("Access token has expired. Need to refresh.");
      return fetchAccessToken(code);
    }

    const client_id = "3cb7538518ab456b9caf81d7a965a2c6";
    const client_secret = "5567c114cf644cb4a0dee55b8faf5a38";

    if (!refreshToken) {
      console.error("Refresh token not found in local storage.");
      return Promise.reject(new Error("Refresh token not found"));
    }

    return fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      return response.json();
    })
    .then(data => {
      console.log('Access token refreshed:', data.access_token);
      localStorage.setItem("access_token", data.access_token);
      const new_expiry = current_time + data.expires_in;
      localStorage.setItem("access_token_expiry", new_expiry);
      return data.access_token; // Return the new access token
    })
    .catch(error => {
      console.error('There was a problem with the token refresh operation:', error);
      throw error;
    });
  }


  linkToSpotify(e) {
    e.preventDefault();
    console.log("This is linkToSpotify");
    this.#requestAuthorization();
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

  handleUnauthorizedError(error) {
    console.log("Handling unauthorized error...");
    if (error.status === 401 || error.status === 403) {
        console.log("Access token expired, invalid, or request forbidden, refreshing...");

        this.refreshAccessToken();
    }

    return error;
  }

  getTopArtists() {
    console.log("This is getTopArtists Stimulus");

    let access_token = localStorage.getItem("access_token");
    console.log("Access Token:", access_token);

    fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return this.refreshAccessToken().then((newAccessToken) => {
            access_token = newAccessToken;
            console.log(newAccessToken);
            return fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + newAccessToken,
              },
            });
          });
        } else {
          throw new Error("Error fetching top artists: " + response.statusText);
        }
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
      this.handleUnauthorizedError(error);
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
          if (response.status === 401 || response.status === 403) {
            return this.refreshAccessToken().then((newAccessToken) => {
              access_token = newAccessToken;
              console.log(newAccessToken)
              return fetch("https://api.spotify.com/v1/me/top/artists?limit=5", {
                headers: {
                  Authorization: "Bearer " + access_token,
                },
              });
            });
          } else {
            throw new Error("Error fetching top genres: " + response.statusText);
          }
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

            let topGenresContainer = document.querySelector(".top-genres-container");
            topGenresContainer.innerHTML = "";

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
        this.handleUnauthorizedError(error);
      });
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
        if (response.status === 401 || response.status === 403) {
          return this.refreshAccessToken().then((newAccessToken) => {
            access_token = newAccessToken;
            console.log(newAccessToken);
            return fetch("https://api.spotify.com/v1/me/top/tracks?limit=5", {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + newAccessToken,
              },
            });
          });
        } else {
          throw new Error("Error fetching top tracks: " + response.statusText);
        }
      }
      return response.json();
    })
    .then((data) => {
      console.log("Received top tracks data:", data);

      const topTracks = document.querySelector(".top-tracks-container");
      topTracks.innerHTML = "";

      data.items.forEach((track) => {
        const trackLink = document.createElement("a");
        trackLink.href = track.external_urls.spotify;
        trackLink.target = "_blank";
        trackLink.textContent = track.name;
        trackLink.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default link behavior
          this.playTrack(event); // Call the playTrack method passing the event
        });
        const trackContainer = document.createElement("div");
        trackContainer.appendChild(trackLink);
        topTracks.appendChild(trackContainer);
      });
    })
    .catch((error) => {
      console.error("Error fetching top tracks:", error);
      this.handleUnauthorizedError(error);
    });
  }

  async playTrack(e) {
    console.log("This is playTrack Stimulus");

    const trackId = e.currentTarget.dataset.trackId;
    console.log("TrackID: ", trackId);

    try {
        let access_token = localStorage.getItem("access_token");
        console.log("Access Token:", access_token);

        const deviceId = await this.fetchValidDeviceId(access_token);
        console.log("Device ID:", deviceId);

        await this.playMusic(trackId, access_token, deviceId);
    } catch (error) {
        console.error("Error playing track:", error);
        // Handle error
    }
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

  async fetchValidDeviceId(access_token, trackId) {
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

      if (!response.ok) {
        throw new Error("Error fetching device ID: " + response.statusText);
      }

      const data = await response.json();
      console.log("Spotify devices:", data);

      const smartPhoneDevice = data.devices.find(
        (device) => device.type === "Smartphone"
      );

      if (smartPhoneDevice) {
        const smartPhoneId = smartPhoneDevice.id;
        console.log("Smartphone ID:", smartPhoneId);
        localStorage.setItem("device", smartPhoneId);

        await this.playTrack(trackId, smartPhoneId, access_token);

        return smartPhoneId;
      } else {
        console.log("No valid smartphone device found.");
        throw new Error("No valid smartphone device found.");
      }
    } catch (error) {
      console.error("Error fetching device ID:", error);
      throw error;
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
