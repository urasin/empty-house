var createUrlForRevive = function(code) {
    if(revive_tracking.webchat !== undefined && revive_tracking.webchat == true){
        var adminUrl = 'https://chatlp.com/';
    } else if (location.host == "lp.196plus.co.jp") {
        var adminUrl = 'https://chatlp.com/';
    } else if (location.host == "vernis.co.jp") {
        var adminUrl = 'https://chatlp.com/';
    } else if(revive_tracking.local !== undefined && revive_tracking.local == true) {
        var adminUrl = 'http://localhost/';
    } else {
        var adminUrl = 'https://admin.revive-chat.io/';
    }

    var reviveQuery = '';
    if (getParamForRevive('reviveQuery')) {
        reviveQuery = getParamForRevive('reviveQuery');
        document.cookie = 'reviveQuery=' + reviveQuery + ';domain=' + (location.host.match(/([^.]+)\.\w{2,5}(?:\.\w{2})?$/) || [])[0] + ';path=/';
    } else if(getParamForRevive('reviveQuery',document.referrer)) {
        reviveQuery = getParamForRevive('reviveQuery',document.referrer);
        document.cookie = 'reviveQuery=' + reviveQuery + ';domain=' + (location.host.match(/([^.]+)\.\w{2,5}(?:\.\w{2})?$/) || [])[0] + ';path=/';
    }
    var cookies = getCookieForReviveTracking();
    if (cookies['reviveQuery']) {
        reviveQuery = cookies['reviveQuery'];
    }
    if (reviveQuery == '' || reviveQuery == undefined) {
        return false;
    }
    if (productId == '' || productId == undefined) {
        var productIdParam = '';
    } else {
        var productIdParam = "&productId=" + productId;
    }

    let url = adminUrl + code + ".jpeg"
        + "?reviveQuery=" + reviveQuery + '&ref=' + encodeURIComponent(location.href) + productIdParam;

    var query = {
        reviveQuery: reviveQuery,
        ref: encodeURIComponent(location.href) + productIdParam
    };
    if (reviveRewriteUrlFlag) {
        rewriteUrlForRevive(query);
    }
    return url;
}

var rewriteUrlForRevive = function(query) {
    var aTags = document.getElementsByTagName('a');
    [].forEach.call(aTags, function(aTag) {
        var url = new URL(aTag.href);
        var params = new URLSearchParams(url.search.slice(1));

        Object.keys(query).forEach(function(key) {
            params.append(key, query[key]);
        });
        aTag.href = aTag.href +'?'+ params.toString();
    });
}

if(typeof(code) == undefined){
    let code = revive_tracking.code;
} else {
    code = revive_tracking.code;
}

var productId;
if (!revive_tracking.rewriteUrlFlag || revive_tracking.rewriteUrlFlag !== true) {
    var reviveRewriteUrlFlag = false;
} else {
    var reviveRewriteUrlFlag = true;
}

if (window.performance) {
    let perfEntries = performance.getEntriesByType("navigation");
    let navigationType = 1;
    perfEntries.forEach(function(pe) {
        navigationType = pe.type;
    });
    if (navigationType !== 1 && code) {
        let reviveTrackingUrl = createUrlForRevive(code);
        if(reviveTrackingUrl != false){
            var image = new Image();
            image.src = reviveTrackingUrl;

            if(document.domain == 'quasia.net'){
                
            }
        }
    }
}

function getParamForRevive(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return false;
    if (!results[2]) return false;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getCookieForReviveTracking() {
    var cookieData = document.cookie.split(';');
    var content = [];
    var cookies = [];
    cookieData.forEach(function(value) {
        value = value.replace(' ','');
        content = value.split('=');
        cookies[content[0]] = content[1];
    })
    return cookies;
}
