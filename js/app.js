var App = {
    ranges: [
        {id: "#inhale-range", min: 1, max: 30, step: 1, infinity: false},
        {id: "#inhale-hold-range", min: 1, max: 30, step: 1, infinity: false},
        {id: "#exhale-range", min: 1, max: 30, step: 1, infinity: false},
        {id: "#exhale-hold-range", min: 1, max: 30, step: 1, infinity: false},
        {id: "#duration-range", min: 1, max: 30, step: 1, infinity: true}
    ],
    getHandleText: function (range, value) {
        return range.infinity && range.max == value ? '∞' : value;
    },
    getSliderHandle: function (slider) {
        const defaultHandleClass = '.ui-slider-handle';
        return $(slider).find(defaultHandleClass);
    },
    tick: function() {
        $('#timeline').text(App.getTimestamp() - App.startTime);
    },
    getTimestamp: function() {
        return Math.floor(Date.now() / 1000);
    },
    init: function() {
        App.ranges.forEach(function(range) {
            $(range.id).slider({
                orientation: "vertical",
                range: false,
                value: 10,
                min: range.min,
                max: range.max,
                step: range.step,
                create: function() {
                    var handleText = App.getHandleText(range, $(this).slider("value"));
                    App.getSliderHandle(this).text(handleText);
                },
                slide: function(event, ui) {
                    var handleText = App.getHandleText(range, ui.value);
                    App.getSliderHandle(this).text(handleText);
                },
            });
        });
        $('#start-stop-counter').click(function() {
            App.startTime = App.getTimestamp();
            App.interval = setInterval(App.tick, 1000);
            App.tick();
        });
        $('#reset-counter').click(function() {
            App.startTime = null;
            clearInterval(App.interval);
            $('#timeline').text('00:00:00');
        });
    },
};

$(function() {
    App.init();
});
