console.log("script check")
/*------------------------ Constants -----------------------------------------------*/

const questions = {
    JavaScript: [
        {question: "What is the difference between objects and arrays?", answers: ["Objects are collections of key-value pairs, while arrays are ordered lists of values.","Arrays can only store strings, while objects can store any data type.","Objects are mutable, while arrays are immutable."], correct:0},
        {question: "What does document.querySelector do?", answers: ["It selects an HTML element based on its ID.", "It selects the first element that matches the specified selector.", "It allows you to get all elements with a specific class."], correct:1},
        {question: "How can you change the text of an HTML element using JavaScript?", answers:[ "element.textContent = 'new text';", "element.changeText('new text');", "element.innerHTML= 'new text';"], correct:0},
        {question: "Which of the following is the correct way to declare a variable?", answers: ["letVariableName;", "variableName:=10;", "var variableName =10;"], correct:0},
        {question: "Which operator is used to compare both value and type?", answers: ["==", "=", "==="], correct: 2},
        {question:"What will the following code return: typeof 'Hello'?", answers:["object","string","undefined"], correct:1},
        {question: "Which of the following is used to declare a constant?", answers:[ "const constantName= 10;", "let constantName= 10;", "var constantName= 10;"], correct:0}
],
    Emmet: [
        {question: "What is the abbreviation for the standard HTML boilerplate?",answers:[ "html5", "<!DOCTYPE html>", "!"],correct:2},
        {question: "How can you create classes?", answers: [".classname",".class1.class2",  "class=classname"], correct:0},
        {question: "How can you create 4 blurbs with random text ?", answers: ["<p>*4Lorem",".p*4loremIpsum", "p*4>lorem"],correct:2},
        {question: "How can you create the same element multiple times?", answers:[ "div.row*3", "div.row[3]","Use Option+Shift+Down Arrow to duplicate"],correct: 0},
        {question: "What does > do ?", answers: ["Creates a parent element.", "Creates a child element.", "Adds a div as a sibling element."], correct: 1},
        {question: "What does tac: do?", answers: ["Text-align: center;", "Text-align: left;", "Text-align: justify;"],correct: 0},
        {question: "What would #page>div.logo +ul#navigation>li*5>a{Item $} do?", answers: ["Creates 2 divs, one for the page and one for the logo, and then an unordered list with 5 unlisted items .", "Creates a div with an id of page that contains another div with the class logo and an unordered list with 5 listed items in it.", "Adds a logo div to the existing page div and places it in between teh existing listed items."], correct: 1}
 ]
};
const correctSound = new Audio('assets/correctSound.mp3');
const incorrectSound = new Audio('assets/incorrectSound.mp3');
const betterLuckSound= new Audio('assets/betterLuckSound.mp3');

/*------------------------ Variables -----------------------------------------------*/
let currentQIdx = 0;
let selectedCategory = '';
let totalScore= 0;
/*------------------------ Cached Element References -----------------------------------------------*/
const categoryBtns= document.querySelector(".category-buttons");
const quizSection=document.querySelector('#quiz');
const resultsSection= document.querySelector('#results');
const questionText =document.querySelector('#question-text');
const answersEl= document.querySelector('#answers');
const scoreDisplay = document.querySelector('#score-display');
const finalScoreEl= document.querySelector('#final-score');
const playAgainBtn= document.querySelector('#play-again');
/*------------------------------ Functions -----------------------------------------------*/
function selectCategory(category) {
    selectedCategory= category;
    console.log("Category selected:" , selectedCategory);
    currentQIdx=0;
    totalScore=0;
    questionText.classList.add('centered');
    showQuestion();
}
function startGame() {
    quizSection.style.display = "block";
    resultsSection.style.display = "none";
    document.querySelector("#category-selection").style.display= "none";
    questionText.classList.remove('centered');
    questionText.classList.add('not-centered');
    showQuestion();
}
function showQuestion() {
    console.log("show question called");
    if (currentQIdx >= questions[selectedCategory].length) {
        showResults();
        return;
    }
    let currentQ= questions[selectedCategory][currentQIdx];
    questionText.textContent= currentQ.question;

    document.querySelectorAll('.answer-btn').forEach((btn,idx) => {
        if (idx <currentQ.answers.length){
            btn.textContent =currentQ.answers[idx]
            btn.dataset.index = idx;
            btn.style.display = "inline-block"
        } else {
            btn.style.display="none";
        }
    });

    document.getElementById('next-question').display= true;
}
function triggerConfetti(){
    confetti({
        particleCount:100,
        spread: 70,
        origin: {y:0.6},
        colors: ['#ff0','#0f0','#f00', '#00f'],
    })
}
function showResults() {
    quizSection.style.display="none";
    resultsSection.style.display= "block";

    finalScoreEl.textContent = totalScore;

    const starsContainer=document.getElementById('stars-container');
    starsContainer.innerHTML = '';

    for (let i=0; i<totalScore; i++){
        const starImg=document.createElement('img');
        starImg.src="https://www.pngall.com/wp-content/uploads/14/Mario-Star-PNG-Photos.png";
        starImg.alt='Star';
        starsContainer.appendChild(starImg)
    }

    if (totalScore ===questions[selectedCategory].length){
        console.log("perfect score! confetti time!!!")
        triggerConfetti();
    }
}

function resetGame() {
    selectedCategory='';
    currentQIdx = 0;
    totalScore=0;
    document.querySelector('#category-selection').style.display= "block";
    quizSection.style.display = "none";
    resultsSection.style.display="none"
}
/*------------------------ Event Listeners -----------------------------------------------*/

categoryBtns.addEventListener("click", (event)=> {
    if (event.target.tagName=== "BUTTON") {
        selectedCategory = event.target.textContent.trim();
        if (!questions[selectedCategory]) {
            console.error("Invalid category:", selectedCategory)
            return;
        }
        console.log("Selected category:", selectedCategory)
        startGame();
    }
});

answersEl.addEventListener('click', (event)=> {
    if (!event.target.classList.contains("answer-btn"))
        return;

    let selectedIdx= Number(event.target.dataset.index);
    let correctIdx=questions[selectedCategory][currentQIdx].correct;

    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.style.pointerEvents ="none"
    });

    if (selectedIdx===correctIdx) {
        totalScore++;
        event.target.classList.add('correct');
        console.log("playing correct sound...");
        correctSound.play();
    }else {
        event.target.classList.add('incorrect');
        console.log("Playing incorrect sound...")
        incorrectSound.play();
    }
    document.getElementById('next-question').disabled=false;
});

document.getElementById('next-question').addEventListener('click', ()=> {
    currentQIdx++;
    showQuestion();

    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct','incorrect');
        btn.style.pointerEvents="auto";
    });

    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled=false;
    });
});

playAgainBtn.addEventListener("click", ()=> {
    if(totalScore<3){
        betterLuckSound.play();
    }
   resetGame();
});
