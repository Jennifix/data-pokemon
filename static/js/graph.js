queue()
    .defer(d3.csv, "data/pokemon.csv")
    .await(makeGraphs);

function makeGraphs(error, pokemonData) {

    var ndx = crossfilter(pokemonData);

    typeGen(ndx);
    typeNum(ndx);
    attackType(ndx);
    speedType(ndx);
    legendaryByGen(ndx);


    dc.renderAll();
}

function typeGen(ndx) {

    var type_1_dim = ndx.dimension(dc.pluck('type'));

    var type_per_gen = type_1_dim.group().reduceSum(dc.pluck('Generation'));

    dc.pieChart('#type-per-gen')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(type_1_dim)
        .group(type_per_gen);
}

function typeNum(ndx) {

    var type_1_dim = ndx.dimension(dc.pluck('type'));

    var type_per_num = type_1_dim.group().reduceSum(dc.pluck('#'));

    dc.pieChart('#type-per-num')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(type_1_dim)
        .group(type_per_num);
}

function attackType(ndx) {

    var type_1_dim = ndx.dimension(dc.pluck('type'));

    var attack_per_type = type_1_dim.group().reduceSum(dc.pluck('Attack'));

    dc.barChart("#attack-type")
        .width(1000)
        .height(150)
        .margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
        })
        .dimension(type_1_dim)
        .group(attack_per_type)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Type")
        .yAxisLabel("Attack")
        .yAxis().ticks(4);

}

function speedType(ndx) {

    var type_1_dim = ndx.dimension(dc.pluck('type'));

    var speed_per_type = type_1_dim.group().reduceSum(dc.pluck('Speed'));

    dc.barChart("#speed-type")
    .width(1000)
    .height(150)
    .margins({
        top: 10,
        right: 50,
        bottom: 30,
        left: 50
    })
    .dimension(type_1_dim)
    .group(speed_per_type)
    .transitionDuration(1500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Type")
    .yAxisLabel("Speed")
    .yAxis().ticks(4);

}

function legendaryByGen(ndx) {

var type_dim = ndx.dimension(dc.pluck('type'));

var legendByTypeFalse = type_dim.group().reduceSum(dc.pluck('legendaries'));

var legendByTypeTrue = type_dim.group().reduceSum(function (d) {
    if (d.legendaries === "True") {
        return +d.spend;
    } else {
        return 0;
    }
});

var stackedChart = dc.barChart("#legendary-gen");
stackedChart
    .width(1000)
    .height(500)
    .dimension(type_dim)
    .group(legendByTypeFalse, "Store A")
    .stack(legendByTypeTrue, "Store B")
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5));
stackedChart.margins().right = 100;

}   