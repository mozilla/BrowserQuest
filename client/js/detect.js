
var Detect = {};

Detect.supportsWebSocket = function() {
    return window.WebSocket || window.MozWebSocket;
};

Detect.userAgentContains = function(string) {
    return navigator.userAgent.indexOf(string) != -1;
};

Detect.isTablet = function(screenWidth) {
    if(screenWidth > 640) {
        if((Detect.userAgentContains('Android') && Detect.userAgentContains('Firefox'))
        || Detect.userAgentContains('Mobile')) {
            return true;
        }
    }
    return false;
};

Detect.isChromeOnWindows = function() {
    return Detect.userAgentContains('Chrome') && Detect.userAgentContains('Windows');
}