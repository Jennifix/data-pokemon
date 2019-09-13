queue()
    .defer(d3.csv, "data/pokemon.csv")
    .await(makeGraphs);

function makeGraphs(error, pokemonData) {

    var ndx = crossfilter(pokemonData);

    type_gen(ndx);


    dc.renderAll();
}

function type_gen(ndx) {

    var type_1_dim = ndx.dimension(dc.pluck('Type 1'));

    var type_per_gen = type_1_dim.group().reduceSum(dc.pluck('Generation'));

    dc.pieChart('#type-per-gen')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(type_1_dim)
        .group(type_per_gen);
}

