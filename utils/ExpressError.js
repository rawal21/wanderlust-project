class ExpressError extends Error {
  constructor(StatusCode,message)
  {
    super();
    this.StatusCode = StatusCode;
    this.Massage = message;
  }
}

module.exports = ExpressError;