exports.init = () => init();

const init = () => {
  let data = {
    reply: [],
    notify: [],
  };

  const reply = async (info, secret, text) => {
    data.reply.push(info);
    return null;
  };

  const notify = async (info, secret) => {
    data.notify.push(info);
    return null;
  };

  return {
    reply,
    notify,
    data,
  };
};
