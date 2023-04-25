import {expect} from "chai";
import * as dotenv from "dotenv";
dotenv.config();


import Client from "./src/Tidal.js";
import {AccessTokenError, OptionsError, FavoriteType} from "./index.js";

describe("throws errors", () => {
    it("throws AccessTokenError", () => {
        try {
            const tidal = new Client({
                "userId": "x"
            });
        } catch(e) {
            expect(e).to.eql(new AccessTokenError("No access token provided."));
        }
    });

    it("throws OptionsError", () => {
        try {
            const tidal = new Client({
                "accessToken": "x"
            });
        } catch(e) {
            expect(e).to.eql(new OptionsError("No User ID supplied."));
        }
    });
});

describe("makes successful api calls", () => {
    beforeEach(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("waiting...");
    });

    const tidal = new Client({
        accessToken: process.env.TIDAL_ACCESS_TOKEN,
        userId: process.env.TIDAL_USER_ID
    });

    it("retrieves user data", async () => {
        const res = await tidal.getUserData();

        expect(res).to.include.any.keys("username");
    });

    it("retrieves user subscription", async () => {
        const res = await tidal.getUserSubscription();

        expect(res).to.include.any.keys("subscription");
    });

    it("retrieves user profile", async () => {
        const res = await tidal.getUserProfile();

        expect(res).to.include.any.keys("name");
    });

    it("retrieves user followers", async () => {
        const res = await tidal.getUserFollowers();
        console.log(res);

        expect(res).to.include.any.keys("items");
    });

    it("retrieves user following", async () => {
        const res = await tidal.getUserFollowing();

        expect(res).to.include.any.keys("items");
    });

    it("retrieves user playlists", async () => {
        const res = await tidal.getUserPlaylists();

        expect(res).to.include.any.keys("items");
    });

    it("retrieves user favorite tracks", async () => {
        const res = await tidal.getUserFavorites(FavoriteType.TRACKS);

        expect(res).to.include.any.keys("items");
    });

    it("retrieves user favorite playlists", async () => {
        const res = await tidal.getUserFavorites(FavoriteType.PLAYLISTS);

        expect(res).to.include.any.keys("items");
    });

    it("retrieves user favorites last updated", async () => {
        const res = await tidal.getUserFavoritesLastUpdated();

        expect(res).to.include.any.keys("updatedFavoriteTracks");
    });

    it("retrieves playlist info", async () => {
        const playlistId = process.env.TIDAL_PLAYLIST_ID;

        const res = await tidal.getPlaylistInfo(playlistId);

        expect(res).to.include.any.keys("uuid", "title", "numberOfTracks");
    });

    it("retrieves playlist tracks", async () => {
        const playlistId = process.env.TIDAL_PLAYLIST_ID;

        const res = await tidal.getPlaylistTracks(playlistId);

        expect(res).to.include.any.keys("items");
    });

    it("retrieves track info", async() => {
        const trackId = process.env.TIDAL_TRACK_ID;

        const res = await tidal.getTrackInfo(trackId);

        expect(res).to.include.any.keys("id", "title", "duration");
    });

    it("creates a playlist", async () => {
        const res = await tidal.createPlaylist({
            name: "Test Playlist"
        });

        expect(res).to.include.any.keys("trn", "data");
    });

    it("adds items to a playlist", async () => {
        const playlistId = process.env.TIDAL_PLAYLIST_ID;
        const trackId = process.env.TIDAL_TRACK_ID;

        const res = await tidal.addTracksToPlaylist(playlistId, [trackId], {
            onDupes: "ADD"
        });

        expect(res).to.include.any.keys("lastUpdated", "addedItemIds");
    });

    it("searches for tracks", async () => {
        const res = await tidal.search({
            query: "Tick Tock",
        });

        expect(res).to.include.any.keys("tracks");
    });
});