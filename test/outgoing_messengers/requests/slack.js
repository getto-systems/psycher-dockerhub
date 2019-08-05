exports.init = () => init();

const init = () => {
  let data = {
    reply: [],
  };

  const reply = async (info, secret, text) => {
    data.reply.push(info);
    return null;
  };

  return {
    reply,
    data,
  };
};
