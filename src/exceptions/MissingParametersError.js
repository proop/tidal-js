class MissingParametersError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingParametersException";
    }
}

export default MissingParametersError;
