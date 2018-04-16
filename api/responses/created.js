module.exports = function created(data) {
  const res = this.res;
  if (!data) {
    return res.sendStatus(201);
  }
  res.status(201);
  return res.send(data);
};
