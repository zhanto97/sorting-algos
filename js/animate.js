var TIMEOUT = 500;
var DEFAULT_COLOR = '#d3d3d3';
var COMPARE_COLOR = '#00f';
var NOSWAP_COLOR = '#0f0';
var SWAP_COLOR = '#f00';
var RUNNING = false;

var CANVAS = null;
var SLIDER = null;
var SLIDER_OUTPUT = null;
var ARRAY = null;
var COLORS = null;


/*
TODO

Implement more sorting algorithms: quick sort 
Add buttons to let user choose algorithm
Add button (slider?) to let person choose animation speed (50 - 500)

Add general CSS for all buttons and sliders

Refactor code
*/

function initialize(){
    CANVAS = document.getElementById('canvas-canvas');
    SLIDER = document.getElementById("slider-input");
    SLIDER_OUTPUT = document.getElementById("demo");

    enhance_canvas_dpi(CANVAS);

    document.getElementById("start-button").disabled = false;
    document.getElementById("stop-button").disabled = true;

    SLIDER_OUTPUT.innerHTML = SLIDER.value;
    update_array(parseInt(SLIDER.value));

    SLIDER.oninput = function() {
        SLIDER_OUTPUT.innerHTML = SLIDER.value;
        update_array(parseInt(SLIDER.value));
    }
}

function start_animation() {
    RUNNING = true;
    document.getElementById("start-button").disabled = true;
    document.getElementById("stop-button").disabled = false;
    // bubble_sort(CANVAS, ARRAY, COLORS);
    // selection_sort(CANVAS, ARRAY, COLORS);
    // insertion_sort(CANVAS, ARRAY, COLORS);
    merge_sort(CANVAS, ARRAY, COLORS, 0, ARRAY.length - 1);
}

function stop_animation(){
    RUNNING = false;
    document.getElementById("start-button").disabled = false;
    document.getElementById("stop-button").disabled = true;
}

async function bubble_sort(canvas, array, colors) {
    var len = array.length, toSwap;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - i - 1; j++) {
            toSwap = await compare(canvas, array, colors, j, j + 1);
            if (toSwap)
                await swap(canvas, array, colors, j, j + 1);
            else
                await no_swap(canvas, array, colors, j, j + 1);

            if (!RUNNING)
                return draw_bars(canvas, array, colors);
        }
        if (!RUNNING)
            return draw_bars(canvas, array, colors);
    }
    stop_animation();
    draw_bars(canvas, array, colors);
}

async function selection_sort(canvas, array, colors) {
    var len = array.length, min, cmp;
    for (var i = 0; i < len - 1; i++) {
        min = i;
        for (var j = i + 1; j < len; j++) {
            cmp = await compare(canvas, array, colors, min, j);

            if (cmp)
                min = j;

            if (!RUNNING)
                return draw_bars(canvas, array, colors);
        }
        await swap(canvas, array, colors, i, min);

        if (!RUNNING)
            return draw_bars(canvas, array, colors);
    }
    stop_animation();
    draw_bars(canvas, array, colors);
}

async function insertion_sort(canvas, array, colors) {
    var len = array.length, cmp;
    for (var i = 1; i < len; i++) {
        for (var j = i; j > 0; j--) {
            cmp = await compare(canvas, array, colors, j - 1, j);
            if (!cmp)
                break;

            await swap(canvas, array, colors, j - 1, j);
            if (!RUNNING)
                return draw_bars(canvas, array, colors);
        }
        if (!RUNNING)
            return draw_bars(canvas, array, colors);
    }
    stop_animation();
    draw_bars(canvas, array, colors);
}

async function merge_sort(canvas, array, colors, first, last){
    await _merge_sort(canvas, array, colors, first, last);
    stop_animation();
    draw_bars(canvas, array, colors);
}

async function _merge_sort(canvas, array, colors, first, last) {
    async function merge(canvas, array, colors, first, mid, last){
        var order = [];
        var left = first, right = mid + 1, cmp;
        while (left <= mid && right <= last){
            if (!RUNNING)
                return draw_bars(canvas, array, colors);

            cmp = await compare(canvas, array, colors, left, right);
            if (cmp)
                order.push(right++);
            else 
                order.push(left++);
        }

        while (left <= mid)
            order.push(left++);
        while (right <= last)
            order.push(right++)
        
        var cpy = [...order], index, temp;
        cpy.sort(function(a, b){ return a - b });

        for (var i = 0; i < order.length; i++){
            if (!RUNNING)
                return draw_bars(canvas, array, colors);
            if (order[i] != cpy[i]){
                index = cpy.indexOf(order[i], i + 1);
                temp = cpy[i];
                cpy[i] = cpy[index];
                cpy[index] = temp;
                await swap(canvas, array, colors, i + first, index + first);
            }
        }
    }
    if (first >= last)
        return;

    var mid = Math.floor((first + last) / 2);
    await _merge_sort(canvas, array, colors, first, mid);
    if (!RUNNING)
        return draw_bars(canvas, array, colors);
    await _merge_sort(canvas, array, colors, mid + 1, last);
    if (!RUNNING)
        return draw_bars(canvas, array, colors);
    await merge(canvas, array, colors, first, mid, last);
}

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