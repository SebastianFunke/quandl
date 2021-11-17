const API_KEY = "za24bhhud4Yyyr5jo71F";
let adresses = [];
let selectedData = 0;

/**
 * Function that is executed first
 */
function init() {
    configureDatepickerEnd();
    configureDatepickerStart();
    fillAdresses();
    configureSelect();
    fillChart();
}

/**
 * Here the array is written with API addresses
 */
function fillAdresses() {
    adresses.push('https://data.nasdaq.com/api/v3/datasets/BITFINEX/LUNAF0USTF0');
    adresses.push('https://data.nasdaq.com/api/v3/datasets/LBMA/GOLD');
    adresses.push('https://data.nasdaq.com/api/v3/datasets/EUREX/FVSJ2022');
    adresses.push('https://data.nasdaq.com/api/v3/datasets/SHFE/SNQ2022');
}

/**
 * Function to calculate and return the date from a week ago
 * @returns date as string
 */
function getDaylastWeek() {
    var yest = new Date(new Date().getTime() - 168 * 60 * 60 * 1000);
    var month = yest.getMonth();
    var year = yest.getFullYear();
    var date = yest.getDate();
    var startDate = new Date(year, month, date);
    return startDate;
}

/**
 * The datepicker for the end date is set up in this function
 */
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

/**
 * The select for the different APIs is set up in this function
 * when selct is gonna be changed, the fillChart function will be called
 */
function configureSelect() {
    $('#dataSelector').on('change', function(e) {
        selectedData = this.value;
        fillChart();
    });
}

/**
 * The datepicker for the start date is set up in this function
 */
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

/**
 * Function to create the chart from the API of the item selected in the select 
 */
async function fillChart() {
    let dateStart = document.getElementById('datepickerStart').value;
    let dateEnd = document.getElementById('datepickerEnd').value;
    let responseRaw = await fetch(adresses[selectedData] + '?start_date=' + dateStart + '&end_date=' + dateEnd + '&api_key=za24bhhud4Yyyr5jo71F');
    let response = await responseRaw.json();
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