'use strict';

/* Chart.js docs: https://www.chartjs.org/ */

window.chartColors = {
	green: '#dc3545',
	gray: '#a9b5c9',
	text: '#252930',
	border: '#e7e9ed'
};

function PlotChart() {
	// Make a fetch GET request
	fetch('https://ecommerce-fullstack-nine.vercel.app/api/orders/' + localStorage.getItem('userId') + '/' + localStorage.getItem('token'))
		.then(response => response.json())
		.then(data => {
			let dates = [0, 0, 0, 0, 0, 0, 0]
			for (let order of data.data) {
				const date = new Date(order.createdAt);
				dates[date.getDay()] += 1;
			}
			console.log(dates);
			plotBarChart(dates);
		})
		.catch(error => console.error('Error fetching data:', error));
}

  
  
// Chart.js Bar Chart Example 
const plotBarChart = (data) => {
	console.log("REached here ee");
	var barChartConfig = {
		type: 'bar',
	
		data: {
			labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			datasets: [{
				label: 'Orders',
				backgroundColor: window.chartColors.green,
				borderColor: window.chartColors.green,
				borderWidth: 1,
				maxBarThickness: 16,
				
				data: data
			}]
		},
		options: {
			responsive: true,
			aspectRatio: 1.5,
			legend: {
				position: 'bottom',
				align: 'end',
			},
			title: {
				display: true,
				text: 'Orders trend per day of the week',
			},
			tooltips: {
				mode: 'index',
				intersect: false,
				titleMarginBottom: 10,
				bodySpacing: 10,
				xPadding: 16,
				yPadding: 16,
				borderColor: window.chartColors.border,
				borderWidth: 1,
				backgroundColor: '#fff',
				bodyFontColor: window.chartColors.text,
				titleFontColor: window.chartColors.text,
	
			},
			scales: {
				xAxes: [{
					display: true,
					gridLines: {
						drawBorder: false,
						color: window.chartColors.border,
					},
	
				}],
				yAxes: [{
					display: true,
					gridLines: {
						drawBorder: false,
						color: window.chartColors.borders,
					},
	
					
				}]
			}
			
		}
	}
	console.log("REached here");
	var barChart = document.getElementById('canvas-barchart').getContext('2d');
	window.myBar = new Chart(barChart, barChartConfig);
}








// Generate charts on load
window.addEventListener('load', function(){
	PlotChart();
});	
	
