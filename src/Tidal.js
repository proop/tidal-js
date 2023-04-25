/* global module */
'use strict';
import axios from "axios";
import {
    AccessTokenError,
    MissingParametersError, OptionsError,
    PlaylistOrderType,
    SearchType,
    TidalRequestError,
    TooManyTracksError
} from "../index.js";
import TidalOptions from "./TidalOptions.js";


class Tidal {
    _baseUriv1 = "https://api.tidal.com/v1";
    _baseUriv2 = "https://api.tidal.com/v2";

    _clientId = "CzET4vdadNUFQ5JU";

    _headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    };

    /** @var {TidalOptions} */
    _options = null;

    _reqOptions = null;

    /**
     * Create the Tidal instance
     * @param options {{
     *     accessToken: string,
     *     userId: string,
     *
     *     refreshToken: ?string,
     *     clientId: ?string,
     *     countryCode: ?string,
     *     locale: ?string
     * }}
     */
    constructor(options) {
        this._options = new TidalOptions(options);

        if(!this._options.accessToken) throw new AccessTokenError("No access token provided.");
        if(!this._options.userId) throw new OptionsError("No User ID supplied.");

        this._headers["Authorization"] = `Bearer ${options.accessToken}`;

        this._reqOptions = {
            headers: this._headers
        };
    }

    _encodeUrl(url, params) {
        let qs = "?";

        for(let key in params) {
            if(params.hasOwnProperty(key)) {
                const value = params[key];
                qs += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

                if(key + 1 !== params.length) {
                    qs += "&"
                }
            }
        }

        return `${url}${qs}`;
    }

    _buildUrl(base, path) {
        return `${base}${path}`;
    }

    async _get(url, data = null) {
        if(data) {
            url = this._encodeUrl(url, data);
        }

        let res;

        try {
            const res = await axios.get(url, this._reqOptions);

            return res.data;
        } catch(e) {
            throw new TidalRequestError(res.data.userMessage, res.status, res.data.subStatus);
        }
    }

    async _put(url, data) {
        let res;

        try {
            const res = await axios.put(url, data, this._reqOptions);

            return res.data;
        } catch(e) {
            throw new TidalRequestError(res.data.userMessage, res.status, res.data.subStatus);
        }
    }

    async _post(url, data) {
        let res;

        try {
            res = await axios.post(url, data, this._reqOptions);

            return res.data;
        } catch(e) {
            throw new TidalRequestError(res.data.userMessage, res.status, res.data.subStatus);
        }
    }

    /**
     * Add data that Tidal requires for some requests.
     * @param data {Object}
     * @return {Object}
     * @private
     */
    _addData(data = {}) {
        data["countryCode"] = "US";
        data["locale"] = "en_us";

        return data;
    }

    /**
     * Performs OAuth token refresh
     * @param refreshToken
     * @return {Promise<any>}
     */
    async refresh(refreshToken) {
        const data = {
            client_id: "CzET4vdadNUFQ5JU",
            refresh_token: refreshToken,
            grant_type: "refresh_token",
            scope: "r_usr w_usr"
        };

        const url = this._buildUrl("https://auth.tidal.com/v1/oauth2/token", "");

        const res = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        this._options.accessToken = res.data.access_token;
        this._options.refreshToken = res.data.refresh_token;
        this._reqOptions.headers["Authorization"] = `Bearer ${res.data.access_token}`;

        return res.data;
    }

    /**
     * Return user data for the current Tidal user.
     * @return {Promise<Object>}
     */
    async getUserData() {
        const data = this._addData();
        const url = this._buildUrl(this._baseUriv1, `/users/${this._options.userId}`);

        return this._get(url, data);
    }

    /**
     * Return subscription information for the current Tidal user.
     * @return {Promise<Object>}
     */
    async getUserSubscription() {
        const data = this._addData();
        const url = this._buildUrl(this._baseUriv1, `/users/${this._options.userId}/subscription`);

        return this._get(url, data);
    }

    /**
     * Get the user's profile
     * @return {Promise<Object>}
     */
    async getUserProfile() {
        const data = this._addData();
        const url = this._buildUrl(this._baseUriv2, `/profiles/${this._options.userId}`);

        return this._get(url, data);
    }

    /**
     * Get the user's followers
     * @return {Promise<Object>}
     */
    async getUserFollowers() {
        const data = this._addData();
        const url = this._buildUrl(this._baseUriv2, `/profiles/${this._options.userId}/followers`);

        return this._get(url, data);
    }

    /**
     * Get the user's following
     * @return {Promise<Object>}
     */
    async getUserFollowing() {
        const data = this._addData();
        const url = this._buildUrl(this._baseUriv2, `/profiles/${this._options.userId}/following`);

        return this._get(url, data);
    }

    /**
     * Get the user's playlists
     * @param options {Object?} - Options for the request
     * @param options.limit {number?} - The number of playlists to return (max 50, default 50)
     * @param options.offset {number?} - The offset to start at
     * @param options.order {PlaylistOrderType?} - The order to return the playlists in (DATE, NAME, ARTIST, DATE ADDED)
     * @param options.orderDirection {string?} - The direction to return the playlists in (ASC, DESC)
     * @param options.folderId {string?} - The folder to return playlists from (default root)
     * @return {Promise<Object>}
     */
    async getUserPlaylists(options) {
        options = {
            limit: 50,
            offset: 0,
            order: "DATE",
            orderDirection: "DESC",
            folderId: "root",
            ...options
        };

        const data = this._addData(options);
        const url = this._buildUrl(this._baseUriv2, "/my-collection/playlists/folders");

        return this._get(url, data);
    }

    /**
     * Get the user's favorites.
     * @param type {FavoriteType} - The type of favorites to return
     * @param options {Object?} - Options for the request
     * @param options.limit {number?} - The number of favorites to return (max 10000, default 100)
     * @param options.offset {number?} - The offset to start at
     * @param options.order {string?} - The order to return the favorites in (DATE, NAME, ARTIST, DATE ADDED)
     * @param options.orderDirection {string?} - The direction to return the favorites in (ASC, DESC)
     * @return {Promise<Object>}
     */
    async getUserFavorites(type, options) {
        if(!type) {
            throw new MissingParametersError("No favorite type provided");
        }

        options = {
            limit: 100,
            offset: 0,
            order: "DATE",
            orderDirection: "DESC",
            ...options
        };

        const data = this._addData();
        const url = this._buildUrl(this._baseUriv1, `/users/${this._options.userId}/favorites/${type}`);

        return this._get(url, data);
    }

    /**
     * Get info about the last updates for the user's favorites.
     * @return {Promise<Object>}
     */
    async getUserFavoritesLastUpdated() {
        const data = this._addData();
        const url = this._buildUrl(this._baseUriv1, `/users/${this._options.userId}/favorites`);

        return this._get(url, data);
    }

    /**
     * Get a playlist's info
     * @param playlistId
     * @return {Promise<any|undefined>}
     */
    async getPlaylistInfo(playlistId) {
        if(!playlistId) {
            throw new MissingParametersError("You must provide a playlistId");
        }

        const data = this._addData();
        const url = this._buildUrl(this._baseUriv1, `/playlists/${playlistId}`);

        return this._get(url, data);
    }

    /**
     * Get a playlist's tracks.
     * @param playlistId {String}
     * @param options {Object?} - Options for the request
     * @param options.limit {number?} - The number of tracks to return (max 10000, default 100)
     * @param options.offset {number?} - The offset to start at
     * @param options.order {PlaylistOrderType?} - The order to return the tracks in (DATE, NAME, ARTIST, ALBUM - default DATE)
     * @param options.orderDirection {string?} - The direction to return the tracks in (ASC, DESC)
     * @return {Promise<Object>}
     */
    async getPlaylistTracks(playlistId, options) {
        if(!playlistId) {
            throw new MissingParametersError("You must provide a playlistId");
        }

        options = {
            limit: 100,
            offset: 0,
            order: PlaylistOrderType.DATE,
            orderDirection: "DESC",
        }

        const data = this._addData(options);
        const url = this._buildUrl(this._baseUriv1, `/playlists/${playlistId}/items`);

        return this._get(url, data);
    }

    /**
     *
     * @param trackId
     * @return {Promise<Object>}
     */
    async getTrackInfo(trackId) {
        if(!trackId) {
            throw new MissingParametersError("You must provide a trackId");
        }

        const data = this._addData();
        const url = this._buildUrl(this._baseUriv1, `/tracks/${trackId}`);

        return this._get(url, data);
    }

    /**
     * Create a new playlist with the given options.
     * @param playlistOptions {Object}
     * @param playlistOptions.name {string} - The title of the playlist
     * @param playlistOptions.description {string?} - The description of the playlist (default empty)
     * @param playlistOptions.folderId {string?} - The folder to create the playlist in (default root)
     * @param playlistOptions.isPublic {boolean?} - Whether the playlist is public or not (default false)
     * @return {Promise<void>}
     */
    async createPlaylist(playlistOptions) {
        playlistOptions = {
            description: "",
            folderId: "root",
            isPublic: false,
            ...playlistOptions
        };

        if(!playlistOptions.name) {
            throw new MissingParametersError("You must provide a name for the playlist.");
        }

        const data = this._addData(playlistOptions);
        const url = this._buildUrl(this._baseUriv2, "/my-collection/playlists/folders/create-playlist");

        return this._put(url, data);
    }

    /**
     * Add tracks to a playlist.
     * @param playlistId {String} - The id of the playlist to add tracks to
     * @param trackIds {String[]} - The ids of the tracks to add
     * @param options {Object?} - Options for the request
     * @param options.onArtifactNotFound {string?} - What to do if a track is not found (FAIL, KEEP, REPLACE) - default fail
     * @param options.onDupes {string?} - What to do if a track is already in the playlist (FAIL, ADD) - default fail
     * @return {Promise<void>}
     */
    async addTracksToPlaylist(playlistId, trackIds, options) {
        if(!playlistId || !trackIds) {
            throw new MissingParametersError("You must provide a playlistId and trackIds");
        }

        if(trackIds.length > 50) {
            throw new TooManyTracksError("You can only add 50 tracks at a time.");
        }

        options = {
            onArtifactNotFound: "FAIL",
            onDupes: "FAIL",
            ...options
        };

        this._reqOptions.headers["If-None-Match"] = "*";

        const data = this._addData({
            trackIds: trackIds.join(","),
            ...options
        });
        const url = this._buildUrl(this._baseUriv1, `/playlists/${playlistId}/items`);

        const res = this._post(url, data);

        this._reqOptions.headers["If-None-Match"] = undefined;

        return res;
    }

    /**
     * Search for tracks, albums, artists, playlists, and videos.
     * @param queryOptions {Object}
     * @param queryOptions.query {string} - The query to search for
     * @param queryOptions.limit {number?} - The number of results to return (max 50, default 50)
     * @param queryOptions.offset {number?} - The offset to start at
     * @param queryOptions.types {SearchType[]?} - The types of results to return (default TRACKS)
     * @param queryOptions.includeContributors {boolean?} - Whether to include contributors in the results (default false)
     * @param queryOptions.includeUserPlaylists {boolean?} - Whether to include user playlists in the results (default false)
     * @param queryOptions.supportsUserData {boolean?} - Whether to include user data in the results (default false)
     * @return {Promise<any|undefined>}
     */
    async search(queryOptions) {
        if(!queryOptions) {
            throw new MissingParametersError("You must provide query options");
        }

        queryOptions = {
            limit: 50,
            types: SearchType.TRACKS,
            includeContributors: false,
            includeUserPlaylists: false,
            supportsUserData: false,
            ...queryOptions
        };

        const data = this._addData(queryOptions);
        const url = this._buildUrl(this._baseUriv1, "/search");

        return this._get(url, data);
    }
}

export default Tidal;
