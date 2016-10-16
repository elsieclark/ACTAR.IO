// Copyright (c) 2016 Will Clark


google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

var chartData = [[0, 0, 0, 0]]

var maxBeamLoading = 100 //Value in Newtons

var jointWeight = 0.01
var beamDensityPerCM = 1

var viewedGen = 1

var autoProgress = false

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
var historicalData = []
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


var drawTruss = function() {
    var c = $('#trusscanvas')[0].getContext("2d"),
        x = $('#trusscanvas').width() * 2,
        y = $('#trusscanvas').height() * 2,
        i = 0,
        truss = historicalData[viewedGen - 1].bestTruss
    
    

    c.canvas.width = x * 1.5 // 0.9 = 30cm, 0.3 = 10cm, 0.03 = 1 cm
    c.canvas.height = y * 1.5

    c.beginPath()
    c.setLineDash([5, 0])
    c.lineWidth = 5
    c.strokeStyle = "#1C2733"
    c.moveTo(x * 0.05, 0)
    c.lineTo(x * 0.05, y * 1.5)
    c.stroke()

    c.beginPath()
    c.setLineDash([10, 6])
    c.moveTo(x * 0.95, 0)
    c.lineTo(x * 0.95, y *  1.5)
    c.stroke()
    
    c.setLineDash([5, 0])
    c.fillStyle = "#FFF"
    c.strokeStyle = "#FFF"

    
    $.each(truss.connectors, function() {
        c.beginPath()
        c.moveTo(x * 0.05 + (this.start.x * 0.03 * x), y * 0.8 - (this.start.y * 0.03 * x))
        c.lineTo(x * 0.05 + (this.end.x * 0.03 * x), y * 0.8 - (this.end.y * 0.03 * x))
        c.fill()
        c.stroke()
    })
    
    c.strokeStyle = "#1C2733"
    
    c.beginPath()
    c.arc(x * 0.05, y * 0.8, 10, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
    
    c.beginPath()
    c.arc(x * 0.05, y * 0.8 - (x * 0.15), 10, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
    
    c.beginPath()
    c.arc(x * 0.95, y * 0.8, 10, 0, 2 * Math.PI)
    c.fill()
    c.stroke()
    
    $.each(truss.points, function() {
        c.beginPath()
        c.arc(x * 0.05 + (this.x * 0.03 * x), y * 0.8 - (this.y * 0.03 * x), 10, 0, 2 * Math.PI) // 
        c.fill()
        c.stroke()
    })
    
}

var updateInterface = function() {
    
    viewedGen = $('#selectgen').val()
    
    $('#controltile h3').html("Generation: " + viewedGen)
    drawTruss()
    
    $('#databox p').html(JSON.stringify(historicalData[viewedGen - 1].bestTruss))
    
    $('.gendatavalue').eq(0).html((historicalData[viewedGen - 1].bestTruss.maxLoad / historicalData[viewedGen - 1].bestTruss.weight).toFixed(2))
    $('.gendatavalue').eq(1).html(historicalData[viewedGen - 1].bestTruss.maxLoad.toFixed(2))
    $('.gendatavalue').eq(2).html(historicalData[viewedGen - 1].bestTruss.weight.toFixed(2))
    
    $('.gendatavalue').eq(3).html((historicalData[viewedGen - 1].medTruss.maxLoad / historicalData[viewedGen - 1].medTruss.weight).toFixed(2))
    $('.gendatavalue').eq(4).html(historicalData[viewedGen - 1].medTruss.maxLoad.toFixed(2))
    $('.gendatavalue').eq(5).html(historicalData[viewedGen - 1].medTruss.weight.toFixed(2))
    
    $('.gendatavalue').eq(6).html((historicalData[viewedGen - 1].worstTruss.maxLoad / historicalData[viewedGen - 1].worstTruss.weight).toFixed(2))
    $('.gendatavalue').eq(7).html(historicalData[viewedGen - 1].worstTruss.maxLoad.toFixed(2))
    $('.gendatavalue').eq(8).html(historicalData[viewedGen - 1].worstTruss.weight.toFixed(2))
    
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


$(window).resize(function() {
    drawChart()
    drawTruss()
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
    
//    console.log(matrixA)
//    console.log(matrixB)
//    console.log(trussLoading)
    
    for (i = 0; i < matrixSize; i++) {
        if (Math.abs(trussLoading[i][0]) > Math.abs(maxLoad)) {
            maxLoad = trussLoading[i][0]
        }
    }
    
    
    for (i = 0; i < matrixSize; i++) {
        truss.connectors[i].loading = trussLoading[i][0]
    }
    
    truss.maxLoad = (maxBeamLoading * 6 / Math.abs(maxLoad))    
    
    
    truss.weight = truss.points.length * jointWeight
    
    for (i = 0; i < truss.connectors.length; i++) {
        deltaX = truss.connectors[i].end.x - truss.connectors[i].start.x
        deltaY = truss.connectors[i].end.y - truss.connectors[i].start.y
        truss.weight += math.sqrt(deltaX * deltaX + deltaY * deltaY) * beamDensityPerCM
    }
    
    
}


var createRandomTruss = function() {
    var randomNumber = 1,
        newTruss = {
                        points : [],
                        connectors : [],
                        maxLoad : 0,
                        weight : 0
                    },
        newPoint = {},
        i = 0,
        targetPoint = {},
        j = 0
    
    newTruss.connectors.push(
                {
                    start : base,
                    end : hinge,
                    width : 10,
                    loading : 0
                })
    
    while (randomNumber > 0.5 || j < 3) {
        j++
        randomNumber = Math.random()
        
        newPoint = {x : (Math.random() * 15) + 7.5, y : (Math.random() * 5) - 2.5}
        
        newTruss.points.push(newPoint)
        
        
        for (i = -3; i < newTruss.points.length - 1; i++) {
            if (i === -3) {
                targetPoint = load
            } else if (i === -2) {
                targetPoint = base
            } else if (i === -1) {
                targetPoint = hinge
            } else {
                targetPoint = newTruss.points[i]
            }
            
            var a = math.random()
            
            
            if (a < 0.7) {
                newTruss.connectors.push(
                    {
                        start : newPoint,
                        end : targetPoint,
                        width : 10,
                        loading : 0
                    })
            }
        }
    }
    
    if (checkTruss(newTruss)) {
        return newTruss
    } else {
        return createRandomTruss()
    }
}

var checkTruss = function(truss) {
    var i = 0,
        j = 0,
        counter = 0,
        targetPoint = {},
        targetCount = 0,
        deltaX = 0,
        deltaY = 0,
        length = 0
    
        // Check correct number of connections at each joint
    
    for (i = -3; i < truss.points.length; i++) {
        counter = 0
        
        switch (i) {
            case -3:
                targetPoint = load
                targetCount = 2
                break
            case -2:
                targetPoint = base
                break
            case -1:
                targetPoint = hinge
                break
            default:
                targetPoint = truss.points[i]
                targetCount = 3
        }
                
        
        for (j = 0; j < truss.connectors.length; j++) {
            if (Object.is(targetPoint, truss.connectors[j].start) || Object.is(targetPoint, truss.connectors[j].end)) {
                counter++
            }
        }
        if (counter < targetCount) {
            //console.log("a")
            return false
        }
        
    }
    
    // Check solvable
    
    if ((truss.points.length + 3) * 2 < truss.connectors.length) {
        //console.log("b")
        return false
    }
    
    if (getDeterminant(truss) < 0.001) {
        //console.log("c")
        return false
        
    }
    
    // check beam lengths
    
    for(i = 0; i < truss.connectors.length; i++) {
        deltaX = Math.abs(truss.connectors[i].end.x - truss.connectors[i].start.x)
        deltaY = Math.abs(truss.connectors[i].end.y - truss.connectors[i].start.y)
        length = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        if (length < 5 || length > 23) {
            //console.log("d")
            return false
        }
    }
    
    
    for(i = 0; i < truss.points.length; i++) {
        
        if (truss.points[i].x < 4 || truss.points[i].x > 24) {
            return false
        }
        if (truss.points[i].y < -13 || truss.points[i].y > 13) {
            return false
        }
    }
    
    return true
    
}

var getDeterminant = function(truss) {
    var matrixSize = truss.connectors.length,
        i = 0,
        matrixA = [], // load x,y, hinge x,y, base x,y, 0 x,y, 1 x,y, etc.. 
        loadedRows = {},
        trussLoading = [],
        maxLoad = 0,
        deltaX = 0,
        deltaY = 0
    
    loadedRows = createEq(truss, load)
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.xRow)
    }
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.yRow)
    }
    
    loadedRows = createEq(truss, base)
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.xRow)
    }
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.yRow)
    }
    
    i = 0
    
    while (matrixA.length < matrixSize && i < truss.points.length) {
        loadedRows = createEq(truss, truss.points[i])
        
        if (matrixA.length < matrixSize) {
            matrixA.push(loadedRows.xRow)
        }
        
        if (matrixA.length < matrixSize) {
            matrixA.push(loadedRows.yRow)
        }
        i++
    }
    
    loadedRows = createEq(truss, hinge)
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.xRow)
    }
    
    if (matrixA.length < matrixSize) {
        matrixA.push(loadedRows.yRow)
    }
    
    return math.det(matrixA)
}

