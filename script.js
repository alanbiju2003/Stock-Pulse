let stockData = [];
let chartInstance = null;

Papa.parse("dump.csv", {
  download: true,
  header: true,
  complete: function(results) {
    stockData = results.data.filter(row => row.index_name && row.index_date); // clean
    const companies = [...new Set(stockData.map(row => row.index_name))];
    const list = document.getElementById("list");

    companies.forEach(name => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.onclick = () => displayChart(name);
      list.appendChild(btn);
    });
  }
});

function displayChart(companyName) {
  const companyData = stockData.filter(row => row.index_name === companyName);

  // Group by year
  const grouped = {};
  companyData.forEach(row => {
    const year = new Date(row.index_date).getFullYear();
    const value = parseFloat(row.closing_index_value);
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(value);
  });

  const years = Object.keys(grouped).sort();
  const avgValues = years.map(year => {
    const vals = grouped[year];
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  });

  document.getElementById("company-title").textContent = `📊 ${companyName} (Year-wise Closing Avg)`;

  const ctx = document.getElementById("chart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Average Closing Value',
        data: avgValues,
        backgroundColor: 'rgba(0, 230, 230, 0.6)',
        borderColor: '#00e6e6',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: '#ffffff',
        hoverBorderColor: '#00e6e6',
      }]
    },
    options: {
      animation: {
        duration: 1000,
        easing: 'easeOutBounce'
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#fff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#ccc' },
          title: {
            display: true,
            text: 'Year',
            color: '#00e6e6'
          }
        },
        y: {
          ticks: { color: '#ccc' },
          title: {
            display: true,
            text: 'Avg Closing Value',
            color: '#00e6e6'
          }
        }
      }
    }
  });
}
