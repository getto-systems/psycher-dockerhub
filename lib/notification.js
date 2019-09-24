const condition_factory = require("./notification/condition");
const job_factory = require("./notification/job");

exports.init = (struct) => init(struct);

/**
 * struct : {
 *   event_info: {
 *     name: repository name ('user/repo')
 *     tag: build image tag
 *   }
 *   repository: {
 *     deployment
 *     pipeline
 *   }
 * }
 *
 * returns {
 *   condition : check notification condition
 *   trigger_push_latest_job : () => trigger push_latest job
 * }
 */
const init = ({event_info: {name, tag}, repository}) => {
  const job_signature = {
    name,
    tag,
  };

  const tag_matches_some = (tags) => tags.includes(tag);

  const job = job_factory.init({
    job_signature,
    repository,
  });

  const has_push_latest_target = () => job.has_push_latest_target();
  const trigger_push_latest_job = () => job.trigger_push_latest_job();

  const condition = condition_factory.init({
    tag_matches_some,
    has_push_latest_target,
  });

  return {
    condition,
    trigger_push_latest_job,
  };
};
