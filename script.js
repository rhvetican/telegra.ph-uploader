$(document).ready(function() {
    $('#upload-form').on('submit', function(e) {
        e.preventDefault();

        // Show the spinning SVG
        $('#loading-svg').show();

        $.ajax({
            url: '/upload',
            type: 'post',
            data: $(this).serialize(),
            success: function(data) {
                // Hide the spinning SVG
                $('#loading-svg').hide();

                // Display the result
                $('#result').html('<input id="upload-url" type="text" class="form-control" value="' + data + '" readonly onclick="this.select();">').hide().fadeIn();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Hide the spinning SVG
                $('#loading-svg').hide();

                // Display the error message
                $('#result').text('Error: ' + errorThrown);
            }
        });
    });

    $(document).on('click', '#upload-url', function() {
        this.select();
        document.execCommand('copy');
    });
});
