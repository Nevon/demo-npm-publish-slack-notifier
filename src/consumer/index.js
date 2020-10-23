const { Kafka } = require("kafkajs");
const { IncomingWebhook } = require("@slack/webhook");
const config = require("../config");
const createConsumer = require("./consumer");

const kafka = new Kafka(config.kafka);
const slack = new IncomingWebhook(config.slack.webhookUrl);

const main = async () => {
  const consumer = await createConsumer({ kafka, config, slack });

  const shutdown = async () => {
    await consumer.disconnect();
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