var mutateTruss = function(truss) {
    var childTruss = JSON.parse(JSON.stringify(truss)),
        randNum = Math.random(),
        targetPoint = 0,
        targetPointB = 0,
        newPoint = 0,
        targetArr = [],
        doesExist = false,
        i = 0,
        j = 0,
        k = 0
    
    for (i = -3; i < childTruss.points.length; i++) {
        switch (i) {
            case -3:
                targetPoint = hinge
                break
            case -2:
                targetPoint = base
                break
            case -1:
                targetPoint = load
                break
            default:
                targetPoint = childTruss.points[i]
                break
        }
        
        for (j = 0; j < childTruss.connectors.length; j++) {
            if (JSON.stringify(targetPoint) === JSON.stringify(childTruss.connectors[j].start)) {
                childTruss.connectors[j].start = targetPoint
            }
            if (JSON.stringify(targetPoint) === JSON.stringify(childTruss.connectors[j].end)) {
                childTruss.connectors[j].end = targetPoint
            }
        }    
    }  
    
    
    // Remove vertex
    
    if (randNum < 0.04) {
        randNum = math.floor(math.random * childTruss.points.length * 25)
        targetPoint = childTruss.points.splice(randNum, 1)
        
        for (i = 0; i < childTruss.connectors.length; i++) {
            if (Object.is(targetPoint, childTruss.connectors[i].start)) {
                targetArr.push(i)
            }
            else if (Object.is(targetPoint, childTruss.connectors[i].end)) {
                targetArr.push(i)
            }
        }
        
        for (i = 0; i < targetArr.length; i++) {
            childTruss.connectors.splice(targetArr.pop(), 1)
        }
        
    }
    
    // Add vertex
    
    randNum = Math.random()
    
    if (randNum < 0.5) {
        newPoint = {x : (Math.random() * 25) + 2.5, y : (Math.random() * 16) - 8}
        
        childTruss.points.push(newPoint)
        
        
        for (i = -3; i < childTruss.points.length - 1; i++) {
            if (i === -3) {
                targetPoint = load
            } else if (i === -2) {
                targetPoint = base
            } else if (i === -1) {
                targetPoint = hinge
            } else {
                targetPoint = childTruss.points[i]
            }
            
            var a = math.random()
            
            
            if (a < 0.8) {
                childTruss.connectors.push(
                    {
                        start : newPoint,
                        end : targetPoint,
                        width : 10,
                        loading : 0
                    })
            }
        }
    }
    
    // Move vertex
    
    for (i = 0; i < childTruss.points.length; i++) {
        randNum = Math.random()
        if (randNum < 0.02) {
            childTruss.points[i].x *= (randNum * 40 + 0.6)
        } else if (randNum < 0.2) {
            childTruss.points[i].x *= (randNum + 0.9)
        }
        randNum = Math.random()
        if (randNum < 0.02) {
            childTruss.points[i].y *= (randNum * 40 + 0.6)
        } else if (randNum < 0.2) {
            childTruss.points[i].y *= (randNum + 0.9)
        }
    }
    
    // Add connection
    
    for (i = -3; i < childTruss.points.length; i++) {
        switch (i) {
            case -3:
                targetPoint = hinge
                break
            case -2:
                targetPoint = base
                break
            case -1:
                targetPoint = load
                break
            default:
                targetPoint = childTruss.points[i]
        }
        
        for (j = i+1; j < childTruss.points.length; j++) {
            switch (j) {
                case -2:
                    targetPointB = base
                    break
                case -1:
                    targetPointB = load
                    break
                default:
                    targetPointB = childTruss.points[j]
            }
            
            doesExist = false
            
            for (k = 0; k < childTruss.connectors.length; k++) {
                if ((Object.is(childTruss.connectors[k].start, targetPoint) && Object.is(childTruss.connectors[k].end, targetPointB)) || (Object.is(childTruss.connectors[k].end, targetPoint) && Object.is(childTruss.connectors[k].start, targetPointB))) {
                    doesExist = true
                }
            }
            
            if (!doesExist) {
                if (Math.random() < 0.1) {

                    
                    childTruss.connectors.push(
                        {
                            start : targetPoint,
                            end : targetPointB,
                            width : 10,
                            loading : 0
                        })

                }
            }
            
        }
        
        
        
    }
    
    // Remove connection
    
    for (i = 1; i < childTruss.connectors.length; i++) {
        if (Math.random() < 0.03) {
            childTruss.connectors.splice(i, 1)
        }
    }
    
    
    
    if (checkTruss(childTruss)) {
        return childTruss
    } else {
        return mutateTruss(truss)
    }
    
}

