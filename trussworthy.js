// Copyright (c) 2016 Will Clark


google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

var chartData = [[0, 0, 0, 0]]

var maxBeamLoading = 100 * 9.81 //Value in Newtons

var jointWeight = 1
var beamDensityPerCM = 1

var viewedGen = 1

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

var thisGenData = []
var nextGenData = []
/*
var historicalData = [
    {
        bestTruss : truss1,
        medTruss : truss2,
        worstTruss : truss3
    }
    
    ]
*/
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





var exTruss = {
    points : [
        {
            x : 10,
            y : 7
        },
        {
            x : 20,
            y : -2
        }
    ],
    connectors : [],
    maxLoad : 0,
    weight : 0
}

exTruss.connectors = [{
                start : base,
                end : hinge,
                width : 10,
                loading : 0
            },
            {
                start : base,
                end : exTruss.points[0],
                width : 10,
                loading : 0
            },
            {
                start : base,
                end : exTruss.points[1],
                width : 10,
                loading : 0
            },
            {
                start : hinge,
                end : exTruss.points[0],
                width : 10,
                loading : 0
            },
            {
                start : exTruss.points[0],
                end : exTruss.points[1],
                width : 10,
                loading : 0
            },
            {
                start : exTruss.points[0],
                end : load,
                width : 10,
                loading : 0
            },
            {
                start : exTruss.points[1],
                end : load,
                width : 10,
                loading : 0
            }]

drawTruss(exTruss)


$(window).resize(function() {
    drawChart()
    drawTruss(exTruss)
})

var createEq = function(truss, vertex) {
    var currentBeams = [],
        xSubmit = [],
        ySubmit = [],
        emptySubmit = [],
        i = 0,
        j = 0,
        deltaX = 0,
        deltaY = 0
    
    for (i = 0; i < truss.connectors.length; i++) {
        xSubmit.push(0)
        ySubmit.push(0)
        emptySubmit.push(0)
        
        if (Object.is(truss.connectors[i].start, vertex)) {
            
            currentBeams.push([truss.connectors[i].start, truss.connectors[i].end])
            
        } else if (Object.is(truss.connectors[i].end, vertex)) {
            
            currentBeams.push([truss.connectors[i].end, truss.connectors[i].start])
            
        }
    }
    
    for (i = 0; i < currentBeams.length; i++) {
        
        for (j = 0; j < truss.connectors.length; j++) {
            
            if (
                (Object.is(currentBeams[i][1], truss.connectors[j].start) && Object.is(vertex, truss.connectors[j].end)) || (Object.is(currentBeams[i][1], truss.connectors[j].end) && Object.is(vertex, truss.connectors[j].start))) {
                
                deltaX = currentBeams[i][1].x - currentBeams[i][0].x
                deltaY = currentBeams[i][1].y - currentBeams[i][0].y
                
                xSubmit[j] = deltaX / Math.sqrt(deltaX * deltaX + deltaY * deltaY)
                ySubmit[j] = deltaY / Math.sqrt(deltaX * deltaX + deltaY * deltaY)
                
                
                }
            
        }
    }
    return({xRow : xSubmit, yRow : ySubmit})
}

var solveTruss = function(truss) {
    var matrixSize = truss.connectors.length,
        i = 0,
        matrixA = [], // load x,y, hinge x,y, base x,y, 0 x,y, 1 x,y, etc.. 
        matrixB = [],
        loadedRows = {},
        trussLoading = [],
        maxLoad = 0,
        deltaX = 0,
        deltaY = 0
    
    loadedRows = createEq(truss, load)
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.xRow)
        matrixB.push(0)
    }
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.yRow)
        matrixB.push(-6)
    }
    
    loadedRows = createEq(truss, base)
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.xRow)
        matrixB.push(1)
    }
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.yRow)
        matrixB.push(0)
    }
    
    i = 0
    
    while (matrixA.length < matrixSize && i < truss.points.length) {
        loadedRows = createEq(truss, truss.points[i])
        
        if (matrixA.length < matrixSize) {
            matrixA.push(loadedRows.xRow)
            matrixB.push(0)
        }
        
        if (matrixA.length < matrixSize) {
            matrixA.push(loadedRows.yRow)
            matrixB.push(0)
        }
        i++
    }
    
    loadedRows = createEq(truss, hinge)
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.xRow)
        matrixB.push(-1)
    }
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.yRow)
        matrixB.push(6)
    }
    
    trussLoading = math.lusolve(matrixA, matrixB)
    
    for (i = 0; i < matrixSize; i++) {
        if (trussLoading[i][0] > maxLoad) {
            maxLoad = trussLoading[i][0]
        }
    }
    for (i = 0; i < matrixSize; i++) {
        truss.connectors[i].loading = trussLoading[i][0] * (maxBeamLoading / maxLoad)
    }
    
    truss.maxLoad = (maxBeamLoading / maxLoad) * 6
    
    truss.weight += truss.points.length * jointWeight
    
    for (i = 0; i < truss.connectors.length; i++) {
        deltaX = truss.connectors[i].end.x - truss.connectors[i].start.x
        deltaY = truss.connectors[i].end.y - truss.connectors[i].start.y
        truss.weight += math.sqrt(deltaX * deltaX + deltaY * deltaY) * beamDensityPerCM
    }
    
//    console.log(truss.maxLoad)
//    console.log(truss.weight)
//    console.log(truss.maxLoad / truss.weight)
    
}

solveTruss(exTruss)


var createRandomTruss = function() {
    var randomNumber = 1,
        newTruss = {
                        points : [],
                        connectors : [],
                        maxLoad : 0,
                        weight : 0
                    },
        newPoint = {}
    
    while (randomNumber > 0.1) {
        randomNumber = Math.random()
        
        newPoint = {x : (Math.random() * 25) + 2.5, y : (Math.random() * 25) - 12.5}
        
        newTruss.points.append()
        
        if (math.random() < 0.6) {
            newTruss.connectors.append(
                {
                    start : newPoint,
                    end : load,
                    width : 10,
                    loading : 0
                })
        }
        
        
    }
}

var checkTruss = function(truss) {
    
    // Check correct number of connections
    
    
    // Check all joined
    
}

var mutateTruss = function(truss) {
    
}