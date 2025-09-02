document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;
    const totalPages = 10;
    const pageIndicator = document.getElementById('page-indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-quiz-btn');

    function showPage(pageNumber) {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`page-${pageNumber}`).classList.add('active');
        pageIndicator.textContent = `Page ${pageNumber} of ${totalPages}`;
        prevBtn.disabled = pageNumber === 1;
        nextBtn.disabled = pageNumber === totalPages;
    }

    function navigatePage(direction) {
        currentPage += direction;
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;
        showPage(currentPage);
    }
    
    prevBtn.addEventListener('click', () => navigatePage(-1));
    nextBtn.addEventListener('click', () => navigatePage(1));
    
    function calculateAndShowFinalScore() {
        const allCorrectAnswers = [
            { 'q1-1': 'b', 'q1-2': 'c' }, { 'q2-1': 'c', 'q2-2': 'a' },
            { 'q3-1': 'a', 'q3-2': 'b' }, { 'q4-1': 'b' }, { 'q5-1': 'b' },
            { 'q6-1': 'b' }, { 'q7-1': 'c' }, { 'q8-1': 'a' },
            { 'q9-1': 'b', 'q9-2': 'b' }
        ];
        let totalScore = 0;
        let totalQuestions = 0;
        const detailedResultsContainer = document.getElementById('detailed-results');
        detailedResultsContainer.innerHTML = ''; 

        allCorrectAnswers.forEach((pageAnswers, pageIndex) => {
            const pageNum = pageIndex + 1;
            const chapterTitle = document.querySelector(`#page-${pageNum} h2`).textContent;
            const chapterResultHeader = document.createElement('h4');
            chapterResultHeader.className = 'text-xl font-semibold mt-4 border-t pt-3';
            chapterResultHeader.textContent = chapterTitle;
            detailedResultsContainer.appendChild(chapterResultHeader);
            
            const quizDiv = document.getElementById(`quiz-${pageNum}`);
            if (!quizDiv) return;
            
            Object.keys(pageAnswers).forEach((questionKey, questionIndex) => {
                totalQuestions++;
                const questionText = quizDiv.querySelectorAll('.quiz-question p.font-semibold')[questionIndex].textContent;
                const selected = quizDiv.querySelector(`input[name=${questionKey}]:checked`);
                const correctAnswer = pageAnswers[questionKey];
                const resultP = document.createElement('p');
                resultP.className = 'p-3 rounded-md border';
                if (selected) {
                    if (selected.value === correctAnswer) {
                        totalScore++;
                        resultP.innerHTML = `<span class="font-bold text-green-700">✔ Correct:</span> ${questionText}`;
                        resultP.classList.add('bg-green-50', 'border-green-200');
                    } else {
                        resultP.innerHTML = `<span class="font-bold text-red-700">✖ Incorrect:</span> ${questionText}<br><span class="text-sm ml-2">Your answer: '${selected.value}', Correct answer: '${correctAnswer}'.</span>`;
                        resultP.classList.add('bg-red-50', 'border-red-200');
                    }
                } else {
                    resultP.innerHTML = `<span class="font-bold text-gray-700">! Not Answered:</span> ${questionText}<br><span class="text-sm ml-2">Correct answer: '${correctAnswer}'.</span>`;
                    resultP.classList.add('bg-gray-100', 'border-gray-200');
                }
                detailedResultsContainer.appendChild(resultP);
            });
        });

        const totalScoreDisplay = document.getElementById('total-score-display');
        totalScoreDisplay.textContent = `Your Total Score: ${totalScore} out of ${totalQuestions}`;
        if (totalScore >= (totalQuestions * 0.75)) totalScoreDisplay.className = 'text-3xl font-bold mb-4 text-center text-green-600';
        else if (totalScore >= (totalQuestions * 0.5)) totalScoreDisplay.className = 'text-3xl font-bold mb-4 text-center text-orange-600';
        else totalScoreDisplay.className = 'text-3xl font-bold mb-4 text-center text-red-600';
        document.getElementById('final-results').style.display = 'block';
    }

    submitBtn.addEventListener('click', calculateAndShowFinalScore);
    showPage(currentPage);
});