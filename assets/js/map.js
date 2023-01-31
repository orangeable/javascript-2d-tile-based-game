// map:
const Map = function(title) {
    this.data = {};
    this.tiles = [];
    this.timer = setInterval("map.frame()", 750);

    this.load(title);
};


Map.prototype = {
    load: function(title) {
        LoadURL("assets/json/" + title.toString().toLowerCase() + ".json", function(result) {
            map.data = JSON.parse(result);
            map.data.frame = 0;
            
            let init = false;
            let loaded = 0;
            
            for (let i = 0; i < map.data.assets.length; i++) {
                map.tiles.push(new Image());
                map.tiles[i].src = "assets/img/tile/" + map.data.assets[i].file_name + ".png?v=" + new Date().getTime();
                
                map.tiles[i].onload = function() {
                    loaded++;
                    
                    if (!init && loaded == map.data.assets.length) {
                        init = true;

                        Loop();
                    }
                };
            }
        });
    },
    draw: function() {
        let x_min = Math.floor(viewport.x / config.size.tile);
        let y_min = Math.floor(viewport.y / config.size.tile);
        let x_max = Math.ceil((viewport.x + viewport.w) / config.size.tile);
        let y_max = Math.ceil((viewport.y + viewport.h) / config.size.tile);

        if (x_min < 0) { x_min = 0; }
        if (y_min < 0) { y_min = 0; }
        if (x_max > map.width) { x_max = map.width; }
        if (y_max > map.height) { y_max = map.height; }

        for (let y = y_min; y < y_max; y++) {
            for (let x = x_min; x < x_max; x++) {
                let value  = this.data.layout[y][x] - 1;
                let tile_x = Math.floor((x * config.size.tile) - viewport.x + (config.win.width / 2) - (viewport.w / 2));
                let tile_y = Math.floor((y * config.size.tile) - viewport.y + (config.win.height / 2) - (viewport.h / 2));

                if (value > -1) {
                    let frame = this.data.frame;

                    if (frame > this.data.assets[value].frames) {
                        frame = 0;
                    }

                    context.drawImage(
                        map.tiles[value],
                        frame * config.size.tile,
                        0,
                        config.size.tile,
                        config.size.tile,
                        tile_x,
                        tile_y,
                        config.size.tile,
                        config.size.tile
                    );
                }
            }
        }
    },
    frame: function() {
        this.data.frame = (this.data.frame == 0) ? 1 : 0;
    }
};
