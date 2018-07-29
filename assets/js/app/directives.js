//Account menu that is visible in My Account when logged in
app.directive('accountmenu', function() {
    var directive = {};

    directive.restrict = 'E'; /* restrict this directive to elements */

    directive.scope = {active: '@'};

    directive.template = '<ul class="nav nav-pills nav-stacked"><li ng-class="{\'active\': activeLink == \'profile\'}"><a href="/profile">{{ activeLink }}Basic Profile</a></li><li  ng-class="activeLink == \'change-password\' ? \'active\':\'\'"><a href="/change-password">Change Password</a></li><li ng-class="activeLink == \'addresses\' ? \'active\':\'\'"><a href="/addresses">Addresses</a></li><li ng-class="activeLink == \'order-history\' ? \'active\':\'\'"><a href="/order-history">Order History</a></li><li ng-class="activeLink == \'referrals\' ? \'active\':\'\'"><a href="/referrals">Referrals</a></li></ul>';

    return directive;
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

//app.directive('preventDefault', function() {
//    return {
//        restrict: 'E',
//        link: function(scope, elem, attrs) {
//            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
//                elem.on('click', function(e){
//                    e.preventDefault();console.log('hello');
//                });
//            }
//        }
//   };
//});

app.directive('myContextmenu', function ($parse) {
    return {
        compile: function(tElem, tAttrs) {
            var fn = $parse(tAttrs.myContextmenu);
            return function(scope, elem, attrs) {
                elem.on('contextmenu', function (evt) {
                    scope.$apply(function () {
                        fn(scope, {$event: evt});
                    });
                });
            };
        }
    };
});

app.directive('datetimez', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var params = {
                debug: false,
                format: 'DD-MM-YYYY hh:mm A',
//                maxDate: moment()
            };
            element.datetimepicker(params).on('dp.change', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});

app.directive('customdatez', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var params = {
                debug: false,
                format: 'DD-MM-YYYY',
//                maxDate: moment().startOf('isoweek')
//                maxDate: moment()
            };
            if(attrs.mindate !== undefined) {
                scope.$watch(function() {
                    return attrs.mindate; 
                }, function(newValue){
                    if(newValue != '') {
                        var mmt = moment(newValue, "DD-MM-YYYY");
                        params.minDate = mmt;
                        element.datetimepicker(params).on('dp.change', function (e) {
                            ngModelCtrl.$setViewValue(e.date.format('DD-MM-YYYY'));
                            scope.$apply();
                        });
                    }
                });
            }else {
                element.datetimepicker(params).on('dp.change', function (e) {
                    ngModelCtrl.$setViewValue(e.date.format('DD-MM-YYYY'));
                    scope.$apply();
                });
            }
        }
    };
});

app.directive('pastdatez', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                debug: false,
                format: 'DD-MM-YYYY',
                maxDate: moment()
            }).on('dp.change', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});

app.directive('pastdatetimez', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                debug: false,
                format: 'DD-MM-YYYY hh:mm A',
                maxDate: moment()
            }).on('dp.change', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});

app.directive('futuredatez', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                debug: false,
                format: 'DD-MM-YYYY',
                minDate: moment()
            }).on('dp.change', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});

app.directive('futuredatetimez', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                debug: false,
                format: 'DD-MM-YYYY hh:mm A',
                minDate: moment()
            }).on('dp.change', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});


app.directive('daterangepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.daterangepicker({
                "autoApply": true,
                "startDate": "09/06/2017",
                "endDate": "09/12/2017",
                "opens": "left",
                "locale": {
                    "format": "DD-MM-YYYY",
                    "separator": " to ",
                },
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'Last 90 Days': [moment().subtract(89, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().subtract(28, 'days').endOf('month')],
                    'Last 12 Months': [moment().subtract(12, 'month').startOf('month'), moment().subtract(28, 'days').endOf('month')],
                    'Last Year': [moment().subtract(12, 'month').startOf('year'), moment().subtract(12, 'month').endOf('year')]
                }
            }, function(start, end, label) {
                ngModelCtrl.$setViewValue(start.format('DD-MM-YYYY') + ' to ' + end.format('DD-MM-YYYY'));
                scope.$apply();
            });
        }
    };
});

app.directive('superColWidthUpdate', ['$timeout', function ($timeout) {
    return {
      'restrict': 'A',
          'link': function (scope, element) {
          var _colId = scope.col.colDef.superCol,
              _el = jQuery(element);
          _el.on('resize', function () {
              _updateSuperColWidth();
          });
          var _updateSuperColWidth = function () {
              $timeout(function () {
                  var _parentCol = jQuery('.ui-grid-header-cell[col-name="' + _colId + '"]');
                  var _parentWidth = _parentCol.outerWidth(),
                      _width = _el.outerWidth();
                  
                  if (_parentWidth + 1 >= _width) {
                    _parentWidth = _parentWidth + _width;
                  } else {
                    _parentWidth = _width;
                  }
                  
                  _parentCol.css({
                      'min-width': _parentWidth + 'px',
                      'max-width': _parentWidth + 'px',
                      'text-align': "center"
                  });
              }, 0);
          };
          _updateSuperColWidth();
      }
    };
  }]);

app.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
       
        
        app.directive('realTimeCurrency', function ($filter, $locale) {

return {

restrict: 'A',
require: 'ngModel',
link: function postLink(scope, elem, attrs, modelCtrl) {
function filterFunc(text) {
if (text) {
var transformedInput = text.replace(/[^0-9]/g, '');

if (transformedInput !== text) {
modelCtrl.$setViewValue(transformedInput);
modelCtrl.$render();
}
return $filter('moneyinr')(transformedInput);
}
}


modelCtrl.$formatters.push(filterFunc);
modelCtrl.$parsers.push(function (newViewValue) {
var oldModelValue = modelCtrl.$modelValue;
var newModelValue = newViewValue;

if (newModelValue == '')
{
return '';
} else
{
var x = newModelValue;
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
modelCtrl.$viewValue = filterFunc(newModelValue);
elem.val(modelCtrl.$viewValue);
return res;
}

});
}
};

}); 
        
        
        }]);
    
   