Events.afficherEvenements(last3MonthsEvents);
Calendar.init();
EventForm.init();

function hideBlocks(){
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
document.getElementById('calendarToogle').onclick = function () {
    Calendar.renderCalendar();
};

document.getElementById('eventListButton').onclick = function () {
    Events.afficherEvenements();
};

document.getElementById('addEvent').onclick = function () {
    hideBlocks();
    removeSelectedClass() ;
    this.classList.add('selected');
    document.getElementById('form').style.display = 'block';
    FormUploader.reset();
};