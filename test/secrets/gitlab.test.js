const gitlab_secret = require("../../lib/secrets/gitlab");

test("find token", () => {
  const raw_secret = {
    trigger_tokens: {
      "repo/name": { project_id: "PROJECT_ID", token: "TOKEN" },
    },
  };
  const secret = gitlab_secret.prepare(raw_secret).init({
    repository: "repo/name",
  });

  expect(secret.project_id).toBe("PROJECT_ID");
  expect(secret.trigger_token).toBe("TOKEN");
});
