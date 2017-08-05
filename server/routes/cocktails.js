export function findAll(req, res) {
  res.send([{name: 'wine1'}, {name: 'wine2'}]);
}

export function findById(req, res) {
  res.send({id: req.params.id, name: "The Name", description: "description"});
}
