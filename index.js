// Getting all the required DOM Elements :
const botContainer = document.querySelector(".botMainContainer");
const botBody = document.querySelector(".bodyBotMainContainer");
const botSubmitBtn = document.querySelector(".footerBotSubmitBtn");
const botMicBtn = document.querySelector(".footerBotMicBtn");
const botQueryInput = document.querySelector(".footerBotSubmitInput");
const botIcon = document.querySelector(".botIconContainer");
const questionAnswerArray = [...questionAnswerArrayHardCode];

// On Click of Submit Btn or Enter Btn :
botSubmitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  botBody.scrollTo(0, botBody.scrollHeight);
  botLogicFunction();
});

// Logic of the Bot :
function botLogicFunction() {
  let resultOfNoArray = [];
  let maxOfResultOfNoArrayHardCoded = 0;
  let answerBasedOnlvD = [];

  displayMsg("bodyUserAnswerSectionDiv", botQueryInput.value);

  const userInputSplit = String(botQueryInput.value).toLowerCase().split(" ");

  questionAnswerArray.forEach((qaObject) => {
    // LOOP OF MACHINE KEYWORDS STARTS HERE :
    qaObject.keywords.forEach((qaKeywords) => {
      keywordsMathingFunction(qaKeywords, qaObject);
    });
  });

  // Each of the user input will be matched to all the keywords :
  function keywordsMathingFunction(qaKeywords, qaObject) {
    // LOOP OF USER INPUT STARTS HERE :
    userInputSplit.forEach((userQuestionWords) => {
      spellCheckFunction(qaKeywords, userQuestionWords, qaObject);
    });
  }

  function spellCheckFunction(qaKeywords, userQuestionWords, qaObject) {
    // Checking the length of the user and machine keyword and then mathing both of them :
    if (qaKeywords.length >= userQuestionWords.length) {
      userQuestionWords = userQuestionWords.padEnd(qaKeywords.length, "~");
    } else {
      qaKeywords = qaKeywords.padEnd(userQuestionWords.length, "~");
    }

    resultOfNoArray = [];
    let counter = 0;
    // LOOP FOR EACH CHAR IS DONE HERE :
    for (let b = 0; userQuestionWords.length > b; b++) {
      if (qaKeywords.includes(userQuestionWords[b])) {
        qaKeywords = qaKeywords.replace(userQuestionWords[b], "#");
      } else {
        counter += 1;
      }
    }

    // Levenshtein distance Algorithm :
    const lvDUserInput = userQuestionWords.length - counter;
    const lvDMachineQuestion = qaKeywords.length - counter;
    let resultOfNo = 0;

    resultOfNo =
      ((lvDUserInput + lvDMachineQuestion) /
        (userQuestionWords.length + qaKeywords.length)) *
      100;

    resultOfNoArray.push(resultOfNo);

    console.log(
      "+====+=====+==== : ",
      lvDUserInput,
      lvDMachineQuestion,
      resultOfNo
    );

    // Treshold condition :
    if (Math.max(...resultOfNoArray) > 60) {
      maxOfResultOfNoArrayHardCoded = Math.max(...resultOfNoArray);
      answerBasedOnlvD.push(qaObject.answer);
    }
  }
  //   Removing all the repeated answers :
  let answerBasedOnlvDSet = new Set(answerBasedOnlvD);

  //   Display the answer on the screen :
  if (maxOfResultOfNoArrayHardCoded > 50) {
    setTimeout(function () {
      answerBasedOnlvDSet.forEach((answer) => {
        displayMsg("bodyBotAnswerSectionDiv", answer);
        botBody.scrollTo(0, botBody.scrollHeight);
      });
    }, 1000);
  } else {
    displayMsg("bodyBotAnswerSectionDiv", "Sorry. Please enter a valid Input.");
  }

  botQueryInput.value = "";
  botBody.scrollTo(0, botBody.scrollHeight);
}

// Msg display Function :
function displayMsg(divClassAdd, msg) {
  const userSectionDiv = document.createElement("div");
  const userSectionP = document.createElement("p");
  userSectionP.classList.add("bodyBotAnswerSectionP");

  userSectionDiv.classList.add(divClassAdd);
  userSectionP.innerText = msg;
  userSectionDiv.appendChild(userSectionP);
  botBody.appendChild(userSectionDiv);
}

// On Click of the Bot Icon : - (to display the bot contaienr)
botIcon.addEventListener("click", function () {
  botContainer.style.display == "none"
    ? (botContainer.style.display = "block")
    : (botContainer.style.display = "none");

  botContainer.style.display == "block"
    ? this.classList.remove("botIconContainerMovementClass")
    : botIcon.classList.add("botIconContainerMovementClass");
});

botIcon.classList.add("botIconContainerMovementClass");

// On Click of Mic Icon :
botMicBtn.addEventListener("click", function () {
  speachToText();
});

// Function for the speach to text part :
function speachToText() {
  window.SpeechRecognition = webkitSpeechRecognition;
  const voiceRecognition = new SpeechRecognition();
  voiceRecognition.addEventListener("result", (e) => {
    const transcript = e.results[0][0].transcript;
    botQueryInput.value = transcript;
    botLogicFunction();
    console.log(transcript);
  });
  voiceRecognition.start();
}

// On Click of X Btn:
document.querySelector(".closeBotXIcon").addEventListener("click", () => {
  botContainer.style.display == "none"
    ? (botContainer.style.display = "block")
    : (botContainer.style.display = "none");
});

// On Click of Clear Btn :- (To delete all the elements in the bot)
document.querySelector(".deleteItemsIcon").addEventListener("click", () => {
  botBody.innerHTML = "";
});
