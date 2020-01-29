var App = {
    ranges: {
        in: {id: "#inhale-range", name: 'In', min: 1, max: 30, step: 1, infinity: false, borderColor: 'tomato', backColor: 'white'},
        inHold: {id: "#inhale-hold-range", name: "In\nHold", min: 1, max: 30, step: 1, infinity: false, borderColor: 'cyan', backColor: 'white'},
        out: {id: "#exhale-range", name: "Out", min: 1, max: 30, step: 1, infinity: false, borderColor: 'blue', backColor: 'white'},
        outHold: {id: "#exhale-hold-range", name: "Out\nHold", min: 1, max: 30, step: 1, infinity: false, borderColor: 'green', backColor: 'white'},
        duration: {id: "#duration-range", min: 1, max: 30, step: 1, infinity: true, borderColor: 'green', backColor: 'white'}
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
        // $('#timeline').text(Math.floor(time));
        var currentCycleDuration = (time % App.cycleDuration);
        var breathRanges = JSON.parse(JSON.stringify(App.ranges));
        delete(breathRanges.duration);
        $.each(breathRanges, function(rangeName, range) {
            if (range.value > currentCycleDuration) {
                // $('#currentAction').text(rangeName + ' ' + Math.round(currentCycleDuration / range.value * 100) + '%');
                App.drawCircle(range, currentCycleDuration / range.value);
                return false;
            } else {
                currentCycleDuration -= range.value;
            }
        });
    },
    drawCircle: function(range, percentage) {
        const fullPerimetr = 510;
        var svg = '<svg height="200" width="200" viewBox="0 0 200 200" style="transform: rotate(-0.25turn)">'+
                    '<g id="circles">'+
                        '<circle r="100" cx="100" cy="100" fill="' + range.backColor + '" />'+
                        '<circle r="80" cx="100" cy="100" fill="' + range.backColor + '"'+
                            ' stroke="' + range.borderColor + '"'+
                            ' stroke-width="40"'+
                            ' scale="2.0"' +
                            ' stroke-dasharray="' + fullPerimetr * percentage + ' ' + fullPerimetr + '" />'+
                            '<text x="50%"" y="50%" text-anchor="middle" transform="rotate(90 100,100)"  font-family="Arial, Helvetica, sans-serif" font-size="25px" dy=".3em">'+
                            range.name +
                            '</text>' +
                    '</g>' +
                    '</svg>';
        $('#svg').html(svg);
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
            App.interval = setInterval(App.tick, 40);
            App.tick();
        });
        $('#reset-counter').click(function() {
            App.startTime = null;
            clearInterval(App.interval);
            $('#timeline').text('00:00:00');
            $('#currentAction').text('');
            $('#svg').html('');
        });
    },
};

$(function() {
    App.init();
});
