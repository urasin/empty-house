var candyAdsConversionLanding = (function() {
    var candy_host = 'https://ad1.candy-network.com/';
    var candyTokenQuery = 'candy_token';
    var campaignCodeQuery = 'campaign_code';
    var candyGpnQuery = 'candy_gpn';
    var candyCookie = 'candy_info';
    var expiredays = 30;
    var candyDelimiter = ';';
    var candyMedia = 'candy_media';
    var candyGaCode = '_ga'; //CV99 function expand 2019/05/23 nakaji
    var candyCookiePrefix = '';
    candyCookie = candyCookiePrefix + 'candy_info';

    function createXmlHttp() {
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            xmlHttp = null;
        }
        return xmlHttp;
    }


    function getPlatformAttr(data_input){

        var platforms = {
            1 : 'PC',
            2 : 'Android',
            4 : 'iPhone',
            8 : 'Mac',
            16 : 'WP',
            32 : 'mobile',

        }
        var data_platform = null;
        if(data_input == undefined || !(parseInt(data_input) in  platforms) ){
            var userAgent = window.navigator.userAgent,
                os = null;

            if (userAgent.match(/Android/i)) {
                os = 2;
            } else if (userAgent.match(/iPhone|iPod|iPad/i)) {
                os = 4;
            } else if (userAgent.match(/Mac/i)) {
                os = 8;
            } else if (userAgent.match(/Windows Phone/i)) {
                os = 16;
            }  else if (userAgent.match(/webOS|BlackBerry|IEMobile|Opera Mini/i)) {
                os = 32;
            } else {
                os = 1;
            }

            data_platform = os;
        } else{
            data_platform = parseInt(data_input);
        }
        return data_platform;
    }

    function getJsRequestQuery(queryName) {

        var conversionLanding = document.getElementById("ads_landing_own");
        var url = conversionLanding.src;
        var queryParams = url.split('?')[1];
        if (typeof queryParams != 'undefined'){
            var queries = queryParams.split('&');
            for (var i = 0; i < queries.length; i++) {
                var query = queries[i].split('=');
                if (query[0] == queryName) {
                    return query[1];
                }
            }
        }
        return null;
    }

    function setCookie(cName, value, expiredays, domain) {
        // pathの指定
        var path = '/';
        // 有効期限の日付
        var extime = new Date().getTime();
        var cltime = new Date(extime + (60 * 60 * 24 * 1000 * expiredays));
        var exdate = cltime.toUTCString();
        // クッキーに保存する文字列を生成
        var s = "";
        s += cName + "=" + escape(value);// 値はエンコードしておく
        s += "; path=" + path;
        if (expiredays) {
            s += "; expires=" + exdate + "; ";
        } else {
            s += "; ";
        }

        if (domain != null) {
            s += " domain=" + domain + "; ";
        }

        // クッキーに保存
        document.cookie = s;

    }

    // クッキーの値を取得 getCookie(クッキー名); //
    function getCookie(cName) {
        var st = "";
        var ed = "";
        if (document.cookie.length > 0) {
            // クッキーの値を取り出す
            st = document.cookie.lastIndexOf(cName + "=");
            if (st != -1) {
                st = st + cName.length + 1;
                ed = document.cookie.indexOf(";", st);
                if (ed == -1)
                    ed = document.cookie.length;
                // 値をデコードして返す
                return unescape(document.cookie.substring(st, ed));
            }
        }
        return null;
    }

    function getRequestQuery(queryName) {
        var queryParams = window.location.search.substring(1);
        var queries = queryParams.split('&');
        for (var i = 0; i < queries.length; i++) {
            var query = queries[i].split('=');
            if (query[0] == queryName) {
                return query[1];
            }
        }
        return null;
    }



    function getSubDomain(){

        if(candy_gpn == undefined) {
            var gpn = getJsRequestQuery(candyGpnQuery);
        } else {
            var gpn = candy_gpn;
        }
        var domain = null;
        if (gpn != null) {

            gpn = parseInt(gpn);
            if (!isNaN(gpn)) {

                var host = window.location.host;
                if (host.split('.').length !== 1) {
                    domainParts = host.split('.');
                    if (gpn <= domainParts.length) {

                        if (gpn < 2) {
                            gpn = 2;
                        }
                        var end = domainParts.length;
                        var start = end - gpn;
                        domainParts = domainParts.slice(start, end);
                        domain = '.' + domainParts.join('.');
                    }
                }
            }
        }

        return domain;
    }

    function getCandyParams(params) {
        params.platform = getPlatformAttr(params.platform);
        if (params.conversion_flag === false) {
            params.conversion_flag = 0;
        } else if (params.conversion_flag === true) {
            params.conversion_flag = 1;
        }

        if (params.first_visitor_flag === false) {
            params.first_visitor_flag = 0;
        }

        return params;
    }

    function sendDataConversion(data_conversion, candyParams , candyInfoStr) {
        var data = {};
        if (data_conversion != null) {
            data['candy_token'] = data_conversion.candy_token;
            data['campaign_code'] = data_conversion.campaign_code;
            data['conversion_type'] = candyParams.conversion_type;
            data['conversion_flag'] = candyParams.conversion_flag;
            data['platform'] = candyParams.platform;
            data['first_visitor_flag'] = candyParams.first_visitor_flag ;
            data['conversion_item'] = candyParams.conversion_item;
            data['conversion_count'] = candyParams.conversion_count;
            data['conversion_amount'] = candyParams.conversion_amount;
            data['conversion_category'] = candyParams.conversion_category;
            data['candy_media'] = data_conversion.candy_media;


            if (data['first_visitor_flag'] === null) {
                if (candyInfoStr === null) {
                    data['first_visitor_flag'] = 1;
                } else {
                    data['first_visitor_flag'] = 0;
                }
            }

            var sendConversionInfo;
            var xmlHttp = createXmlHttp();
            if (window.XDomainRequest) {
                sendConversionInfo = candy_host + "api/conversion/regisLogConversion?data=" + JSON.stringify(data);
                xmlHttp.open("POST", sendConversionInfo, true);
                xmlHttp.send();
            } else {
                sendConversionInfo = candy_host + "api/conversion/regisLogConversion";
                xmlHttp.open("POST", sendConversionInfo, true);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xmlHttp.send('data=' + JSON.stringify(data));
            }

        }

    }

    function getCandyTokenByCookie(candy_token) {
        var candyInfoStr = getCookie(candyCookie);
        var candyInfoArr = new Array();
        if (candyInfoStr != null && candyInfoStr != "") {
            candyInfoArr = candyInfoStr.split(candyDelimiter);
            candy_token = JSON.parse(candyInfoArr[0]).candy_token;
        }

        return candy_token;
    }

    function filterFields(sourceData, acceptedFields) {
        var result = {};
        for (var field in sourceData) {
            if (acceptedFields.indexOf(field) > -1) {
                result[field] = sourceData[field];
            }
        }
        return result;
    }

    function saveLatestConversionInfoToCookie(data) {
        candyInfoArr = [];
        var cookieAcceptedFields = ['candy_token', 'candy_media', 'platform'];
        candyInfoArr.push(JSON.stringify(filterFields(data, cookieAcceptedFields)));
        if (candyInfoArr.length > 0) {
            setCookie(candyCookie, candyInfoArr.join(candyDelimiter), expiredays, getSubDomain());
        }
    }

    function sendEventLog(candyToken, e, param) {
        var candy_token_write_log = getCandyTokenByCookie(candyToken);
        sendLog(candy_token_write_log,e,param);
        setTimeout(function () {
            sendLog(candy_token_write_log, 'T')
        }, 30000);
    }

    function getAndSendConversionData(candyToken, params){
        var campaign_code = getRequestQuery(campaignCodeQuery);
        var candy_media = getRequestQuery(candyMedia);

        if (candyToken && campaign_code) {

            var data = {
                "candy_token" : candyToken,
                "campaign_code" : campaign_code,
                "candy_media" : candy_media
            };
            var candyInfoStr = getCookie(candyCookie);
            if (params !== undefined) {
                params = getCandyParams(params);
                data ['platform'] = params.platform;
                sendDataConversion(data, params , candyInfoStr);
            } else {
                data ['platform'] = getPlatformAttr();
            }

            return data;
        }
        return null;
    }


    //CV99 function expand 2019/05/23 nakaji
    function sendLog(candy_token, event, candyParams) {
        if (candy_token != null && candy_token != "") {
            var C = 'C=' + candy_token;
            var e = '&e=L';
            if (event != undefined) {
                e = '&e=' + event;
            }
            var r = '';
            if (document.referrer !== '') {
                r = '&r=' + encodeURIComponent(document.referrer);
            }
            var u = '';
            u = '&u=' + encodeURIComponent(document.URL);
            var g = "&g=" + getCookie(candyGaCode);
            var Cf,Cp,C1,Ci,Cn,Ca,Cc;
            Cf=Cp=C1=Ci=Cn=Ca=Cc="";
            if(candyParams!=null){
                Cf = "&Cc=" + candyParams.conversion_flag;
                Cp = "&Cp=" + candyParams.platform;
                C1 = "&Cf=" + candyParams.first_visitor_flag;
                Ci = "&Ci=" + candyParams.conversion_item;
                Cn = "&Cn=" + candyParams.conversion_count;
                Ca = "&Ca=" + candyParams.conversion_amount;
                Cc = "&Ct=" + candyParams.conversion_category;
            }

            var sendLogInfo;
            var xmlHttp = createXmlHttp();
            if (window.XDomainRequest) {
                sendLogInfo = candy_host + "api/log/event?" + C + e + r + u + g + Cf + Cp + C1 + Ci + Cn + Ca + Cc;
                xmlHttp.open("POST", sendLogInfo, true);
                xmlHttp.send();
            } else {
                sendLogInfo = candy_host + "api/log/event";
                xmlHttp.open("POST", sendLogInfo, true);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xmlHttp.send(C + e + r + u + g + Cf + Cp + C1 + Ci + Cn + Ca + Cc);
            }
        }
    }

    return {
        saveCandyInfo : function(params) {
            var candyToken = getRequestQuery(candyTokenQuery);
            sendEventLog(candyToken,"L", params);
            var data = getAndSendConversionData(candyToken, params);
            if (data !== null){
                saveLatestConversionInfoToCookie(data);
            }
        }
    }
}());
var candy_params = {
    conversion_type : 1,
    conversion_flag : null,
    platform : null,
    first_visitor_flag : null,
    conversion_item : null,
    conversion_count : 1,
    conversion_amount : 0,
    conversion_category : null,
}

var candy_gpn;

if(typeof candyLandingConversion == 'function'){
    candyLandingConversion ();
} else {
    candyAdsConversionLanding.saveCandyInfo();
}