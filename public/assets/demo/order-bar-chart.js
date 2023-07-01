// // var ctx = document.getElementById("myChart").getContext("2d");
// //
// // var data = {
// //     labels: ["Chocolate", "Vanilla", "Strawberry"],
// //     datasets: [{
// //         label: "Blue",
// //         backgroundColor: "blue",
// //         data: [3, 7, 4]
// //     }, {
// //         label: "Red",
// //         backgroundColor: "red",
// //         data: [4, 3, 5]
// //     }, {
// //         label: "Green",
// //         backgroundColor: "green",
// //         data: [7, 2, 6]
// //     }]
// // };
// //
// // var myBarChart = new Chart(ctx, {
// //     type: 'bar',
// //     data: data,
// //     options: {
// //         barValueSpacing: 20,
// //         scales: {
// //             yAxes: [{
// //                 ticks: {
// //                     min: 0,
// //                 }
// //             }]
// //         }
// //     }
// // });
// //
// //
// //
// //
//
//
// var GroupedbarChartData = {
//     labels: [
//         "Thứ 2",
//         "Thứ 3",
//         "Thứ 4",
//         "Thứ 5",
//         "Thứ 6",
//         "Thứ 7",
//         "Chủ nhật",
//
//     ],
//     datasets: [
//         {
//             label: "Đơn mua",
//             backgroundColor: "pink",
//             borderColor: "pink",
//             borderWidth: 1,
//             data: [50, 55, 66, 87, 83, 75, 96]
//         },
//         {
//             label: "Đơn bán",
//             backgroundColor: "blue",
//             borderColor: "blue",
//             borderWidth: 1,
//             data: [44, 27, 63, 96, 100, 57, 34]
//         },
//         {
//             label: "Tổng",
//             backgroundColor: "green",
//             borderColor: "green",
//             borderWidth: 1,
//             data: [100, 47, 44, 76, 59, 77, 53]
//         }
//     ]
// };
//
// // var BarchartOptions = {
// //     responsive: true,
// //     legend: {
// //         position: "top"
// //     },
// //     title: {
// //         display: true,
// //         text: "Chart.js Bar Chart"
// //     }
// // }
//
// window.onload = function ()
// {
//     var chartData= {
//         type: "bar",
//         data: GroupedbarChartData,
//         // options: BarchartOptions
//     }
//     new Chart("OrderGroupedbarChartcanvas", chartData);
// };
