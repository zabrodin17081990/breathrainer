var App = {
    ranges: {
        in: {id: "#inhale-range", min: 1, max: 30, step: 1, infinity: false},
        inHold: {id: "#inhale-hold-range", min: 1, max: 30, step: 1, infinity: false},
        out: {id: "#exhale-range", min: 1, max: 30, step: 1, infinity: false},
        outHold: {id: "#exhale-hold-range", min: 1, max: 30, step: 1, infinity: false},
        duration: {id: "#duration-range", min: 1, max: 30, step: 1, infinity: true}
    },
    getHandleText: function (range, value) {
        return range.infinity && range.max == value ? '∞' : value;
    },
    getSliderHandle: function (slider) {
        const defaultHandleClass = '.ui-slider-handle';
        return $(slider).find(defaultHandleClass);
    },
    tick: function() {
        var time = (Date.now() - App.startTime) / 1000;
        $('#timeline').text(Math.floor(time));
        var currentCycleDuration = (time % App.cycleDuration);
        var breathRanges = JSON.parse(JSON.stringify(App.ranges));
        delete(breathRanges.duration);
        $.each(breathRanges, function(rangeName, range) {
            if (range.value > currentCycleDuration) {
                $('#currentAction').text(rangeName + ' ' + Math.round(currentCycleDuration / range.value * 100) + '%');
                return false;
            } else {
                currentCycleDuration -= range.value;
            }
        });
    },
    calculateCycleDuration: function() {
        App.cycleDuration = 
            App.ranges.in.value +
            App.ranges.inHold.value +
            App.ranges.out.value +
            App.ranges.outHold.value;            
    },
    init: function() {
        $.each(App.ranges, function(rangeName, range) {
            $(range.id).slider({
                orientation: "vertical",
                range: false,
                value: 10,
                min: range.min,
                max: range.max,
                step: range.step,
                create: function() {
                    App.ranges[rangeName].value = $(this).slider("value");
                    var handleText = App.getHandleText(range, App.ranges[rangeName].value);
                    App.getSliderHandle(this).text(handleText);
                },
                slide: function(event, ui) {
                    var handleText = App.getHandleText(range, ui.value);
                    App.getSliderHandle(this).text(handleText);
                },
                change: function(event, ui) {
                    App.ranges[rangeName].value = $(this).slider("value");
                    var handleText = App.getHandleText(range, App.ranges[rangeName].value);
                    App.getSliderHandle(this).text(handleText);
                    App.calculateCycleDuration();
                },
            });
        });
        $('#start-stop-counter').click(function() {
            clearInterval(App.interval);
            App.calculateCycleDuration();
            App.startTime = Date.now();
            App.interval = setInterval(App.tick, 100);
            App.tick();
        });
        $('#reset-counter').click(function() {
            App.startTime = null;
            clearInterval(App.interval);
            $('#timeline').text('00:00:00');
            $('#currentAction').text('');
        });
    },
};

$(function() {
    App.init();
});
