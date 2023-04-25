import Client from "./src/Tidal.js";
import ClientOptions from "./src/TidalOptions.js";
import FavoriteType from "./src/types/FavoriteType.js";
import PlaylistOrderType from "./src/types/PlaylistOrderType.js";
import SearchType from "./src/types/SearchType.js";
import AccessTokenError from "./src/exceptions/AccessTokenError.js";
import Error from "./src/exceptions/Error.js";
import MissingParametersError from "./src/exceptions/MissingParametersError.js";
import OptionsError from "./src/exceptions/OptionsError.js";
import TidalRequestError from "./src/exceptions/TidalRequestError.js";
import TooManyTracksError from "./src/exceptions/TooManyTracksError.js";

export {
    Client,
    ClientOptions,
    FavoriteType,
    PlaylistOrderType,
    SearchType,
    AccessTokenError,
    Error,
    MissingParametersError,
    OptionsError,
    TidalRequestError,
    TooManyTracksError
}
