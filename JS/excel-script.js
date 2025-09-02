document.addEventListener('DOMContentLoaded', function () {
    const excelSessionNavigation = document.getElementById('excel-session-navigation');
    const excelPageContents = document.querySelectorAll('.excel-page-content');
    const totalSessions = 15;

    for (let i = 1; i <= totalSessions; i++) {
        const option = document.createElement('option');
        option.value = i;
        const title = document.querySelector(`#excel-session-${i} h3`).textContent;
        option.textContent = title;
        excelSessionNavigation.appendChild(option);
    }
    
    function switchExcelPage(sessionNumber) {
        excelPageContents.forEach(page => {
            page.classList.remove('active');
        });
        const activePage = document.getElementById(`excel-session-${sessionNumber}`);
        if(activePage){
            activePage.classList.add('active');
        }
        excelSessionNavigation.value = sessionNumber;
    }

    excelSessionNavigation.addEventListener('change', function(e) {
        const session = parseInt(e.target.value);
        switchExcelPage(session);
    });

    switchExcelPage(1);
});