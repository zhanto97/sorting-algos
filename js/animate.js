var DEFAULT_COLOR = '#CCC9C1';
var COMPARE_COLOR = '#1800A3';
var NOSWAP_COLOR = DEFAULT_COLOR;
var SWAP_COLOR = '#9E2B25';
var RUNNING = false;

var TIMEOUT = null;
var CANVAS = null;
var ARRAY = null;
var COLORS = null;
var SORT_MAP = {
    1: bubble_sort,
    2: selection_sort,
    3: insertion_sort,
    4: merge_sort
};
var SORT_METHOD = merge_sort;


/*
TODO

Implement more sorting algorithms: quick sort, heapsort

Refactor code
*/

function initialize(){
    var sortDiv = document.getElementById("sort-div");
    var buttons = sortDiv.getElementsByTagName("BUTTON");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("sort-active");
            current[0].className = current[0].className.replace(" sort-active", "");
            this.className += " sort-active";
            stop_animation();
        });
    }

    CANVAS = document.getElementById('canvas-canvas');
    enhance_canvas_dpi(CANVAS);

    var size_slider = document.getElementById("size-slider-input");
    var size_slider_output = document.getElementById("size-slider-p");
    size_slider_output.innerHTML = "Number of blocks: " + size_slider.value;
    update_array(parseInt(size_slider.value));
    size_slider.oninput = function() {
        size_slider_output.innerHTML = "Number of blocks: " + size_slider.value;
        update_array(parseInt(size_slider.value));
    }

    var speed_slider = document.getElementById("speed-slider-input");
    var speed_slider_output = document.getElementById("speed-slider-p");
    speed_slider_output.innerHTML = "Animation speed: " + speed_slider.value + " ms";
    TIMEOUT = parseInt(speed_slider.value);
    speed_slider.oninput = function() {
        speed_slider_output.innerHTML = "Animation speed: " + speed_slider.value + " ms";
        TIMEOUT = parseInt(speed_slider.value);
    }

    document.getElementById("start-button").disabled = false;
    document.getElementById("start-button").style.color = 'black';
    document.getElementById("stop-button").disabled = true;
    document.getElementById("stop-button").style.color = '#CCC9C1';
}

function start_animation() {
    RUNNING = true;
    document.getElementById("start-button").disabled = true;
    document.getElementById("start-button").style.color = '#CCC9C1';
    document.getElementById("stop-button").disabled = false;
    document.getElementById("stop-button").style.color = 'black';
    SORT_METHOD(CANVAS, ARRAY, COLORS);
}

function stop_animation(){
    RUNNING = false;
    document.getElementById("start-button").disabled = false;
    document.getElementById("start-button").style.color = 'black';
    document.getElementById("stop-button").disabled = true;
    document.getElementById("stop-button").style.color = '#CCC9C1';
}

function choose_sort(id){
    SORT_METHOD = SORT_MAP[id];
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

async function merge_sort(canvas, array, colors){
    await _merge_sort(canvas, array, colors, 0, array.length - 1);
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