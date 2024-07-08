export const BOARD_WIDTH = 12; // numbers of blocks horizontally
export const BOARD_HEIGHT = 20; // numbers of blocks vertically
export const BLOCK_SIZE = 30; // size of each block in pixels

// tetris shapes and colors
export const SHAPES = [
    [
        [1, 1, 1, 1], // line shape
    ],
    [
        [1, 1], // square shape
        [1, 1],
    ],
    [
        [0, 1, 0], // T shape
        [1, 1, 1],
    ],
    [
        [0, 1, 1], // reverse z shape
        [1, 1, 0],
    ],
    [
        [1, 1, 0], // z shape
        [0, 1, 1],
    ],
    [
        [1, 0, 0], // reverse L shape
        [1, 1, 1],
    ],
    [
        [0, 0, 1], // L shape
        [1, 1, 1],
    ],
];

export const COLORS = [
    0x00ffff, // cyan
    0xffff00, // yellow
    0xff00ff, // magenta
    0x00ff00, // green
    0xff0000, // red
    0x0000ff, // blue
    0xffa500, // orange
];