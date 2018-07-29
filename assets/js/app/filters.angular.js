var customFilters = angular.module('customFilters', []);

customFilters.filter('moneyinr', function () {
    return function (amount) {
        try {
            if (amount == '') {
                return '';
            } else {
                var x = amount;
                x = x.replace(/\,/g, "");
                x = x.toString();
                var afterPoint = '';
                if (x.indexOf('.') > 0)
                    afterPoint = x.substring(x.indexOf('.'), x.length);
                x = Math.floor(x);
                x = x.toString();
                var lastThree = x.substring(x.length - 3);
                var otherNumbers = x.substring(0, x.length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
                return res;
            }
        } catch (e) {
            //console.log(e);
        }
    };
});

//Capitalize first character of first word
customFilters.filter('capitalize', function () {
    // Create the return function and set the required parameter as well as an optional paramater
    return function (input, char) {
        try {
            if (input == '') {
                return '';
            } else {
                if (isNaN(input)) {
                    // If the input data is not a number, perform the operations to capitalize the correct letter.
                    var char = char - 1 || 0;
                    var letter = input.charAt(char).toUpperCase();
                    var out = [];

                    for (var i = 0; i < input.length; i++) {

                        if (i == char) {
                            out.push(letter);
                        } else {
                            out.push(input[i]);
                        }
                    }
                    return out.join('');
                }
            }
        } catch (e) {
            return input;
        }
    }
});

//Capitalize first character of all words
customFilters.filter('ucwords', function () {
    return function (input, arg) {
        try {
            if (input == '') {
                return '';
            } else {
                return input.replace(/(?:^|\s)\S/g, function (a) {
                    return a.toUpperCase();
                });
            }
        } catch (e) {

        }
    };
});

//Capitalize first character of first word in string
customFilters.filter('ucfirst', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});


customFilters.filter('sumByKey', function () {
    return function (data, key) {
        key = Object.keys(data);
        var length = data.length;
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }

        var sum = 0;
        for (var i = length - 1; i >= 0; i--) {
            sum += parseInt(data[i]);
        }

        return sum;
    };
});