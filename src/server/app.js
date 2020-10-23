const createHookReceiver = require("npm-hook-receiver");

module.exports = ({ producer, config }) => {
  const server = createHookReceiver({
    secret: config.secret,
    mount: config.mount,
  });

  server.on(
    "package:publish",
    async ({ name: package, version, time: timestamp }) => {
      console.log("Received webhook event", {
        package,
        version,
        timestamp,
      });

      try {
        await producer.send({
          topic: config.topic,
          messages: [
            {
              key: package,
              value: JSON.stringify({
                package,
                version,
                timestamp,
              }),
            },
          ],
        });
      } catch (error) {
        console.error(`Failed to publish webhook message`, error);
      }
    }
  );

  return server;
};
