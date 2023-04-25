class OptionsError extends Error {
    constructor(props) {
        super(props);
        this.name = "OptionsException";
    }
}

export default OptionsError;
