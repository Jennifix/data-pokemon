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

    var parseDate = d3.time.format("%d/%m/%Y").parse;
    pokemonData.forEach(function(d) {
        d.Generation = parseDate(d.Generation);
    });

    var gen_dim = ndx.dimension(function(d){
        return d.Generation;
    });

    var min_gen = gen_dim.bottom(1)[0].Generation;
    var max_gen = gen_dim.top(1)[0].Generation;

    var legendary_dim = ndx.dimension(function(d) {
        return [d.Generation, d.Legendary]
    });

    var legendary_group = legendary_dim.group();
    var legendary_chart = dc.scatterPlot("#legendary-gen");

    legendary_chart
        .width(1000)
        .height(150)
        .x(d3.time.scale().domain([min_gen, max_gen]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .yAxisLabel("Legendary")
        .dimension(legendary_dim)
        .group(legendary_group);
}

