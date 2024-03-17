// Copied from chat-gpt
const niceColors = [
  "#3498db",
  "#2ecc71",
  "#e74c3c",
  "#f39c12",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#d35400",
  "#c0392b",
  "#1abc9c",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#27ae60",
  "#e67e22",
  "#7f8c8d",
  "#f1c40f",
  "#e84393",
  "#3c6382",
];

const topUserCtx = document.getElementById("top-20-users-chart");
const dailyTweetsDistributionCtx = document.getElementById(
  "daily-tweets-distribution-chart"
);
const userTweetsDistributionCtx = document.getElementById(
  "user-tweets-distribution"
);
const userNameInput = document.getElementById("user-name-input");

let topUserChart = new Chart(topUserCtx, {
  options: {
    plugins: {
      datalabels: {
        color: "black",
        fomatter: function (value, context) {
          return value;
        },
      },
    },
  },
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [],
    datasets: [
      {
        label: "# of tweets",
        data: [],
        borderWidth: 1,
        backgroundColor: niceColors,
      },
    ],
  },
});

let dailyDistributionChart = new Chart(dailyTweetsDistributionCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Daily Distribution",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
});
let userDistributionChart = new Chart(userTweetsDistributionCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Daily Distribution",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
});

const requestData = async () => {
  let requestConfig = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  await fetch("http://localhost:3000/top-users", requestConfig)
    .then((res) => res.json())
    .then((res) => updateChartData(topUserChart, res["data"], res["labels"]));

  await fetch("http://localhost:3000/tweet-distribution", requestConfig)
    .then((res) => res.json())
    .then((res) =>
      updateChartData(dailyDistributionChart, res["data"], res["labels"])
    );
  await fetch(
    "http://localhost:3000/user-tweet-distribution?username=" +
      userNameInput.value,
    {
      requestConfig,
    }
  )
    .then((res) => res.json())
    .then((res) =>
      updateChartData(userDistributionChart, res["data"], res["labels"])
    );
};

(async () => await requestData())();

setInterval(async () => {
  await requestData();
}, 3000);

function updateChartData(chart, data, labels) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}
