/**
 * The possible search types when getting search results.
 * @type {{PLAYLISTS: string, TRACKS: string, ALL: string, ARTISTS: string, ALBUMS: string, VIDEOS: string}}
 */
const SearchType = {
    TRACKS: "TRACKS",
    ALBUMS: "ALBUMS",
    ARTISTS: "ARTISTS",
    PLAYLISTS: "PLAYLISTS",
    VIDEOS: "VIDEOS",
    ALL: "TRACKS,ALBUMS,ARTISTS,PLAYLISTS,VIDEOS"
};

export default SearchType;
