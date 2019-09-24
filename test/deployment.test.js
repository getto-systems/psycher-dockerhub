const deployment_factory = require("../lib/deployment");

const secret_store_factory = require("./infra/secret_store");

test("check target exists", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      job_target_exists: true,
    }),
  });

  const result = await deployment.target_exists({
    name: "repo/name",
  });

  expect(result).toBe(true);
});

test("find channel", async () => {
  const deployment = deployment_factory.init({
    secret_store: secret_store_factory.init({
      destination_channel: "CHANNEL",
    }),
  });

  const channel = await deployment.channel({
    name: "repo/name",
  });

  expect(channel).toBe("CHANNEL");
});
