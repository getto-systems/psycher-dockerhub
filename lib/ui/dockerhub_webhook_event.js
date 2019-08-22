exports.parse = (body) => parse(body);

/**
 * body : event body
 *
 * returns event_info
 */
const parse = (body) => {
  if (!body || !body.push_data || !body.repository) {
    return null;
  };

  const event_info = {
    type: "pushed",
    name: body.repository.repo_name,
    tag: body.push_data.tag,
  };

  return event_info;
};
