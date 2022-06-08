/// <reference path="jquery-3.4.1.js" />


(function () { // IIFE

    let countriesArray = [];
    let regionCountriesMap = new Map();

    $(function () {
        let url = "https://restcountries.com/v3.1/all";
        $.get(url).then(function (countries) {

            countriesArray = countries;
            countriesArray.sort(compareFunction);

            addCalculateSumOfCountriesToUi(countriesArray);
            addCalculateSumOfCountriesPopulationToUi(countriesArray);
            addCalculateAverageOfCountriesPopulationToUi(countriesArray);
            addCountriesToUI(countriesArray);
            addCountriesRegionToUI(countriesArray);
        })
            .catch(() => alert("Failed to get data from server."));

        $("#get-all-countries-button").click(showAllCountries);
        $("#get-all-countries-button").keyup(function (event) { // Calls search function on "Enter" click. 
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                showAllCountries();
            }
        });

        $("#show-searched-countries-button").click(showSearchedCountriesByName);
        $("#search-countries-input").keyup(function (event) { // Calls search function on "Enter" click. 
            let keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                showSearchedCountriesByName();
            }
        });

    });

    function compareFunction(a, b) {
        let nameA = a.name.common.toLowerCase(); 
        let nameB = b.name.common.toLowerCase(); 

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0;
    }


    function addCountriesToUI(countries) {
        for (let country of countries) {
            const td1 = `<td>${country.name.common} ${country.flag} </td>`;
            const td2 = `<td>${country.population}</td>`;
            let openTd3 = `<td>`;
            let currencies = country.currencies;
            for (key in currencies) {
                openTd3 = openTd3 + currencies[key].name + ", ";
            }
            openTd3 = openTd3.substring(0, openTd3.length - 2);

            let td3 = openTd3 + "</td>";
            const tr = `<tr>${td1}${td2}${td3}</tr>`;
            $("#countries-table").append(tr);
        }

    }

    function showSearchedCountriesByName() {
        let userSearchedValue = $("#search-countries-input").val();
        let url = `https://restcountries.com/v3.1/name/${userSearchedValue}`;
        $("#info-list").html("");
        if (userSearchedValue == "") {
            $("#countries-table").html("");
            $("#countries-region-table").html("");
            addCalculateSumOfCountriesToUi(countriesArray);
            addCalculateSumOfCountriesPopulationToUi(countriesArray);
            addCalculateAverageOfCountriesPopulationToUi(countriesArray);
            addCountriesToUI(countriesArray);
            addCountriesRegionToUI(countriesArray);
        }
        else {
            $.get(url).then(function (countries) {
                if (countries.length == 0) {
                    $("#info-list").html("");
                    $("#search-countries-input").val("");
                    $("#search-countries-input").val("");
                    alert("country wasn't found.");
                }
                else {
                    $("#info-list").html("");
                    $("#search-countries-input").val("");
                    $("#countries-table").html("");
                    $("#countries-region-table").html("");
                    addCalculateSumOfCountriesToUi(countries);
                    addCalculateSumOfCountriesPopulationToUi(countries);
                    addCalculateAverageOfCountriesPopulationToUi(countries);
                    addCountriesToUI(countries);
                    addCountriesRegionToUI(countries);
                }

            });

        };

    }

    function showAllCountries() {
        $("#countries-region-table").html("");
        $("#countries-table").html("");
        $("#info-list").html("");
        addCountriesToUI(countriesArray);
        addCountriesRegionToUI(countriesArray);
    }

    function addCalculateSumOfCountriesToUi(countries) {
        let sumOfCountries = countries.length;
        let amountOfCountriesParagraph =
            `<li><p> Total Countries: ${sumOfCountries}</p></li>`
        $("#info-list").append(amountOfCountriesParagraph);
    }

    function addCalculateSumOfCountriesPopulationToUi(countries) {
        let sumOfPopulation = 0;
        for (country of countries) {
            sumOfPopulation += parseInt(`${country.population}`);
        }
        let amountOfCountriesPopulationParagraph =
            `<li><p> Total Countries Population: ${sumOfPopulation}</p></li>`;
        $("#info-list").append(amountOfCountriesPopulationParagraph);
    }

    function addCalculateAverageOfCountriesPopulationToUi(countries) {
        let sumOfCountries = countries.length;
        let sumOfPopulation = 0;
        for (country of countries) {
            sumOfPopulation += parseInt(`${country.population}`);
        }
        let averageOfPopulation = Math.trunc(sumOfPopulation / sumOfCountries);
        let averageOfCountriesPopulationParagraph =
            `<li><p> Average Population: ${averageOfPopulation}</p></li>`
        $("#info-list").append(averageOfCountriesPopulationParagraph);

    }

    function addCountriesRegionToUI(countriesArray) {

        regionCountriesMap.set("Africa", 0);
        regionCountriesMap.set("Americas", 0);
        regionCountriesMap.set("Antarctic", 0);
        regionCountriesMap.set("Asia", 0);
        regionCountriesMap.set("Europe", 0);
        regionCountriesMap.set("Oceania", 0);

        for (let country of countriesArray) {
            let countryRegion = country.region;
            let counterRegion = regionCountriesMap.get(countryRegion);
            counterRegion++;
            regionCountriesMap.set(countryRegion, counterRegion);
        }

        for (const [region, numOfCountries] of regionCountriesMap.entries()) {
            if (numOfCountries != 0) {
                const td1 = `<td>${region}</td>`;
                const td2 = `<td>${numOfCountries}</td>`;
                const tr = `<tr>${td1}${td2}</tr>`;
                $("#countries-region-table").append(tr);
            }
        }

    }

})();