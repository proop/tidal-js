class TooManyTracksError extends Error {
    constructor(message) {
        super(message);
        this.name = "TooManyTracksException";
    }
}

export default TooManyTracksError;
