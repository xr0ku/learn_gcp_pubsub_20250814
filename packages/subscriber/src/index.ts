import { PubSub } from "@google-cloud/pubsub";
import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === "production") {
  dotenv.config({
    path: path.resolve(__filename, "/etc/secrets/pub-sub-api-access-key.json"),
  });
} else {
  dotenv.config({
    path: path.resolve(__filename, `../../../../.env_${process.env.NODE_ENV}`),
  });
}

const topicName = process.env.PUBSUB_TOPIC_NAME as string;
const projectId = process.env.GOOGLE_PROJECT_ID as string;

const pubsub = new PubSub({ projectId });

async function main() {
  const subscriptionName = `${topicName}-sub`;

  const [subscriptions] = await pubsub.subscription(subscriptionName).exists();
  if (!subscriptions) {
    console.log(`subscription is not found.`);
    process.exit(1);
  }

  const subscription = pubsub.subscription(subscriptionName);

  subscription.on("message", (message) => {
    console.log("received message:");
    console.log(` ID: ${message.id}`);
    console.log(` Data: ${message.data.toString()}`);
    message.ack();
  });

  subscription.on("error", (error) => {
    console.error("subscription error occurred.");
  });

  console.log(`Waiting for messages on subscription ${subscriptionName}...`);
}

main().catch(console.error);
