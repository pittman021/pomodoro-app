import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

class Stats extends Component {
  constructor() {
    super();

    this.state = {
      chartData: [],
      chartOptions: []
    };
    // this.fetchStats();
  }

  componentDidMount() {
    axios.get('/api/stats').then(data => {
      const results = data.data;
      const labels = [];
      const pomz = [];

      for (var i = 0; i < 22; i++) {
        const item = results.indexOf(day => {
          return i === day._id.dayOfMonth;
        });

        if (item === -1) {
          results.push({ _id: { dayOfMonth: i }, count: 0 });
        }
      }

      results.sort(function(a, b) {
        return a._id.dayOfMonth - b._id.dayOfMonth;
      });

      results.forEach(day => {
        labels.push(day._id.dayOfMonth);
        pomz.push(day.count);
      });

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Pomz Per Day',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: pomz
          }
        ]
      };

      const options = {
        responsive: true,
        title: {
          display: true,
          text: 'Monthly'
        },
        legend: {
          display: true
        },
        tooltips: {
          mode: 'label'
        },
        hover: {
          mode: 'dataset'
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                show: true,
                labelString: 'Month'
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                show: true,
                labelString: 'Value'
              },
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10
              }
            }
          ]
        }
      };

      console.log(chartData, options);

      this.setState({
        chartData: chartData,
        chartOptions: options
      });
    });
  }

  render() {
    return (
      <div className="stats column">
        <a name="stats" />
        <Bar data={this.state.chartData} height={300} width={600} options={this.state.chartOptions} />
      </div>
    );
  }
}

export default Stats;
