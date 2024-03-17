import gzip
import random
from datetime import datetime
from json import dumps
from time import sleep, time

from helper import convert_csv_to_gzip
from kafka import KafkaProducer

# csv_file_path: str = "./data/data.csv"

gzip_file_path: str = "./data/output.csv.gzip"  # convert_csv_to_gzip(csv_file_path)

producer = KafkaProducer(
    bootstrap_servers=["localhost:9092"],
    value_serializer=lambda x: dumps(x).encode("utf-8"),
)


def random_days_diff():
    day_ms = 1000 * 60 * 60 * 24
    number_of_diff_days = random.random() * 30

    if random.random() < 0.5:
        number_of_diff_days *= -1

    return day_ms * number_of_diff_days


i = 1
tweets_container = []
with gzip.open(gzip_file_path, "rt") as f:
    for line in f:
        if i % 1000 != 0:
            line = line.replace("'", '"')
            attribute_details = line.split(",")
            timestamp = int(time() * 1000)

            tweet = {
                "id": attribute_details[1],
                "timestamp": timestamp,
                "date": datetime.utcfromtimestamp(
                    (timestamp + random_days_diff()) / 1000.0
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "user": attribute_details[4],
                "text": attribute_details[5],
                "retweets": int(random.random() * 10),
            }

            tweets_container.append(tweet)

        else:
            # send data to kafka
            producer.send("testing-topic", value=tweets_container)
            tweets_container.clear()
            sleep(1)

        i = i + 1
