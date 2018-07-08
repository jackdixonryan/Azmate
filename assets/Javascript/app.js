$(document).ready(function() {

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation not found.")
        }
    }

    function showPosition(position) {
        console.log("Latitude: " + position.coords.latitude)
        console.log("Longitude: " + position.coords.longitude);
        $("#latitude").val(position.coords.latitude);
        $("#longitude").val(position.coords.longitude);
    }

    getLocation();

    $("#submit").click(function(){

        $("#results").empty();


        var apiKey = "0b79b2ee11aa4ce48b5c427405d7a9c4";

        var latitude = $("#latitude").val();
        var longitude= $("#longitude").val();

        var queryUrl = "https://api.breezometer.com/baqi/?lat=" + latitude + "&lon=" + longitude + "&key=" + apiKey;

        console.log(queryUrl);
        
        var queryUrlMaps = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyAYzoIRl5Tr3t23pkaQYWe2KVKYO0FE4ck";

        console.log(queryUrlMaps);

        var location; 

    
        $.ajax({
            url: queryUrl,
            method: "GET",
        }).then(function(results) {
            console.log("Successful Get.")
            console.log(results.breezometer_description);

            var jumbotron = $("<div class='jumbotron'>");
            $(jumbotron).css("background-color", results.breezometer_color);

            $.ajax({
                url: queryUrlMaps,
                method: "GET",
            }).then(function(mapResults) {
                console.log("Successful Maps Get.");
                location = mapResults.results[0].address_components.filter(function(component) {
                    return component.types.includes("locality");
                })[0].long_name;
                console.log(location);
                var heading = $("<h1>");
                $(heading).addClass("display-3");
                $(heading).text(location);
                $(jumbotron).append(heading);
            });

            var info = $("<p>");
            $(info).addClass("lead");
            $(info).text(results.breezometer_description);

            $(jumbotron).append(info);
            $("#results").append(jumbotron);

            var warningCard = $("<div>")
            warningCard.addClass("card");
            var cardIcon = $("<h3>")
            cardIcon.addClass("card-title text-warning");
            cardIcon.html("<i class='fas fa-exclamation-triangle'></i>");
            warningCard.append(cardIcon);

            var cardName = $("<h3>");
            cardName.addClass("card-title text-warning");
            cardName.text(results.dominant_pollutant_description);
            warningCard.append(cardName);

            var cardContent = $("<p>");
            cardContent.addClass("card-text");
            cardContent.text(results.dominant_pollutant_text.effects);
            warningCard.append(cardContent);

            $("#results").append(warningCard);
        });

    });

});