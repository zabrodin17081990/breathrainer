var App = {
    ranges: {
        in: {id: "#inhale-range", name: 'In', min: 1, max: 30, step: 1, infinity: false, borderColor: 'tomato', backColor: 'white', value: 5, direction: 1},
        inHold: {id: "#inhale-hold-range", name: "In\nHold", min: 1, max: 30, step: 1, infinity: false, borderColor: 'cyan', backColor: 'white', value: 5, direction: true},
        out: {id: "#exhale-range", name: "Out", min: 1, max: 30, step: 1, infinity: false, borderColor: 'blue', backColor: 'white', value: 5, direction: -1},
        outHold: {id: "#exhale-hold-range", name: "Out\nHold", min: 1, max: 30, step: 1, infinity: false, borderColor: 'green', backColor: 'white', value: 5, direction: false},
        duration: {id: "#duration-range", min: 1, max: 30, step: 1, infinity: true, borderColor: 'green', backColor: 'white', value: 5}
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
        var breathRanges = JSON.parse(window.localStorage.ranges);
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
        var svgVars = App.calculateSVGVars(range, percentage);
        var svg = '<svg height="200" width="200" viewBox="0 0 200 200" style="transform: rotate(-0.25turn)">'+
                    '<g id="circles">'+
                        '<circle r="' + svgVars.bigCircleR + '" cx="100" cy="100" fill="' + range.backColor + '" />'+
                        '<circle r="' + svgVars.smallCircleR + '" cx="100" cy="100" fill="' + range.backColor + '"'+
                            ' stroke="' + range.borderColor + '"'+
                            ' stroke-width="' + svgVars.strokeWidth + '"'+
                            ' scale="2.0"' +
                            ' stroke-dasharray="' + svgVars.strokePerimetr + ' ' + svgVars.maxPerimetr + '" />'+
                            '<text x="50%"" y="50%" text-anchor="middle" transform="rotate(90 100,100)"  font-family="Arial, Helvetica, sans-serif" font-size="25px" dy=".3em">'+
                            range.name +
                            '</text>' +
                    '</g>' +
                    '</svg>';
        $('#svg').html(svg);
    },
    calculateSVGVars: function(range, percentage) {
        var svgVars = {};
        var svgConsts = {
            bigCircleR: { l: 80, diff: 20 },
            smallCircleR: { l: 70, diff: 10 },
            strokeWidth: { l: 20, diff: 20 },
            strokePerimetr: { l: 440, diff: 62 }
        };
        $.each(svgConsts, function(constName, value) {
            svgVars[constName] = (constName == 'strokePerimetr') ? value.l * percentage : value.l;

            if (typeof(range.direction) == 'number') {
                    svgVars[constName] += value.diff * percentage * range.direction;
            } else {
                if (range.direction) {
                    svgVars[constName] += value.diff;
                }
            }
            switch(range.direction) {
                case 1:
                    svgVars[constName] = (constName == 'strokePerimetr') ? value.l * percentage : value.l;
                    svgVars[constName] += value.diff * percentage;
                    break;
                case -1:
                    svgVars[constName] = (constName == 'strokePerimetr') ? value.l * percentage : value.l;
                    svgVars[constName] += value.diff - value.diff * percentage;
                    break;
                case true:
                    svgVars[constName] = (constName == 'strokePerimetr') ? (value.l + value.diff) * percentage : (value.l + value.diff);
                    break;
                case false:
                    svgVars[constName] = (constName == 'strokePerimetr') ? value.l * percentage : value.l;
                    break;
            }
        });
        svgVars.maxPerimetr = svgConsts.strokePerimetr.l + svgConsts.strokePerimetr.diff;
        return svgVars;
    },
    calculateCycleDuration: function() {
        var ranges = JSON.parse(window.localStorage.ranges);
        App.cycleDuration = 
            ranges.in.value +
            ranges.inHold.value +
            ranges.out.value +
            ranges.outHold.value;
    },
    init: function() {
        App.loadSettings();
        App.bindActions();
    },
    bindActions: function() {
        App.initSliders();
        App.bindStartButton();
        App.bindResetButton();
    },
    initSliders: function() {
        var ranges = JSON.parse(window.localStorage.ranges);
        $.each(ranges, function(rangeName, range) {
            $(range.id).slider({
                orientation: "vertical",
                range: false,
                value: range.value,
                min: range.min,
                max: range.max,
                step: range.step,
                create: function() {
                    var ranges = JSON.parse(window.localStorage.ranges);
                    var handleText = App.getHandleText(range, ranges[rangeName].value);
                    App.getSliderHandle(this).text(handleText);
                },
                slide: function(event, ui) {
                    var ranges = JSON.parse(window.localStorage.ranges);
                    ranges[rangeName].value = ui.value;
                    window.localStorage.ranges = JSON.stringify(ranges);
                    var handleText = App.getHandleText(range, ranges[rangeName].value);
                    App.getSliderHandle(this).text(handleText);
                    App.calculateCycleDuration();
                },
                change: function(event, ui) {
                    var ranges = JSON.parse(window.localStorage.ranges);
                    ranges[rangeName].value = $(this).slider("value");
                    window.localStorage.ranges = JSON.stringify(ranges);
                    var handleText = App.getHandleText(range, ranges[rangeName].value);
                    App.getSliderHandle(this).text(handleText);
                    App.calculateCycleDuration();
                },
            });
        });
    },
    bindStartButton: function() {
        $('#start-stop-counter').click(function() {
            clearInterval(App.interval);
            App.calculateCycleDuration();
            App.startTime = Date.now();
            App.interval = setInterval(App.tick, 40);
            App.tick();
        });
    },
    bindResetButton: function() {
        $('#reset-counter').click(function() {
            App.startTime = null;
            clearInterval(App.interval);
            $('#timeline').text('00:00:00');
            $('#currentAction').text('');
            $('#svg').html('');
        });
    },
    loadSettings: function() {
        if (typeof(Storage) !== "undefined") {
            try {
                JSON.parse(window.localStorage.ranges)
            } catch {
                window.localStorage.ranges = JSON.stringify(App.ranges);
            }
        } else {
            console.log('localStorage is not supported');
        }
    }
};

$(function() {
    App.init();
});
