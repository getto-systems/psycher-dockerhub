exports.init = () => init();

const init = () => {
  return {
    pushed: {
      push_latest: {
        ignore_tags: [
          "latest",
        ],
      },
    },
  };
};
