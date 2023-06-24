const Kafka = require("node-rdkafka");
const Notification = require("../Models/notificationModel");

// Kafka Consumer
const consumer = new Kafka.KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": "localhost:9092",
  },
  {}
);

const startConsumer = () => {
  consumer.connect();
  consumer
    .on("ready", () => {
      console.log("Consumer is ready");
      consumer.subscribe(["notification"]);
      consumer.consume();
    })
    .on("data", (data) => {
      console.log(data);
      const message = JSON.parse(data.value.toString());
      console.log("Received message from Kafka:", message);

      // Save the message to MongoDB
      const newNotification = new Notification(message);
      newNotification
        .save()
        .then(() => {
          console.log("Notification saved to MongoDB");
        })
        .catch((err) => {
          console.log("Failed to save notification to MongoDB:", err);
        });
    });
};

module.exports = startConsumer;
