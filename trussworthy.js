// Copyright (c) 2016 Will Clark


google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

var chartData = [[0, 0, 0, 0]]

var viewedGen = 1

var drawChart = function() {
    var data = new google.visualization.DataTable()
    
    data.addColumn('number', 'Generation')
    data.addColumn('number', 'Maximum')
    data.addColumn('number', 'Median')
    data.addColumn('number', 'Minimum')
    
    data.addRows(chartData)
    
    
    var options = {
        //chartArea: {backgroundColor: {fill: "#394455"}},
        backgroundColor: "#394455",
        fontName: "Ubuntu",
        chartArea: {
            backgroundColor: "#4A5A70"
        },
        legend: {
            textStyle: {
                color: "white"
            }
        },
        hAxis: {
            minValue: 0,
            textStyle: {
                color: "white",
            },
            titleTextStyle: {
                fontSize: 0
            }
        },
        vAxis: {
            minValue: 0,
            textStyle: {
                color: "white"
            }
        }
    };

    var chart = new google.charts.Line(document.getElementById('progressgraph'));

    //chart.draw(data, options);
    chart.draw(data, google.charts.Line.convertOptions(options))
}

setTimeout(drawChart, 1000)

var setViewedGen = function() {
    viewedGen = $('#selectgen').val()
    $('#controltile h3').html("Generation: " + viewedGen)
}

$('#selectgen').on("input", setViewedGen)

setViewedGen()


var drawTruss = function(truss) {
    var c = $('#trusscanvas')[0].getContext("2d"),
        x = $('#trusscanvas').width() * 2,
        y = $('#trusscanvas').height() * 2,
        i = 0
    
    

    c.canvas.width = x // 0.9 = 30cm, 0.3 = 10cm, 0.03 = 1 cm
    c.canvas.height = y

    c.beginPath()
    c.setLineDash([5, 0])
    c.lineWidth = 5
    c.strokeStyle = "#1C2733"
    c.moveTo(x * 0.05, 0)
    c.lineTo(x * 0.05, y)
    c.stroke()

    c.beginPath()
    c.setLineDash([10, 6])
    c.moveTo(x * 0.95, 0)
    c.lineTo(x * 0.95, y)
    c.stroke()
    
    c.setLineDash([5, 0])
    c.fillStyle = "#FFF"
    c.strokeStyle = "#FFF"

    
    $.each(truss.connectors, function() {
        c.beginPath()
        c.moveTo(x * 0.05 + (this.start.x * 0.03 * x), y * 0.6 - (this.start.y * 0.03 * x))
        c.lineTo(x * 0.05 + (this.end.x * 0.03 * x), y * 0.6 - (this.end.y * 0.03 * x))
        c.fill()
        c.stroke()
    })
    
    c.strokeStyle = "#1C2733"
    
    c.beginPath()
    c.arc(x * 0.05, y * 0.6, 10, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
    
    c.beginPath()
    c.arc(x * 0.05, y * 0.6 - (x * 0.15), 10, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
    
    c.beginPath()
    c.arc(x * 0.95, y * 0.6, 10, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
    
    $.each(truss.points, function() {
        c.beginPath()
        c.arc(x * 0.05 + (this.x * 0.03 * x), y * 0.6 - (this.y * 0.03 * x), 10, 0, 2 * Math.PI) // 
        c.fill()
        c.stroke()
    })
    
}


var hinge = {
    x : 0,
    y : 5
}
var base = {
    x : 0,
    y : 0
}
var load = {
    x : 30,
    y : 0
}


var exTruss = {
    points : {
        a : {
            x : 10,
            y : 7
        },
        b : {
            x : 20,
            y : -2
        }
    },
    connectors : [],
    maxLoad : 243
}

exTruss.connectors = [{
                start : base,
                end : hinge,
                width : 10,
                loading : 0
            },
            {
                start : base,
                end : exTruss.points.a,
                width : 10,
                loading : 0
            },
            {
                start : base,
                end : exTruss.points.b,
                width : 10,
                loading : 0
            },
            {
                start : hinge,
                end : exTruss.points.a,
                width : 10,
                loading : 0
            },
            {
                start : exTruss.points.a,
                end : exTruss.points.b,
                width : 10,
                loading : 0
            },
            {
                start : exTruss.points.a,
                end : load,
                width : 10,
                loading : 0
            },
            {
                start : exTruss.points.b,
                end : load,
                width : 10,
                loading : 0
            }]

drawTruss(exTruss)

/* Truss:

{
    points : {
        hinge : {
            x : val,
            y : val
        },
        base : {
            x : val,
            y : val
        },
        load : {
            x : val,
            y : val
        },
        0 : {
            x : val,
            y : val
        },
        1 : {
            x : val,
            y : val
        },
        2 : {
            x : val,
            y : val
        }
    },
    connectors : [
            {
                start : hinge,
                end : a,
                width : 24,
                loading : 138
            },
            {
                start : base,
                end : a,
                width : 27
                loading : 138
            },
            {
                start : hinge,
                end : a,
                width : 31
                loading : 138
            }
        ],
    maxLoad : 243
}



*/


$(window).resize(function() {
    drawChart()
    drawTruss(exTruss)
})