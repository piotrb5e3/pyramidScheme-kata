module.exports = function insufficientPermissions(errorDesc) {
  const res = this.res;
  if (!errorDesc) {
    return res.sendStatus(403);
  }
  res.status(403);
  return res.send(errorDesc);
};
