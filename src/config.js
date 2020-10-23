const server = { port: process.env.PORT || 3000 };

const kafka = {
  clientId: "npm-slack-notifier",
  brokers: [process.env.BOOTSTRAP_BROKER || "localhost:9092"],
  ssl: process.env.KAFKA_SSL ? JSON.parse(process.env.KAFKA_SSL) : false,
  sasl:
    process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD
      ? {
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
          mechanism: 'plain'
        }
      : null,
};

const consumer = {
  groupId: process.env.KAFKA_GROUP_ID || "npm-slack-notifier",
};

const app = {
  secret: process.env.HOOK_SECRET,
  topic: process.env.TOPIC || "npm-package-published",
  mount: "/hook",
};

const processor = {
  topic: app.topic,
};

const slack = {
  webhookUrl: process.env.SLACK_WEBHOOK_URL,
};

module.exports = {
  server,
  kafka,
  consumer,
  app,
  processor,
  slack,
};
