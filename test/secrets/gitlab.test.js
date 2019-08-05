const gitlab_secret = require("../../lib/secrets/gitlab");

test("find token", () => {
  const raw_secret = {
    trigger_tokens: {
      "repo/name": { project_id: "PROJECT_ID", token: "TOKEN" },
    },
  };
  const secret = gitlab_secret.prepare(raw_secret).init({
    repository: "repo/name",
    tag: "TAG",
  });

  expect(secret.tag).toBe("TAG");
  expect(secret.project_id).toBe("PROJECT_ID");
  expect(secret.trigger_token).toBe("TOKEN");
});

test("invalid project_id", () => {
  const raw_secret = {
    trigger_tokens: {
      "repo/name": { project: "PROJECT_ID", token: "TOKEN" },
    },
  };
  const secret = gitlab_secret.prepare(raw_secret).init({
    repository: "repo/name",
    tag: "TAG",
  });

  expect(secret).toBe(null);
});

test("invalid token", () => {
  const raw_secret = {
    trigger_tokens: {
      "repo/name": { project_id: "PROJECT_ID", trigger_token: "TOKEN" },
    },
  };
  const secret = gitlab_secret.prepare(raw_secret).init({
    repository: "repo/name",
    tag: "TAG",
  });

  expect(secret).toBe(null);
});

test("invalid repository", () => {
  const raw_secret = {
    trigger_tokens: {
      "repo/name": { project_id: "PROJECT_ID", trigger_token: "TOKEN" },
    },
  };

  try {
    gitlab_secret.prepare(raw_secret).init({
      repository: null,
      tag: "latest",
    });
  } catch (e) {
    expect(e).toBe("invalid struct");
  }
});

test("invalid tag", () => {
  const raw_secret = {
    trigger_tokens: {
      "repo/name": { project_id: "PROJECT_ID", trigger_token: "TOKEN" },
    },
  };

  try {
    gitlab_secret.prepare(raw_secret).init({
      repository: "repo/name",
      tag: null,
    });
  } catch (e) {
    expect(e).toBe("invalid struct");
  }
});
