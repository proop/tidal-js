class TidalRequestError extends Error {
    constructor(message, status, subStatus) {
        super(message);
        this.name = "TidalRequestException";
        this.status = status;
        this.subStatus = subStatus;
    }
}

export default TidalRequestError;
