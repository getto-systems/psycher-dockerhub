exports.init = (data) => init(data);

/**
 * returns infra/job_store + data
 */
const init = ({push_latest_error}) => {
  let data = {
    push_latest: [],
  };

  const push_latest = async (struct) => {
    if (push_latest_error) {
      throw push_latest_error;
    }
    data.push_latest.push(struct);
  };

  return {
    push_latest,
    data,
  };
};