var copyTruss = function(truss) {
    var copyTruss = JSON.parse(JSON.stringify(truss)),
        targetPoint = 0,
        i = 0,
        j = 0
    
    for (i = -3; i < copyTruss.points.length; i++) {
        switch (i) {
            case -3:
                targetPoint = hinge
                break
            case -2:
                targetPoint = base
                break
            case -1:
                targetPoint = load
                break
            default:
                targetPoint = copyTruss.points[i]
                break
        }
        
        for (j = 0; j < copyTruss.connectors.length; j++) {
            if (JSON.stringify(targetPoint) === JSON.stringify(copyTruss.connectors[j].start)) {
                copyTruss.connectors[j].start = targetPoint
            }
            if (JSON.stringify(targetPoint) === JSON.stringify(copyTruss.connectors[j].end)) {
                copyTruss.connectors[j].end = targetPoint
            }
        }    
    }
    return copyTruss
}

 setTimeout(function() {
    var i = 0
    
    for (i = 0; i < 100; i++) {
        nextGenData.push(createRandomTruss())
        solveTruss(nextGenData[i])
        console.log(i)
    }
    
    thisGenData = nextGenData.sort(function(a, b){return (b.maxLoad / b.weight) - (a.maxLoad / a.weight)})
     
    //thisGenData = nextGenData.sort(function(a, b){return (b.maxLoad) - (a.maxLoad)})
    
    historicalData.push({
        bestTruss : thisGenData[0],
        medTruss : thisGenData[50],
        worstTruss : thisGenData[99]
    })
    
    chartData.push([historicalData.length, thisGenData[0].maxLoad / thisGenData[0].weight, thisGenData[50].maxLoad / thisGenData[50].weight, thisGenData[99].maxLoad / thisGenData[99].weight])
    
    updateInterface()
    drawChart()
}, 500)

