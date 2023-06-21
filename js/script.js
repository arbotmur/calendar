function getRandomBrightColor() {
    var letters = "3456789ABCDE";
    var color = "#";

    // Génère six caractères hexadécimaux aléatoires pour former un code couleur
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 12)];
    }

    return color;
}
function hideBlocks() {
    var blocks = document.querySelectorAll('.block');
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].style.display = 'none';
    }
}
function removeSelectedClass() {
    var selectedElements = document.querySelectorAll('.selected');
    for (var i = 0; i < selectedElements.length; i++) {
        selectedElements[i].classList.remove('selected');
    }
}
const mois = "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_");
const jours = "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_");

Calendar.afficherEvenements(last3MonthsEvents);
Calendar.init();


document.getElementById('calendarToogle').onclick = function () {
    Calendar.renderCalendar();
};

document.getElementById('eventListButton').onclick = function () {
    Calendar.afficherEvenements();
};

document.getElementById('addEvent').onclick = function () {
    hideBlocks();
    removeSelectedClass();
    this.classList.add('selected');
    document.getElementById('form').style.display = 'block';
    FormUploader.reset();
};