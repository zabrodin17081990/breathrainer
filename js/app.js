var ranges = [
    "#inhale-range",
    "#inhale-hold-range",
    "#exhale-range",
    "#exhale-hold-range",
    "#time-range"
];

$(function() {
    ranges.forEach(function(rangeName) {
        $(rangeName).slider({
            orientation: "vertical",
            range: false,
            value: 50,
            create: function() {
                $(this).find('.ui-slider-handle').text($(this).slider("value"));
            },
            slide: function(event, ui) {
                $(this).find('.ui-slider-handle').text(ui.value);
            },
        });
    });
});
