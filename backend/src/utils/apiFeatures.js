// Small helper for search / filter / pagination on list endpoints
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search, "i");
      this.query = this.query.find({ $or: fields.map((f) => ({ [f]: regex })) });
    }
    return this;
  }

  filter(allowedFields = []) {
    const filters = {};
    allowedFields.forEach((field) => {
      if (this.queryString[field]) filters[field] = this.queryString[field];
    });
    this.query = this.query.find(filters);
    return this;
  }

  sort(defaultSort = "-createdAt") {
    this.query = this.query.sort(this.queryString.sort || defaultSort);
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;
