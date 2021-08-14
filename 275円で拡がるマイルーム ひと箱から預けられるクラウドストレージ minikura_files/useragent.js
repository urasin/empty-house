/**
 * useragent ie 判定
 * TLS設定ができていないIE USER 向け　
 * */
var Act_ua =
{
	a: function(){
		$('#tls').css('display', 'none');
		var userAgent = window.navigator.userAgent.toLowerCase();
		var appVersion = window.navigator.appVersion.toLowerCase();
		if (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
			//* IE
			//* IE version
			var target = /(msie|rv:?)\s?([\d\.]+)/.exec(userAgent);
			var version = (target) ? target[2] * 1 : "";
			if (version <= 10) {
				$('#tls').css('display', 'block');
			}

		}
	},
}
/**
 * $(document).ready();
 * */
$(function(){
	Act_ua.a();
});
