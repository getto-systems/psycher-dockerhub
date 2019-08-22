const destination_factory = require("../lib/destination");

const secret_store_factory = require("./infra/secret_store");

test("find destination channel", async () => {
  const destination = destination_factory.init({
    secret_store: secret_store_factory.init({
      destination_channel: "CHANNEL",
    }),
  });

  const channel = await destination.channel({
    name: "repo/name",
  });

  expect(channel).toBe("CHANNEL");
});
