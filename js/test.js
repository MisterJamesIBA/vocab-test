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

window.onload = () => {
    // html elements

    const hi = "Hello, world! How are you?";
    const delimiters = /([,!?])/; // Regular expression to match delimiters (, ! ?)

    // Split the string and include delimiters
    const result = hi.split(delimiters).filter(Boolean);

    console.log(result);

    // buttons
    let enter = document.querySelector("#enter");
    let next = document.querySelector("#next");
    let start = document.querySelector("#start");
    enter.disabled = true;
    next.disabled = true;

    // inputs 
    let input = document.querySelector("#input");

    // outputs
    let question = document.querySelector("#question");
    let output = document.querySelector("#output");
    let answerText = document.querySelector("#answerText");
    let questNumber = document.querySelector("#questNumber");

    // current answer
    let select;

    // current index start at -1 
    let index = -1;

    //shuffle the vocab words
    let shuffle = VOCAB.sort(() => Math.random() - 0.5);

    // setup question
    const setup = () => {
        // increment and check if out of bounds
        index++;
        if (index >= VOCAB.length) {
            alert("test finish");
            return;
        }
        // start
        questNumber.innerHTML = `${index + 1} / ${VOCAB.length + 1}`;
        select = shuffle[index];
        question.innerHTML = select.JP;
        output.innerHTML = "";
        input.value = "";
        answerText.innerHTML = select.EN;
    }

    // start button
    start.addEventListener("click", () => {
        start.disabled = true;
        enter.disabled = false;
        setup();
    });

    // next button clicked
    next.addEventListener("click", () => {
        // set button and text
        next.disabled = true;
        enter.disabled = false;
        setup();
    });

    // enter button submitt answer
    enter.addEventListener("click", () => {
        let answer = select.EN;
        let userInput = input.value;

        // check the users answer
        let resultList = checkAnswer(userInput, answer);

        let correct = input.value == select.EN;
        let result = (correct) ? CORRECT : INCORRECT;
        output.innerHTML = resultList.join(" ");

        // if correct make next button clickable and disable enter btn
        next.disabled = !correct;
        enter.disabled = correct;
    });
}