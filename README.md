# Tidal JS API Wrapper
This is a wrapper for the unofficial Tidal API. The endpoints that are included are non-inclusive, but they provide 
the common functionality to view and alter playlists, search for tracks, and to view user data.

To use this API, you will need to obtain your `access_token` and your `user_id` from Tidal. Please see below on how 
to obtain these credentials. It is also possible to have a user complete a login flow to obtain these credentials. 
If you are interested in this, please see 
[this readme on completing the authentication flow](https://github.com/gkasdorf/Tidal-API-Docs/blob/main/Authorization/Retrieve-From-Authentication-Flow.md).

## Installation
To install this package, run:
```
npm install tidal-js
```
Please note that this package uses ES6 modules.

## Retrieving Credentials
1. Visit [Tidal's Web Player](https://listen.tidal.com/) and sign in.
2. Open the developer tools and navigate to the network tab.
3. Filter the network requests by `XHR`. Refresh the page if there is no data here.
4. Filter the requests by searching for `userid`.
5. Note down the `userid` in the URL and the `access_token` in the `Authorization` request header. The token after 
   the word `Bearer` is your access token.

This access token will only last for one day. If you want to refresh this token whenever it expires, you will also 
need to obtain the `refresh_token`.

1. Sign out of the Tidal Web Player.
2. Open the developer tools and navigate to the network tab. Ensure that you are recording traffic.
3. Sign in to the Tidal Web Player.
4. Upon successful login, filter the results for `/token`.
5. Check the response. You will see your `access_token` and `refresh_token` here.

If you intend to continue refreshing tokens, you should record the time that you initial sign in and each 
subsequent refresh after that. For example:

```javascript
// Perform the login. Save the current time plus 24 hours.
const expirationTime = Date.now() + (24 * 60 * 60 * 1000);

// After some time has passed before making a request
if(Date.now() <= expirationTime - 120) { // Two minute window to ensure we don't miss the refresh.
    const client = new tidal.Client({
       userId: 'your_user_id',
       accessToken: 'your_access_token',
    });
    
    const res = client.refresh('your_refresh_token');
    
    // The client will automatically update the access token. It will also be available in the response.
    console.log(res.access_token);
    console.log(res.refresh_token); // Store for the next refresh
}
```

## Basic Usage
```javascript
import * as tidal from 'tidal-js';

const client = new tidal.Client({
    accessToken: 'your_access_token',
    userId: 'your_user_id'
});

// Get user data
const userData = await client.getUserData();
```

## Documentation
### `getUserData()`
```javascript
client.getUserData();
```
#### Returns
```json
{
  id: 1111111,
  username: 'Username',
  profileName: 'Profile Name',
  firstName: 'Jack',
  lastName: 'Reacher',
  email: 'jack@reacher.com',
  emailVerified: true,
  countryCode: 'US',
  created: '2023-04-06T21:10:38.628+0000',
  newsletter: false,
  acceptedEULA: true,
  gender: null,
  dateOfBirth: null,
  facebookUid: 0,
  appleUid: 0,
  partner: 1,
  tidalId: null
}
```
---
### `getUserSubscription()`
```javascript
client.getUserSubscription();
```
#### Returns
```json
{
  startDate: '2023-04-06T21:11:43.964+0000',
  validUntil: '2023-05-06T21:11:41.973+0000',
  status: 'ACTIVE',
  subscription: { type: 'PREMIUM', offlineGracePeriod: 30 },
  highestSoundQuality: 'LOSSLESS',
  premiumAccess: true,
  canGetTrial: false,
  paymentType: 'ADYEN_CREDIT_CARD',
  paymentOverdue: false
}
```
---
### `getUserProfile()`
```javascript
client.getUserProfile();
```
#### Returns
```json
{
  userId: 1111111,
  name: 'Jack',
  color: [ '326650', '20333D', '0C0C0C' ],
  picture: null,
  numberOfFollowers: 0,
  numberOfFollows: 7,
  profileType: 'MY_PROFILE'
}
```
---
### `getUserFollowers()`
```javascript
client.getUserFollowers();
```
#### Returns
```json
{
  items: [
    {
      id: 6120065,
      name: 'Gunna',
      picture: 'c61aebc6-492b-40c9-bd17-8e45eebb9378',
      imFollowing: true,
      trn: 'trn:artist:6120065',
      followType: 'ARTIST'
    }
  ]
}
```
---
### `getUserFollowing()`
```javascript
client.getUserFollowing();
```
#### Returns 
```json
{
  items: [
    {
      id: 6120065,
      name: 'Gunna',
      picture: 'c61aebc6-492b-40c9-bd17-8e45eebb9378',
      imFollowing: true,
      trn: 'trn:artist:6120065',
      followType: 'ARTIST'
    }
  ]
}
```
---
### `getUserPlaylists()`
```javascript
client.getUserPlaylists({
   limit: 50, // max 50, default 50
   offset: 0, // default 0
   order: PlaylistOrderType.DATE, // .DATE, .NAME, .ARTIST, .ALBUM
   orderDirection: "DESC", // DESC or ASC
   folderId: "root", // The folder to get the playlists from
});
```
#### Returns
```json
{
  lastModifiedAt: '2023-04-25T06:49:55.648+0000',
  items: [
    {
      trn: 'trn:playlist:6dca6d26-6488-4e15-8581-52a829ccf6a3',
      itemType: 'PLAYLIST',
      addedAt: '2023-04-25T06:49:54.237+0000',
      lastModifiedAt: '2023-04-25T06:49:54.237+0000',
      name: 'Test Playlist',
      parent: null,
      data: [
        Object
      ]
    }
  ],
  totalNumberOfItems: 1,
  cursor: null
}
```
---
### `getUserFavorites()`
```javascript
// Select a favorite type. .TRAKCS, .ALBUMS, .ARTISTS, .PLAYLISTS, or .VIDEOS
// Options are optional

client.getUserFavorites(FavoriteType.TRACKS, {
    limit: 100,
    offset: 0,
    order: "DATE",
    orderDirection: "DESC"
});
```
---
### `getFavoritesLastUpdated()`
```javascript
client.getUserFavoritesLastUpdated();
```
#### Returns
```json
{
  updatedFavoriteArtists: '2023-04-06T21:14:12.661+0000',
  updatedFavoriteTracks: '2023-04-09T03:07:27.902+0000',
  updatedFavoritePlaylists: '2023-04-25T06:49:54.789+0000',
  updatedFavoriteAlbums: null,
  updatedPlaylists: '2023-04-25T06:49:55.404+0000',
  updatedVideoPlaylists: null,
  updatedFavoriteVideos: null
}
```
---
### `getPlaylistInfo()`
```javascript
client.getPlaylistInfo(playlistId);
```
#### Returns
```json
{
  uuid: '2b419df9-09d1-459e-9f67-903a8b21d722',
  title: 'BlahPlaylist',
  numberOfTracks: 52,
  numberOfVideos: 0,
  creator: { id: 192042275 },
  description: 'Transferred with TuneSwap',
  duration: 8738,
  lastUpdated: '2023-04-25T06:49:55.404+0000',
  created: '2023-04-24T23:27:02.266+0000',
  type: 'USER',
  publicPlaylist: false,
  url: 'http://www.tidal.com/playlist/2b419df9-09d1-459e-9f67-903a8b21d722',
  image: '5229508b-4e4b-4c1e-8280-bf18db5b02bb',
  popularity: 0,
  squareImage: '3f737c58-d293-4e10-999d-a2d22827d4c1',
  promotedArtists: [],
  lastItemAddedAt: '2023-04-25T06:49:55.404+0000'
}
```
---
### `getPlaylistTracks()`
```javascript
client.getPlaylistTracks(playlistId, {
    limit: 100, // Max 10000 (lol)
   offset: 0,
   order: PlaylistOrderType.DATE, // .DATE, .ARTIST, .ALBUM, .NAME
   orderDirection: "DESC", // DESC or ASC
});
```
#### Returns
```json
{
  limit: 100,
  offset: 0,
  totalNumberOfItems: 52,
  items: [
    {
      item: [
        Object
      ],
      type: 'track',
      cut: null
    }
  ]
}
```
---
### `getTrackInfo()`
```javascript
client.getTrackInfo(trackId);
```
#### Returns
```json
{
  id: 220183218,
  title: 'What Happened To Virgil (feat. Gunna)',
  duration: 181,
  replayGain: -8.99,
  peak: 1,
  allowStreaming: true,
  streamReady: true,
  streamStartDate: '2022-03-11T00:00:00.000+0000',
  premiumStreamingOnly: false,
  trackNumber: 9,
  volumeNumber: 1,
  version: null,
  popularity: 95,
  copyright: '(P) 2022 Alamo Records, LLC/Sony Music Entertainment',
  url: 'http://www.tidal.com/track/220183218',
  isrc: 'USQX92200954',
  editable: false,
  explicit: true,
  audioQuality: 'HI_RES',
  audioModes: [ 'STEREO' ],
  artist: {
    id: 4743579,
    name: 'Lil Durk',
    type: 'MAIN',
    picture: '0014230f-5e68-4daa-9247-79d66e273132'
  },
  artists: [
    {
      id: 4743579,
      name: 'Lil Durk',
      type: 'MAIN',
      picture: '0014230f-5e68-4daa-9247-79d66e273132'
    },
    {
      id: 6120065,
      name: 'Gunna',
      type: 'FEATURED',
      picture: 'c61aebc6-492b-40c9-bd17-8e45eebb9378'
    }
  ],
  album: {
    id: 220183209,
    title: '7220',
    cover: 'c12443c6-68dd-497d-b5c2-da32a72b031f',
    vibrantColor: '#d99491',
    videoCover: null
  },
  mixes: {
    MASTER_TRACK_MIX: '014106ed9c05d9bd44a550abd3f8bb',
    TRACK_MIX: '001380bf9e72187515f5ce0768562d'
  }
}
```
---
### `createPlaylist()`
```javascript
client.createPlaylist({
   name: "Take it to the head",
   description: "",
   folderId: "root",
   isPublic: false
});
```
#### Returns
```json
{
  trn: 'trn:playlist:faae778f-a99d-4050-bd37-355d8a0239b7',
  itemType: 'PLAYLIST',
  addedAt: '2023-04-25T07:57:07.221+0000',
  lastModifiedAt: '2023-04-25T07:57:07.221+0000',
  name: 'Test Playlist',
  parent: null,
  data: {
    uuid: 'faae778f-a99d-4050-bd37-355d8a0239b7',
    type: 'USER',
    creator: { id: 192042275, name: null, picture: null, type: 'USER' },
    contentBehavior: 'UNRESTRICTED',
    sharingLevel: 'PRIVATE',
    title: 'Test Playlist',
    description: '',
    image: 'e59903d7-94a7-454c-8a78-6a6586967dda',
    squareImage: 'e9448a9a-3ade-4f79-93d2-12e6d8d4b2eb',
    url: 'http://www.tidal.com/playlist/faae778f-a99d-4050-bd37-355d8a0239b7',
    created: '2023-04-25T07:57:07.221+0000',
    lastUpdated: '2023-04-25T07:57:07.221+0000',
    lastItemAddedAt: null,
    duration: 0,
    numberOfTracks: 0,
    numberOfVideos: 0,
    promotedArtists: [],
    trn: 'trn:playlist:faae778f-a99d-4050-bd37-355d8a0239b7',
    itemType: 'PLAYLIST'
  }
}
```
---
### `addTracksToPlaylist()`
```javascript
const playlistId = "123-123-123"; // For the record, it is the UUID in the data of playlists
const trackIds = ["1234567", "1234568", "1234569"];

// Optional options. You should probably leave them be unless you really want to add the same song multiple times to 
// the playlist.
const options = {
    onArtifactNotFound: "FAIL",
   onDupes: "FAIL"
};


client.addTracksToPlaylist(playlistId, trackIds, options);
```
#### Returns
```json
{ lastUpdated: 1682409788836, addedItemIds: [ 220183218 ] }
```
---
### `search()`
```javascript
const queryOptions = {
    query: "HOTEL LOBBY",
    limit: 50,
    offset: 0,
    types: SearchType.TRACKS, // .TRACKS, .ALBUMS, .ARTISTS, .PLAYLISTS, .VIDEOS, .ALL
    includeContributors: false,
    includeUserPlaylists: false,
    supportsUserData: false
}
```
#### Returns
```json
{
  artists: { limit: 50, offset: 0, totalNumberOfItems: 0, items: [] },
  albums: { limit: 50, offset: 0, totalNumberOfItems: 0, items: [] },
  playlists: { limit: 50, offset: 0, totalNumberOfItems: 0, items: [] },
  tracks: {
    limit: 50,
    offset: 0,
    totalNumberOfItems: 300,
    items: [
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object]
    ]
  },
  videos: { limit: 50, offset: 0, totalNumberOfItems: 0, items: [] },
  topHit: {
    value: {
      id: 150917151,
      title: 'Tick Tock (feat. 24kGoldn)',
      duration: 178,
      replayGain: -10.08,
      peak: 0.999932,
      allowStreaming: true,
      streamReady: true,
      streamStartDate: '2020-08-21T00:00:00.000+0000',
      premiumStreamingOnly: false,
      trackNumber: 1,
      volumeNumber: 1,
      version: null,
      popularity: 40,
      copyright: 'An Atlantic Records UK release, ℗ 2020 Warner Music UK Limited',
      url: 'http://www.tidal.com/track/150917151',
      isrc: 'GBAHS2000775',
      editable: false,
      explicit: false,
      audioQuality: 'HI_RES',
      audioModes: [Array],
      artists: [Array],
      album: [Object],
      mixes: [Object]
    },
    type: 'TRACKS'
  }
}
```
## Adding your own endpoints
If there are endpoints that you know of or find that you would like to add, you may simply fork the project and add 
them to `Tidal.js` in the `src` directory. If you want, feel free to submit a PR with the changes.

I will add more endpoints as I need them, however, these were the primary ones that I required.

## Disclaimer
This is not an official API. I am not affiliated with Tidal in any way. Use at your own risk of possible account termination.