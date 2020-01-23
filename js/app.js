var ranges = [
    {id: "#inhale-range", min: 1, max: 30, step: 1, infinity: false},
    {id: "#inhale-hold-range", min: 0, max: 60, step: 1, infinity: false},
    {id: "#exhale-range", min: 1, max: 30, step: 1, infinity: false},
    {id: "#exhale-hold-range", min: 0, max: 60, step: 1, infinity: false},
    {id: "#duration-range", min: 1, max: 30, step: 1, infinity: true}
];

var getHandleText = function (range, value) {
    return range.infinity && range.max == value ? '∞' : value;
};

var getSliderHandle = function (slider) {
    const defaultHandleClass = '.ui-slider-handle';
    return $(slider).find(defaultHandleClass);
};

$(function() {
    ranges.forEach(function(range) {
        $(range.id).slider({
            orientation: "vertical",
            range: false,
            value: 10,
            min: range.min,
            max: range.max,
            step: range.step,
            create: function() {
                var handleText = getHandleText(range, $(this).slider("value"));
                getSliderHandle(this).text(handleText);
            },
            slide: function(event, ui) {
                var handleText = getHandleText(range, ui.value);
                getSliderHandle(this).text(handleText);
            },
        });
    });
});
