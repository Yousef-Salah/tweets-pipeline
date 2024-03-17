const { Kafka } = require("kafkajs");
const Tweet = require("./models/Tweet");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "use_a_separate_group_id_for_each_stream",
});

const kafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "testing-topic", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      Tweet.insertMany(JSON.parse(message.value));
      console.log({
        topic,
        partition,
        // value: JSON.parse(message.value),
      });
    },
  });
};

module.exports = kafkaConsumer;
