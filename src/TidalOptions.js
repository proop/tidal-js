class TidalOptions {
    accessToken;
    userId;

    clientId;
    refreshToken;
    countryCode = "US";
    locale = "en_US";

    constructor(options) {
        Object.assign(this, options);
    }
}

export default TidalOptions;
