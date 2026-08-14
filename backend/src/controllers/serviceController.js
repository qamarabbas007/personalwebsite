const Service = require("../models/Service");
const createCrudController = require("./crudFactory");

module.exports = createCrudController(Service, {
  searchFields: ["title", "description"],
  filterFields: ["active"],
});