var nextGen = function() {
    var i = 0
    
    nextGenData = []
    for (i = 0; i < 50; i++) {
        nextGenData.push(thisGenData[i])
    }

    for (i = 0; i < 50; i++) {
        nextGenData.push(mutateTruss(thisGenData[i]))
    }
    
    for (i = 0; i < 100; i++) {
        solveTruss(nextGenData[i])
    }
    
    //thisGenData = nextGenData.sort(function(a, b){return (b.maxLoad / b.weight) - (a.maxLoad / a.weight)})
    
    thisGenData = nextGenData.sort(function(a, b){return (b.maxLoad) - (a.maxLoad)})
    
    historicalData.push({
        bestTruss : thisGenData[0],
        medTruss : thisGenData[50],
        worstTruss : thisGenData[99]
    })
    
    $('#gencurrent').html(historicalData.length)
    $('#selectgen').attr({max : historicalData.length})
    
    $('#selectgen')[0].value = historicalData.length
    $('#selectgen').trigger("input")
    
    updateInterface()
    
    //chartData.push([historicalData.length, thisGenData[0].maxLoad / thisGenData[0].weight, thisGenData[50].maxLoad / thisGenData[50].weight, thisGenData[99].maxLoad / thisGenData[99].weight])
    
    chartData.push([historicalData.length, thisGenData[0].maxLoad, thisGenData[50].maxLoad, thisGenData[99].maxLoad])
    
    //console.log(thisGenData)
    
    if (autoProgress) {
        setTimeout(nextGen, 0)
    } else {
        drawChart()
    }
    
}

$('#selectgen').on("input", updateInterface)

//setViewedGen()

$('#evolvecontinuous').click(function() {
    autoProgress = !autoProgress
    
    if (autoProgress) {
        $('#evolvecontinuous p').html("Pause Evolution")
        $('#evolvecontinuous').addClass("activecontrol")
        $('#evolvecontinuous').removeClass("inactivecontrol")
        $('#evolvenext').addClass("disabledcontrol")
        $('#evolvenext').removeClass("enabledcontrol")
        nextGen()
    } else {
        $('#evolvecontinuous p').html("Continuously Evolve Gens")
        $('#evolvecontinuous').removeClass("activecontrol")
        $('#evolvecontinuous').addClass("inactivecontrol")
        $('#evolvenext').removeClass("disabledcontrol")
        $('#evolvenext').addClass("enabledcontrol")
        drawChart()
    }
    
})

$('#evolvenext').click(function() {
    if (!autoProgress) {
        nextGen()
    }
})