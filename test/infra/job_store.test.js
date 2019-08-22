const job_store = require("../../lib/infra/job_store");

test("trigger", async () => {
  const {store, gitlab_api} = init_job_store();

  await store.push_latest({
    job_token: {
      project_id: "PROJECT-ID",
      token: "TOKEN",
    },
    job_signature: {
      name: "repo/name",
      tag: "0.0.0",
    },
    reply_to: {
      channel: "CHANNEL",
    },
  });

  expect(gitlab_api.data).toEqual({
    trigger: [
      {
        project_id: "PROJECT-ID",
        token: "TOKEN",
        ref: "master",
        variables: {
          PUSH_LATEST: "true",
          tag: "0.0.0",
          channel: "CHANNEL",
        },
      },
    ],
  });
});

const init_job_store = () => {
  const gitlab_api = init_gitlab_api();

  const store = job_store.init({
    gitlab_api,
  });

  return {
    store,
    gitlab_api,
  };
};

const init_gitlab_api = () => {
  let data = {
    trigger: [],
  };

  const trigger = async (struct) => {
    data.trigger.push(struct);
    return {
      status: 200,
    };
  };

  return {
    trigger,
    data,
  };
};
