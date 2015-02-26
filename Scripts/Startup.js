function showGamePl() {
    sessionStorage.setItem("lang", "pl");
    popupWindow("automats.html", "Binarne ¿ycie", 900, 600);
}
function showGameEn() {
    sessionStorage.setItem("lang", "en");
    popupWindow("automats.html", "Binary life", 900, 600);
}

function popupWindow(url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}