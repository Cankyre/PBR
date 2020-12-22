var overlay = false;

function toggleOverlay() {
    if (!overlay) {
        document.getElementById("settings").style.display = "block";
        overlay = true;
    } else {
        document.getElementById("settings").style.display = "none";
        overlay = false;
    }
}


document.addEventListener('keydown', KeyboardEvent => {
    if (KeyboardEvent.key == 'Control') {
        toggleOverlay();
    }
})