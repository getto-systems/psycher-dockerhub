const secret_store = require("../../lib/infra/secret_store");

test("job_target_exists", async () => {
  const {store, aws_secrets} = init_secret_store({
    "gitlab-trigger-tokens": JSON.stringify({
      "repo/name": {project_id: "PROJECT-ID", token: "TOKEN"},
    }),
  });

  const result = await store.job_target_exists({name: "repo/name"});
  expect(result).toBe(true);

  const unknown = await store.job_target_exists({name: "unknown/name"});
  expect(unknown).toBe(false);
});

test("job_token", async () => {
  const {store, aws_secrets} = init_secret_store({
    "gitlab-trigger-tokens": JSON.stringify({
      "repo/name": {project_id: "PROJECT-ID", token: "TOKEN"},
      "repo/no_project_id": {project: "INVALID", token: "TOKEN"},
      "repo/no_token": {project_id: "INVALID", trigger_token: "TOKEN"},
    }),
  });

  const token = await store.job_token({name: "repo/name"});
  expect(token).toEqual({project_id: "PROJECT-ID", token: "TOKEN"});

  const no_project_id_token = await store.job_token({name: "repo/no_project_id"});
  expect(no_project_id_token).toBe(null);

  const no_token_token = await store.job_token({name: "repo/no_token"});
  expect(no_token_token).toBe(null);

  const unknown_target = await store.job_token({name: "repo/unknown"});
  expect(unknown_target).toBe(null);
});

test("destination_channel", async () => {
  const {store, aws_secrets} = init_secret_store({
    "dockerhub-repository-channels": JSON.stringify({
      "repo/name": "CHANNEL",
    }),
  });

  const channel = await store.destination_channel({name: "repo/name"});
  expect(channel).toBe("CHANNEL");

  const unknown = await store.destination_channel({name: "repo/unknown"});
  expect(unknown).toBe(null);
});

const init_secret_store = (struct) => {
  const aws_secrets = init_aws_secrets(struct);

  const store = secret_store.init({
    aws_secrets,
  });

  return {
    store,
    aws_secrets,
  };
};

const init_aws_secrets = (struct) => {
  const getJSON = async () => {
    return struct;
  };

  return {
    getJSON,
  };
};
