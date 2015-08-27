function setTileHeight() {
    var tiles = $(".board-tile");
    tiles.css("height", tiles.children().eq(0).width());
}

$(document).ready(function() {
    $(window).on("resize", setTileHeight);
    setTileHeight();
});