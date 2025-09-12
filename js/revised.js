/*
    ui screens
*/

// screens
const startScreen = document.querySelector(".startScreen");
const mainScreen = document.querySelector(".mainScreen");
const resultScreen = document.querySelector(".resultScreen");
/*
functions contorl ui screens
*/
// show start screen / use when reset
const showStart = () => {
    // remove hide class to show start
    startScreen.classList.remove("hide");
    // add hide class to hide others
    mainScreen.classList.add("hide");
    resultScreen.classList.add("hide");
}

// show main test screen
const showMain = () => {
    // remove from  main
    mainScreen.classList.remove("hide");
    // add to others  
    startScreen.classList.add("hide");
    resultScreen.classList.add("hide");
}

// show result screen after test is finished
const showResult = () => {
    // remove from result
    resultScreen.classList.remove("hide");
    // add to others
    startScreen.classList.add("hide");
    mainScreen.classList.add("hide");
}

/*
    test select
*/
// html handlers 
let testSelect = document.querySelector("#testSelect");
let timeSelect = document.querySelector("#timeSelect");
let typeSelect = document.querySelector("#typeSelect");
let startBtn = document.querySelector("#startBtn");

/*
list of test databases
*/

/*
    test functions 
*/

/*
const variables
*/

const INCORRECT = "INCORRECT";
const CORRECT = "CORRECT";

const GOOD = "<span class='good'>";
const BAD = "<span class='bad'>";
const OK = "<span class='ok'>";
const END = "</span>";

/*
functions
*/

// check if good, ok, or bad
// if same index good, 
// word but in wrong place ok
// not in answer bad
const checkGood = (index, word, list) => {
    // check if word is at the correct index
    if (list[index] == word) {
        // return good
        return GOOD;
    }

    // check if word is at the correct index
    if (list[index].toUpperCase() == word.toUpperCase()) {
        // return good
        return OK;
    }

    for (let i = 0; i < list.length; i++) {
        // return ok
        if (list[i].toUpperCase() == word.toUpperCase()) {
            return OK;
        }
    }

    // word was not found 
    // return bad
    return BAD;
}

// takes two arrays and makes them same length by adding 
// empty strings
function arrayExtend(one, two) {
    if (one.length == two.length) {
        return;
    }

    // two is bigger
    if (one.length < two.length) {
        let len = two.length - one.length;
        for (let i = 0; i < len; i++) {
            one.push("*");
        }
        return;
    }

    // one is bigger
    let len = one.length - two.length;
    for (let i = 0; i < len; i++) {
        two.push("");
    }
}

// compare user answer and correct answer return result
const checkAnswer = (input, answer) => {
    let sInput = input.split(" ");
    let sAnswer = answer.split(" ");
    arrayExtend(sInput, sAnswer);
    console.log(sInput, sAnswer);

    // if one answer is longer than the other 
    // add empty strings until same length


    // result string 
    let result = [];

    let i = 0;
    for (let i = 0; i < sAnswer.length; i++) {
        let input = (i >= sInput.length) ? "" : sInput[i];
        let check = checkGood(i, input, sAnswer);
        result.push(check + input + END);
    }
    return result;
}

//console.log(VOCAB);

/*
start point
*/

const startTest = (testType, vocab, time) => {
    console.log(testType, vocab);
    // html elements
    const delimiters = /([,!?])/; // Regular expression to match delimiters (, ! ?)

    // buttons
    let enterBtn = document.querySelector("#enterBtn");
    let nextBtn = document.querySelector("#nextBtn");

    // inputs 
    let input = document.querySelector("#input");

    // question
    let questBtn = document.querySelector("#questBtn");
    let questText = document.querySelector("#questText");

    // outputs
    let output = document.querySelector("#output");
    let answerText = document.querySelector("#answerText");
    let questNumber = document.querySelector("#questNumber");

    // current answer
    let select;

    // current index start at -1 
    let index = -1;

    //shuffle the vocab words
    let shuffle = vocab.sort(() => Math.random() - 0.5);

    // button on click
    questBtn.addEventListener("click", () => {
        console.log(select.EN, select);
        const uttr = new SpeechSynthesisUtterance(select.EN);
        uttr.lang = 'en-US';
        uttr.rate = 0.7;
        speechSynthesis.speak(uttr);
    });


    // setup question
    const setup = () => {
        // increment and check if out of bounds
        index++;
        if (index >= vocab.length) {
            alert("test finish");
            return;
        }

        // start
        questNumber.innerHTML = `${index + 1} / ${vocab.length + 1}`;
        select = shuffle[index];
        output.innerHTML = "";
        input.value = "";
        answerText.innerHTML = select.EN;

        // list or read
        if (testType == "LIST") {
            // add audio to button
            questBtn.classList.remove("hide");
            questText.classList.add("hide");
        }
        else {
            questText.classList.remove("hide");
            questBtn.classList.add("hide");
            questText.innerHTML = select.JP;
        }

    }

    // next button clicked
    nextBtn.addEventListener("click", () => {
        // set button and text
        nextBtn.classList.add("hide")
        enterBtn.classList.remove("hide");
        setup();
    });

    // enter button submitt answer
    enterBtn.addEventListener("click", () => {
        let answer = select.EN;
        let userInput = input.value;

        // check the users answer
        let resultList = checkAnswer(userInput, answer);

        let correct = input.value == select.EN;
        let result = (correct) ? CORRECT : INCORRECT;
        output.innerHTML = resultList.join(" ");

        if (correct) {
            // change which button is visable
            nextBtn.classList.remove("hide")
            enterBtn.classList.add("hide");
        }

    });

    // start test timer 
    let seconds = time * 60;

    let timeHandle = document.querySelector("#time");

    const stringTime = () => {
        let min = Math.floor(seconds / 60);
        let s = seconds % 60;
        s = (s < 10) ? `0${s}` : `${s}`; 
        timeHandle.innerHTML = `${min}:${s}`;
    }

    stringTime();

    let handle = setInterval(() => {
        stringTime();
        seconds -= 1;

        if (seconds <= 0) {
            clearInterval(handle);
            showResult();
        }
    }, 1000);

    setup();
}

/*

start real one

*/

window.onload = function () {

    let startBtn = document.querySelector("#startBtn");
    startBtn.addEventListener("click", () => {
        console.log(testSelect.value);
        console.log("time: " + timeSelect.value);
        console.log(typeSelect.value);

        let time = Number(timeSelect.value);

        fetch(testSelect.value)
            .then((res) => res.text())
            .then((text) => {
                startTest(typeSelect.value, JSON.parse(text).data, time);
                showMain();
            })
            .catch((e) => console.error(e));
    });
}