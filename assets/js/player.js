// player:
const Player = function(tile_x, tile_y) {
    this.timer = setInterval("player.frame()", 125);
    this.frames = [0.40, 0.42, 0.44, 0.46, 0.48, 0.50, 0.48, 0.46, 0.44, 0.42, 0.40];
    
    this.sprite = new Image();
    this.sprite.src = "assets/img/char/hero.png";

    this.movement = {
        moving: false,
        key: 40,
        frame: 1
    };
    this.pos = {
        x: config.size.tile * tile_x,
        y: config.size.tile * tile_y
    };
    this.tile = {
        x: tile_x,
        y: tile_y
    };
    this.torch = {
        lit: false,
        frame: 0
    };
};


Player.prototype = {
    draw: function() {
        let frame = (player.movement.moving) ? keys[player.movement.key].f[player.movement.frame] : keys[player.movement.key].f[1];
        let pos_x = Math.round(player.pos.x - viewport.x + (config.win.width / 2) - (viewport.w / 2));
        let pos_y = Math.round(player.pos.y - viewport.y + (config.win.height / 2) - (viewport.h / 2));

        this.light(pos_x, pos_y);
        this.torch_func(pos_x, pos_y);
        
        context.drawImage(
            this.sprite,
            frame * config.size.char,
            0,
            config.size.char,
            config.size.char,
            pos_x,
            pos_y,
            config.size.char,
            config.size.char
        );
    },
    light: function(pos_x, pos_y) {
        let light_x = pos_x + (config.size.tile / 2);
        let light_y = pos_y + (config.size.tile / 2);

        let radius = 100;
        let radialGradient = context.createRadialGradient(light_x, light_y, 0, light_x, light_y, radius);

        radialGradient.addColorStop(0, "rgba(238, 229, 171, 0.325)");
        radialGradient.addColorStop(1, "rgba(238, 229, 171, 0)");

        context.fillStyle = radialGradient;
        context.arc(light_x, light_y, radius, 0, Math.PI * 2);
        context.fill();
    },
    torch_func: function(pos_x, pos_y) {
        if (this.torch.lit) {
            for (let y = 0; y < config.tiles.y; y++) {
                for (let x = 0; x < config.tiles.x; x++) {
                    let distance = Math.sqrt((Math.pow(x - config.center.x, 2)) + (Math.pow(y - config.center.y, 2)));
                    let opacity = (distance / 4) - this.frames[this.torch.frame];

                    context.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                    context.fillRect((x * config.size.tile) - (config.size.tile / 2), (y * config.size.tile) - (config.size.tile / 2), config.size.tile, config.size.tile);
                }
            }
        }
    },
    frame: function() {
        this.movement.frame++;

        if (this.movement.frame == 4) {
            this.movement.frame = 0;
        }

        this.torch.frame++;

        if (this.torch.frame == this.frames.length) {
            this.torch.frame = 0;
        }

        player.movement.frame = this.movement.frame;
        player.torch = this.torch;
    },
    move: function(x, y) {
        let pos = {
            x: Math.ceil(this.pos.x / config.size.tile),
            y: Math.ceil(this.pos.y / config.size.tile)
        };

        let new_pos = {
            x: Math.ceil((this.pos.x + x) / config.size.tile),
            y: Math.ceil((this.pos.y + y) / config.size.tile)
        };

        for (let i = 0; i <= 1; i++) {
            let tile = ((i == 0) ? map.data.layout[pos.y][new_pos.x] : map.data.layout[new_pos.y][pos.x]) - 1;
            let collision = map.data.assets[tile].collision;

            if (!collision) {
                if (i == 0) {
                    this.pos.x += x;
                    this.tile.x = new_pos.x;
                }
                else {
                    this.pos.y += y;
                    this.tile.y = new_pos.y;
                }
            }
        }

        player = this;

        Log("coords", "Coords: " + this.tile.x + ", " + this.tile.y);
    }
};


// player movement start:
document.addEventListener("keydown", function(event) {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        player.movement.moving = true;
        player.movement.key = event.keyCode;

        for (let key in keys) {
            if (key == event.keyCode) {
                keys[key].a = true;
            }
        }
    }
    else {
        switch (event.keyCode) {
            case 84: // t
                player.torch.lit = (player.torch.lit) ? false : true;
                break;
        }
    }
});


// player movement end:
document.addEventListener("keyup", function(event) {
    let found = false;

    for (let key in keys) {
        if (key == event.keyCode) {
            keys[key].a = false;
        }
    }

    for (let key in keys) {
        if (keys[key].a) {
            player.movement.key = key;
            found = true;
        }
    }

    if (!found) {
        player.movement.moving = false;
    }
});
