function setTileHeight() {
    var tiles = $(".board-tile");
    tiles.css("height", tiles.children().eq(0).width());

    //console.log(tiles.parent().width(), tiles.eq(0).outerWidth(), tiles.parent().css("width"));
    //$(".board-tile:nth-child(3n+3)").css("width", (tiles.parent().width()-2*tiles.eq(0).outerWidth()-0.5)+"px");
}

$(document).ready(function() {
    $(window).on("resize", setTileHeight);
    setTileHeight();
});