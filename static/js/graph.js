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

    function isLegendary(dimension, legendaries) {
        return dimension.group().reduce(
            function (p, v) {
                p.total++;
                if (v.legendaries == legendaries){
                    p.match++;
                }
                return p;
            },
            function (p, v) {
                p.total--;
                if (v.legendaries == legendaries){
                    p.match--;
                }
                return p;
            },
            function () {
                return {total: 0, match: 0}
            }
        );
    }

    var dim = ndx.dimension(dc.pluck("type"));
    var legendaryFalse = isLegendary(dim, "False");
    var legendaryTrue = isLegendary(dim, "True");
    
    dc.barChart("#legendary-gen")
        .width(1000)
        .height(300)
        .dimension(dim)
        .group(legendaryFalse)
        .stack(legendaryTrue)
        .valueAccessor(function (d) {
            if(d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            } else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({top:10, right: 100, bottom:30, left:50});
}