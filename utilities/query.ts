import mongoose from "mongoose";

interface requestQuery{
  page?: number;
  sort?: string;
  limit?: number;
  fields?: string;
  [key: string]: any;
}
export default class Query<T extends mongoose.Document>{
  query: mongoose.Query<T[],T>
  requestQuery: requestQuery;

  constructor(queryObject: mongoose.Query<T[],T>, requestQuery:requestQuery){
    this.query = queryObject;
    this.requestQuery = requestQuery;
  }
  filter():this{
    const queryObj = { ...this.requestQuery };
    console.log(queryObj);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort():this{
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }


  limitFields() {
    if (this.requestQuery.fields) {
      const fields = this.requestQuery.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.requestQuery.page * 1 || 1;
    const limit = this.requestQuery.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}