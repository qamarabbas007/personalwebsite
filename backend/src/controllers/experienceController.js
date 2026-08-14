const Experience = require("../models/Experience");
const createCrudController = require("./crudFactory");

module.exports = createCrudController(Experience, {
  searchFields: ["title", "organization"],
  filterFields: ["type"],
});
