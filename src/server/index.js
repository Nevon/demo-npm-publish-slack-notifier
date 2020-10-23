const { Kafka } = require("kafkajs");
const config = require("../config");
const createApp = require("./app");

const client = new Kafka(config.kafka);
const producer = client.producer();

const main = async () => {
  await producer.connect();

  const app = createApp({ producer, config: config.app });

  const server = app.listen(config.server.port, (error) => {
    if (error != null) {
      throw error;
    }

    console.log(`Server is listening on port ${config.server.port}`);
  });

  const shutdown = async () => {
    await server.close();
    await producer.disconnect();
  };

  return shutdown;
};

const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

main()
  .then(async (shutdown) => {
    signalTraps.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`Received ${signal} signal. Shutting down.`);
        try {
          await shutdown();
          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown", error);
          process.exit(1);
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error during startup", error);
    process.exit(1);
  });
