class AccessTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = "AccessTokenError";
    }
}

export default AccessTokenError;
