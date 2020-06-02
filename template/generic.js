$('.x_title').on('click', function () {
    var $BOX_PANEL = $(this).closest('.x_panel'),
        $ICON = $(this).find('.collapse-link i'),
        $BOX_CONTENT = $BOX_PANEL.find('.x_content');

    if ($BOX_PANEL.attr('style')) {
        $BOX_CONTENT.slideToggle(200, function () {
            $BOX_PANEL.removeAttr('style');
        });
    } else {
        $BOX_CONTENT.slideToggle(200);
        $BOX_PANEL.css('height', 'auto');
    }

    $ICON.toggleClass('fa-chevron-up fa-chevron-down');
});

$('body').tooltip({
    selector: '[data-toggle="tooltip"]'
});

$('#controls-table_filter input').on('keyup', () => {
    window.history.replaceState({}, '', `${location.pathname}?search=${this.val()}`);
})

// Pre-populate or clear Search
$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var searchFilter = urlParams.get('control');
    if (searchFilter == null || searchFilter == "") {
        $('#controls-table_filter input').val(searchFilter).keyup();
        $('#filter-enabled').css('display', 'none');
        // clear out params in address bar
        console.log("Clearing " + window.location.search.toString())
        urlParams.delete(window.location.search);
        window.history.replaceState({}, '', `${location.pathname}`);
    } else {
        $('#controls-table_filter input').val(searchFilter).keyup();
        $('#filter-enabled').css('display', 'inherit');
    }
});
