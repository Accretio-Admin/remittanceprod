/* eslint-disable no-param-reassign */
const moment = require('moment');
const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options) {
    let sort = "";
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    let limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 0;
    let skip = (page - 1) * limit;
    // filtering
    let customFilter = {};
    options.filter = options.filter?.split(',')
    options.filter?.forEach((e) => {
      if (e.indexOf("role|string") >= 0) {
        customFilter[e.replace("|string", "").split("=")[0]] = 
          e.replace("|string", "").split("=")[1]
      }
      if (e.indexOf("|stg") >= 0) {
        customFilter[e.replace("|stg", "").split("=")[0]] = 
          {$regex :
            e.replace("|string", "").split("=")[1],
            $options : "i"
          }
      }
      if (e.indexOf("|boolean") >= 0) {
        customFilter[e.replace("|boolean", "").split("=")[0]] =
        e.replace("|boolean", "").split("=")[1] == "true";
      }
      if (e.indexOf("|date") >= 0) {
        let key = e.replace("|date", "").split("=")[0]
        let value = e.replace("|date", "").split("=")[1].split('-');
        customFilter[key] =
        // = e.replace("|boolean", "").split("=")[1] == "true";
        {$gte: moment(value[0]).startOf('day'),$lt: moment(value[1]).endOf('day')}
      }
    });
    filter = {...filter, ...customFilter};
    filter.deleted = false;
    if(page == 0){
      skip = 0;
      limit = 0;
    }
    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    if (options.populate) {
      options.populate.split(",").forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          {
            path: populateOption.split(".").reverse().reduce((a, b) => ({ path: b, populate: a })),
            select: 'email',
            match: {email: /ch/} ,
            options: {
              retainNullValues: false 
            }
          }
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;

      let countTotalPages = (totalResults / limit);
      const totalPages = Math.ceil(isFinite(countTotalPages)? countTotalPages: 1);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
