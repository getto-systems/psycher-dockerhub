const i18n_factory = require("../lib/i18n");
const handler_factory = require("../lib/handler");

test("check i18n struct", async () => {
  i18n_factory.languages().forEach((lang) => {
    const i18n = i18n_factory.init(lang);

    const handler_tests = {
      pushed: (target) => {
        expect(target.push_latest.ignore_tags).toBeTruthy();
      },
    };

    handler_factory.action_names().forEach((name) => {
      handler_tests[name](i18n[name]);
    });
  });
});

test("unknown language", async () => {
  expect(() => {
    i18n_factory.init("unknown");
  }).toThrow("unknown language: unknown");
});
