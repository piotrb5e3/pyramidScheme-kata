module.exports = function unauthorized(errorDesc) {
  const res = this.res;
  if (!errorDesc) {
    return res.sendStatus(401);
  }
  res.status(401);
  return res.send(errorDesc);
};
