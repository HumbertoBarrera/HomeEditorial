insertShared();

function insertShared() {
    $(function () {
        $("#headerArea").load("/nav.html");
        $("#footer").load("/footer.html");
        $.get('/head.html', function (response) {
            $('head').append(response);
        });
    });
}