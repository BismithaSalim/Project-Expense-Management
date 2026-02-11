class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  filter() {
    // Filter out specified fields from the query parameters.
    let queryObj = { ...this.queryString };
    const excludeFields = ["searchKey", "page", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Apply the filtered query parameters to the database query.
    this.query.find(queryObj);

    // Enable method chaining by returning the current instance.
    return this;
  }
  search(searchFields) {
    let keyWords = this.queryString.searchKey
      ? {
          $and: [
            {
              $or: searchFields.map((field) => ({
                [`${field}`]: {
                  $regex: this.escapeRegExp(this.queryString.searchKey),
                  // $regex: this.queryString.searchKey,
                  $options: "i",
                },
              })),
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyWords });
    return this;
  }
  selectFields(){
    if(this.queryString.fields){
       let fields=this.queryString.fields.split(',').join(' ')
       this.query=this.query.select(fields)
    }
    return this
  }
  pagination() {
    let page = Number(this.queryString.page) || 1;
    let limit = Number(this.queryString.limit) || 0;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeature;
