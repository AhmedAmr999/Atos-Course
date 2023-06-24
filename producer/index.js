const Kafka = require("node-rdkafka");

// Kafka Producer
const produceMessage = (message) => {
  const producer = new Kafka.Producer(
    {
      "metadata.broker.list": "localhost:9092",
    },
    {}
  );

  producer.connect();

  producer.on("ready", () => {
    console.log("Producer is ready");
    producer.produce(
      "notification",
      null,
      Buffer.from(JSON.stringify(message)),
      null,
      Date.now()
    );
  });

  producer.on("delivery-report", (err, report) => {
    if (err) {
      console.error("Failed to deliver message:", err);
    } else {
      console.log("Message delivered successfully");
    }

    producer.disconnect();
  });
};

module.exports = produceMessage;
