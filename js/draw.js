function draw_bars(canvas, array, colors){
    var len = array.length;

    // Bars are RATIO times wider than empty spaces between them
    var ratio = 2;
    var space_width = canvas.width / (ratio * len + len + 1);
    var bar_width = space_width * ratio;

    // Clear canvas
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars representing numbers
    var x, y;
    for (var i = 0; i < array.length; i++) {
        x = space_width + i*(space_width + bar_width);
        y = (array[i] / array.length) * canvas.height;

        context.fillStyle = colors[i];
        context.fillRect(x, canvas.height - y, bar_width, canvas.height);
    }
}

async function compare(canvas, array, colors, i, j) {
    colors[i] = COMPARE_COLOR;
    colors[j] = COMPARE_COLOR;
    draw_bars(canvas, array, colors);

    await timeout(TIMEOUT);

    colors[i] = DEFAULT_COLOR;
    colors[j] = DEFAULT_COLOR;
    return array[i] > array[j];
}

async function swap(canvas, array, colors, i, j){
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    colors[i] = SWAP_COLOR;
    colors[j] = SWAP_COLOR;
    draw_bars(canvas, array, colors);

    await timeout(TIMEOUT);

    colors[i] = DEFAULT_COLOR;
    colors[j] = DEFAULT_COLOR;
}

async function no_swap(canvas, array, colors, i, j){
    colors[i] = NOSWAP_COLOR;
    colors[j] = NOSWAP_COLOR;
    draw_bars(canvas, array, colors);

    await timeout(TIMEOUT);

    colors[i] = DEFAULT_COLOR;
    colors[j] = DEFAULT_COLOR;
}

function update_array(n) {
    ARRAY = create_array(n);
    COLORS = Array(n).fill(DEFAULT_COLOR);
    draw_bars(CANVAS, ARRAY, COLORS);
}

function shuffle_nums() {
    shuffle(ARRAY);
    draw_bars(CANVAS, ARRAY, COLORS);
}