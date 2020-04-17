/*
 * Shuffles array in-place
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}

/*
 * Fixes the blurriness of image on canvas
 */
function enhance_canvas_dpi(canvas) {
    var dpi = window.devicePixelRatio;
    var style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    var style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
}

/*
 * Promise based wrapper for setTimeout
 */
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 * Create a shuffled array of size n
 */
function create_array(n) {
    var arr = Array.from(Array(n).keys()).map(x => x+1);
    shuffle(arr);
    return arr;
}