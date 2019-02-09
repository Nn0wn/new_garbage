import User from './user_info.js';
import {send_info} from "./info_output.js";
import Car from './car.js';
var socket= io.connect("http://localhost:3030");
var taxist_avail = false;
var get_ans = false;

const DELIVERY_TARIFF = 100, MINIMUM_COST = 100;
var user;
var price;
var multiRoute;
var myPos;
var length = 0;
var taxist;

ymaps.ready(init);
socket.on("connect", () => {
    socket.on("want_taxi_Ans",st=>{
        if(st.status==="ok") {
            taxist_avail = true;
            alert("Таксист выехал");
            taxist=st.taxist;
            $("#submit_cost_btn").attr('disabled',true);
            //alert(taxist)
            //drawCar();
        }
        else {
            alert("Извините, таксистов нет");
            taxist_avail = false;
            get_ans=true;
        }
    });
});
function init() {


    var suggestStart = new ymaps.SuggestView('start_point');
    var suggestDest = new ymaps.SuggestView('dest_point');


    var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [59.94, 30.32],
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        });

    geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        myPos = result.geoObjects.get(0);
        // Синим цветом пометим положение, полученное через браузер.
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        myMap.geoObjects.add(result.geoObjects);
    });

    $("#submit_btn").on('click', () => {

        if (multiRoute)
            myMap.geoObjects.remove(multiRoute);

        user = new User(
            $("#name").val(),
            $("#tel").val(),
            $("#start_point").val(),
            $("#dest_point").val()
        );


        if (user.start_point === "")
            user.start_point = myPos.properties._data.text;

        geocode(0, user.start_point);
        geocode(1, user.dest_point.toString());

        multiRoute = new ymaps.multiRouter.MultiRoute({
            // Описание опорных точек мультимаршрута.
            referencePoints: [
                user.start_point,
                user.dest_point.toString()
            ],
            // Параметры маршрутизации.
            params: {
                // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
                results: 2
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });

        function geocode(num, name) {
            // Геокодируем введённые данные.
            ymaps.geocode(name).then(function (res) {
                var obj = res.geoObjects.get(0),
                    error, hint;

                if (obj) {
                    // Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
                    switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
                        default:
                            break;
                    }
                } else {
                    error = 'Адрес не найден';
                    hint = 'Уточните адрес';
                }

                // Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
                if (error) {
                    showError(num, error);
                } else {
                    showResult(num, obj);
                }
            }, function (e) {
                console.log(e)
            })

        }

        function showResult(num, obj) {
            // Удаляем сообщение об ошибке, если найденный адрес совпадает с поисковым запросом.
            if (num === 0) {
                $('#start_point').removeClass('input_error');
                $('#notice_start').css('display', 'none');
            }
            else {
                $('#dest_point').removeClass('input_error');
                $('#notice_dest').css('display', 'none');
            }

        }

        function showError(num, message) {
            if (num === 0) {
                $('#notice_start').text(message).css('display', 'block');
                $('#start_point').addClass('input_error');
            }
            else {
                $('#notice_dest').text(message).css('display', 'block');
                $('#dest_point').addClass('input_error');
            }
        }

        if (user.start_point !== "" && user.dest_point !== "") {
            myMap.geoObjects.add(multiRoute);
            $("#submit_cost_btn").removeAttr('disabled');
        }

        if (multiRoute) {
            multiRoute.model.events.add("requestsuccess", function (event) {
                //var activeRoute = multiRoute.getActiveRoute();
                var activeRoute;
                do {
                    activeRoute = multiRoute.getActiveRoute();
                    length = multiRoute.getActiveRoute().properties.get("distance");
                    price = calculate(Math.round(length.value / 1000));

                    //activeRoute.getPaths().get(0).getSegments().

                } while (!activeRoute);
                $("#cost_btn").text("Стоимость поездки: " + price.toString() + " рублей");
            })
        }
    });


    function calculate(routeLength) {
        return Math.max(routeLength * DELIVERY_TARIFF, MINIMUM_COST);
    }
function drawCar(startPoint, destPoint){
    ymaps.route([
        "Россия, Санкт-Петербург,метро проспект Просвещения",
        {
            type:"viaPoint",
            point: startPoint,
        },
        {
            type:"viaPoint",
            point: destPoint,
        },
        "Россия, Санкт-Петербург,метро проспект Просвещения"
    ], {
        // Опции маршрутизатора
        mapStateAutoApply: true // автоматически позиционировать карту
    }).then(function (route) {

        // Задание контента меток в начальной и конечной точках
        var points = route.getWayPoints();
        points.get(0).properties.set("iconContent", "А");
        points.get(1).properties.set("iconContent", "Б");
        // Добавление маршрута на карту
        myMap.geoObjects.add(route);

        // И "машинку" туда же
        const carPoint = new ymaps.Placemark([0, 0], {});
        myMap.geoObjects.add(carPoint);
        const car = new Car({
            iconLayout: ymaps.templateLayoutFactory.createClass(
                '<div class="b-car b-car_blue b-car-direction-$[properties.direction]"></div>'
            )
        });
        myMap.geoObjects.add(car);
        // Отправляем машинку по полученному маршруту простым способом
        // car.moveTo(route.getPaths().get(0).getSegments());
        // или чуть усложненным: с указанием скорости,
        //if (taxist_avail==true) {
        car.moveTo(route.getPaths().get(0).getSegments(), {
            speed: 10,
            directions: 8
        }, function (geoObject, coords, direction) { // тик движения
            // перемещаем машинку
            if(taxist_avail==false) return;
            geoObject.geometry.setCoordinates(coords);
            console.log("coords: " + JSON.stringify(coords));
            //map.geoObjects.add(new ymaps.Placemark(coords, {}));
            carPoint.geometry.setCoordinates(coords);
            // ставим машинке правильное направление - в данном случае меняем ей текст
            geoObject.properties.set('direction', direction.t);
        }, function (geoObject) { // приехали
            geoObject.properties.set('balloonContent', "Приехали!");
            geoObject.balloon.open();
            myMap.geoObjects.remove(car);
            myMap.geoObjects.remove(route);
            myMap.geoObjects.remove(carPoint);
            //alert(taxist);
            if (taxist!=undefined) socket.json.emit("reach", {"taxist": taxist})
        });
        // }
    }, function (error) {
        console.error("Возникла ошибка: " + error.message);
    });
}
    $("#submit_cost_btn").on('click', () => {
        //send_info(user.start_point, price);

        const startPoint=user.start_point;
        const destPoint=$("#dest_point").val();

        alert(startPoint+" "+destPoint);
        let promise = new  Promise(((resolve, reject) => {
            socket.json.emit("want_taxi", {number: 10,xCoord:10,yCoord:12});
            resolve("res");
        }));
        promise.then(res=>{
            console.log(taxist_avail)
        })
        drawCar(startPoint,destPoint);

    })
    // Сравним положение, вычисленное по ip пользователя и
    // положение, вычисленное средствами браузера.
    //     geolocation.get({
    //         provider: 'yandex',
    //         mapStateAutoApply: true
    //     }).then(function (result) {
    //         // Красным цветом пометим положение, вычисленное через ip.
    //         result.geoObjects.options.set('preset', 'islands#redCircleIcon');
    //         result.geoObjects.get(0).properties.set({
    //             balloonContentBody: 'Мое местоположение'
    //         });
    //         myMap.geoObjects.add(result.geoObjects);
    //     });

}


