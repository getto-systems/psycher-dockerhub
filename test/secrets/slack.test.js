const slack_secret = require("../../lib/secrets/slack");

test("properties", () => {
  const raw_secret = {
    bot_token: "SLACK_BOT_TOKEN",
    repository_channels: {
      "repo/name": "CHANNEL",
    },
  };
  const secret = slack_secret.prepare(raw_secret).init({
    repository: "repo/name",
    tag: "latest",
  });

  expect(secret.channel).toBe("CHANNEL");
  expect(secret.image).toBe("repo/name:latest");
  expect(secret.bot_token).toBe("SLACK_BOT_TOKEN");
});
