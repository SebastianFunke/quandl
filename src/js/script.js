const API_KEY = "za24bhhud4Yyyr5jo71F";
let adresses = [];
let selectedData = 0;

function init() {
    configureDatepickerEnd();
    configureDatepickerStart();
    fillAdresses();
    configureSelect();
    fillChart();
}

function fillAdresses() {
    adresses.push('https://data.nasdaq.com/api/v3/datasets/BITFINEX/LUNAF0USTF0');
    adresses.push('https://data.nasdaq.com/api/v3/datasets/LBMA/GOLD');
    adresses.push('https://data.nasdaq.com/api/v3/datasets/EUREX/FVSJ2022');
    adresses.push('https://data.nasdaq.com/api/v3/datasets/SHFE/SNQ2022');
}

function getDaylastWeek() {
    var yest = new Date(new Date().getTime() - 168 * 60 * 60 * 1000);
    var month = yest.getMonth();
    var year = yest.getFullYear();
    var date = yest.getDate();
    var startDate = new Date(year, month, date);
    return startDate;
}

function configureDatepickerEnd() {
    $("#datepickerEnd").datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            setEndDate: 'now',
        })
        .on('changeDate', function(selected) {
            var maxDate = new Date(selected.date.valueOf());
            $('#datepickerStart').datepicker('setEndDate', maxDate);
            fillChart();
        });
    $('#datepickerEnd').datepicker('update', 'yesterday');
    $('#datepickerEnd').datepicker('setStartDate', getDaylastWeek());
    $('#datepickerEnd').datepicker('setEndDate', 'yesterday');
}

function configureSelect() {
    $('#dataSelector').on('change', function(e) {
        console.log(this.value);
        selectedData = this.value;
        fillChart();
    });
}

function configureDatepickerStart() {
    $("#datepickerStart").datepicker({
            todayBtn: 1,
            format: 'yyyy-mm-dd',
            autoclose: true,
        })
        .on('changeDate', function(selected) {
            var minDate = new Date(selected.date.valueOf());
            $('#datepickerEnd').datepicker('setStartDate', minDate);
            fillChart();
        });

    $('#date').datepicker({
        format: 'yyyy-mm-dd',
    });
    $('#datepickerStart').datepicker('update', getDaylastWeek());
    $('#datepickerStart').datepicker('setEndDate', 'yesterday');
}

async function fillChart() {
    let dateStart = document.getElementById('datepickerStart').value;
    let dateEnd = document.getElementById('datepickerEnd').value;
    console.log(dateStart + '  ' + dateEnd);
    //let responseRaw = await fetch('https://data.nasdaq.com/api/v3/datasets/BITFINEX/LUNAF0USTF0?start_date=2021-06-10&end_date=2021-11-12&api_key=za24bhhud4Yyyr5jo71F');

    let responseRaw = await fetch(adresses[selectedData] + '?start_date=' + dateStart + '&end_date=' + dateEnd + '&api_key=za24bhhud4Yyyr5jo71F');
    let response = await responseRaw.json();
    console.log(response);
    console.log(adresses);

    var data = [];
    var dataSeries = {
        type: "line"

    };
    var dataPoints = [];
    for (var i = 0; i < response['dataset']['data'].length; i += 1) {

        dataPoints.push({
            x: new Date(response['dataset']['data'][i][0]),
            y: response['dataset']['data'][i][3]
        });

    }
    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        title: {
            text: response['dataset']['database_code'] + '\n' + response['dataset']['column_names'][3]
        },
        data: data // random generator below
    });
    chart.render();

}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}