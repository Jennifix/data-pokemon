queue()
    .defer(d3.csv, "data/pokemon.csv")
    .await(makeGraphs);

function makeGraphs(error, pokemonData) {

    var ndx = crossfilter(pokemonData);

    typeGen(ndx);
    attackType(ndx);
    speedType(ndx);


    dc.renderAll();
}

function typeGen(ndx) {

    var type_1_dim = ndx.dimension(dc.pluck('Type 1'));

    var type_per_gen = type_1_dim.group().reduceSum(dc.pluck('Generation'));

    dc.pieChart('#type-per-gen')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(type_1_dim)
        .group(type_per_gen);
}

function attackType(ndx) {

    var type_1_dim = ndx.dimension(dc.pluck('Type 1'));

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

    var type_1_dim = ndx.dimension(dc.pluck('Type 1'));

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