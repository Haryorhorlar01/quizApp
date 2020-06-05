/************************************************
 * ************Quiz Controller*******************
 * **********************************************/ 
let quizController = (function () {
    
    // *******Question Constructor*************
    function Question(id, questionText, options, correctAnswer) {   
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    let questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    };
    
    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    quizProgress = {
        questionIndex: 0,
    };

    // **********PersonConstructor**********
    function Person(id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    let currentPersonData = {
        fullname: [],
        score: 0
    };

    let adminFullName = ['admin', 'admin'];

    let personLocalStorage = {
        setPersonData: function(newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: function() {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function() {
            localStorage.removeItem('personData');
        },
    };

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {
        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function (newQuestText, opts) {
            let optionArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            optionArr = [];
            isChecked = false;

            for (let i = 0; i < opts.length; i++) {
                if (opts[i].value !== '') {
                    optionArr.push(opts[i].value);
                }

                if (opts[i].previousElementSibling.checked && opts[i].value !== '') {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }


            if (newQuestText.value !== '') {
                if (optionArr.length > 1) {
                    if (isChecked) {
                        newQuestion = new Question(questionId, newQuestText.value, optionArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);
                        newQuestText.value = "";

                        for (let x = 0; x < opts.length; x++) {
                            opts[x].value = '';
                            opts[x].previousElementSibling.checked = false;
                        }

                        console.log(questionLocalStorage.getQuestionCollection());
                        return true;
                    } else {
                        alert('You missed to check correct answer, or you checked answer without value');
                        return false;
                    }
                
                } else {
                    alert('You must insert at least two options');
                    return false;
                }

            } else {
                alert('Please, Insert Question');
                return false;
            }

        },
        checkAnswer: function (ans) {
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
                currentPersonData.score++;
                return true;
            } else {
                return false;
            }
        }, 
        isFinished: function () {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },
        addPerson: function () {
            let newPerson, personId, personData;

            if (personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currentPersonData.fullname[0], currentPersonData.fullname[1], currentPersonData.score);
            personData = personLocalStorage.getPersonData();
            personData.push(newPerson);
            personLocalStorage.setPersonData(personData);
            console.log(newPerson)
        },

        getCurrPersonData: currentPersonData,
        getAdminFullName: adminFullName,
        getPersonLocalStorage: personLocalStorage,
    };
})();


/************************************************
 * ************UI Controller*******************
 * **********************************************/
let UIController = (function () {
    
    let domItems = {
        // ********Admin Panel Elements***********
        adminPanelSection: document.querySelector('.admin-panel-container'),
        questionInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        addOptionsContainer: document.querySelector('.admin-options-container'),
        insertQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questionUpdateBtn: document.getElementById('question-update-btn'),
        questionDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('question-clear-btn'),
        resultListWrapper: document.querySelector('.results-list-wrapper'),
        clearResultsBtn: document.getElementById('results-clear-btn'),
        // *********Quiz Section Elements***********
        quizSection: document.querySelector('.quiz-container'),
        askedQuestText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressPar: document.getElementById('progress'),
        instAnsContainer: document.querySelector('.instant-answer-container'),
        instAnsText: document.getElementById('instant-answer-text'),
        instAnsDiv: document.getElementById('instant-answer-wrapper'),
        emotionIcon: document.getElementById('emotion'),
        nextQuestbtn: document.getElementById('next-question-btn'),
        // ***********Landing Page Elements*********
        landPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        // *********Final Result Section Element*************
        finalResultSection: document.querySelector('.final-result-container'),
        finalScoreText: document.getElementById('final-score-text'),
    };

    return {
        getDomItems: domItems,

        addInputsDynamically: function () {
            let addInput = function () {
                let inputHTML, z;

                z = document.querySelectorAll('.admin-option').length;

                inputHTML = `<div class="admin-option-wrapper"> <input type="radio" class="admin-option-'+ z +'" name="answer" value="'+ z +'">
                            <input type="text" class="admin-option  admin-option-'+ z +'" name="answer" value=""></div>`;

                domItems.addOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
                domItems.addOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.addOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            };
            domItems.addOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        createQuestionList: function (getQuestions) {
            let questHTML, numberingArr;

            numberingArr = [];

            domItems.insertQuestsWrapper.innerHTML = '';
            
            for (let i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                numberingArr.push(i + 1);

                questHTML = '<p><span>'+ numberingArr[i] +'.'+ getQuestions.getQuestionCollection()[i].questionText +'</span><button id="question-'+ getQuestions.getQuestionCollection()[i].id +'">Edit</button></p>';

                domItems.insertQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        editQuestList: function (event, storageQuestList, addInpsDynFn, updateQuestsListFn) {
            let getId, getStorageQuestList, foundItem, placeInArr, optionHTML;

            if ('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestList = storageQuestList.getQuestionCollection();
                
                for (let i = 0; i < getStorageQuestList.length; i++) {
                    if (getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];
                        placeInArr = i;
                    }
                }
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.addOptionsContainer.innerHTML = '';
                optionHTML = '';
                for (let x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-option-wrapper"><input type = "radio" class="admin-option-' + x + '" name = "answer" value = "' + x + '" ><input type="text" class="admin-option  admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>'
                }
                
                domItems.addOptionsContainer.innerHTML = optionHTML;
                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents = 'none';
                addInpsDynFn();

                let backToDefaultview = function () {
                    let updatedOptions;

                    updatedOptions = document.querySelectorAll('.admin-option');

                    domItems.newQuestionText.value = '';

                    for (let i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }
                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.questionInsertBtn.style.visibility = 'visible';
                    domItems.questsClearBtn.style.pointerEvents = '';

                    updateQuestsListFn(storageQuestList);
                }
                
                let updateQuest = function () {
                    let newOptions, optionEls;

                    newOptions =  [];

                    optionEls = document.querySelectorAll('.admin-option');
                    
                    foundItem.questionText = domItems.newQuestionText.value;

                    foundItem.correctAnswer = '';

                    for (let i = 0; i < optionEls.length; i++) {
                        if (optionEls[i].value !== '') {
                            newOptions.push(optionEls[i].value);

                            if (optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionEls[i].value;
                            }
                        }
                    }
                    
                    foundItem.options = newOptions;

                    if (foundItem.questionText !== '') {
                        if (foundItem.correctAnswer !== '') {
                            if (foundItem.options.length > 1) {
                                getStorageQuestList.splice(placeInArr, 1, foundItem);

                                storageQuestList.setQuestionCollection(getStorageQuestList);

                                backToDefaultview();

                            } else {
                                alert('You must insert at least two options');
                            }
                        
                        } else {
                            alert('You missed to check correct answer, or you checked value without option');
                        }
                    
                    } else {
                        alert('Please Insert Question');
                    }

                }
                domItems.questionUpdateBtn.addEventListener('click', updateQuest);
                
                let deleteQuestion = function () {
                    getStorageQuestList.splice(placeInArr, 1);
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    backToDefaultview();
                }

                domItems.questionDeleteBtn.onclick = deleteQuestion;
            }
        },
        clearQuestList: function (storageQuestList) {
            if (storageQuestList.getQuestionCollection() !== null) {
                if (storageQuestList.getQuestionCollection().length > 0) {
                    const $confirm = confirm('Warning! You will lose entire question list');

                    if ($confirm) {
                        storageQuestList.removeQuestionCollection();
                        domItems.insertQuestsWrapper.innerHTML = '';
                    }
                }
            }
        },
        displayQuestion: function (storageQuestList, progress) {
            let newOptionHTML, characterArr;
            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

            if (storageQuestList.getQuestionCollection().length > 0) {
                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                domItems.quizOptionsWrapper.innerHTML = '';

                for (let i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + 
                    '</span><p class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },
        displayProgress: function (storageQuestList, progress) {
            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
            domItems.progressBar.value = progress.questionIndex + 1;
            domItems.progressPar.textContent = 'Question ' + (progress.questionIndex + 1) + ' of ' + storageQuestList.getQuestionCollection().length;
        },

        newDesign: function (ansResult, selectedAnswer) {
            let twoOptions, index;

            index = 0;

            if (ansResult) {
                index = 1;
            }

            twoOptions = {
                instantAnswerText: ['This answer is wrong', 'This answer is correct'],
                instAnswerClass: ['red', 'green'], 
                emotionType: ['images/sad.png', 'images/happy.png'],
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
            }

            domItems.quizOptionsWrapper.style.cssText = 'opacity: 0.6; pointer-events: none;';
            domItems.instAnsContainer.style.opacity = '1';
            domItems.instAnsText.textContent = twoOptions.instantAnswerText[index];
            domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);
            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
        },
        resetDesign: function () {
            domItems.quizOptionsWrapper.style.cssText = '';
            domItems.instAnsContainer.style.opacity = '0';
        },

        getFullName: function (currPerson, storageQuestList, admin) {
            if (domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {

                if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {
                    if (storageQuestList.getQuestionCollection().length > 0) {
                        currPerson.fullname.push(domItems.firstNameInput.value);
                        currPerson.fullname.push(domItems.lastNameInput.value);
                        domItems.landPageSection.style.display = 'none';
                        domItems.quizSection.style.display = 'block';
                        console.log(currPerson);
                    } else {
                        alert('Quiz is not ready, please contact to administrator');
                    }
                } else {
                    domItems.landPageSection.style.display = 'none';
                    domItems.adminPanelSection.style.display = 'block';
                }
            } else {
                alert('Please, enter your first name and last name');
            }
        },
        finalResult: function (currPerson) {
            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' + currPerson.score;

            domItems.quizSection.style.display = 'none';
            domItems.finalResultSection.style.display = 'block';
        },

        addResultOnPanel: function (userData) {
            let resultHTML;

            domItems.resultListWrapper.innerHTML = '';

            for (let i = 0; i < userData.getPersonData().length; i++) {
                
                resultHTML = '<p class="person person- ' + i + '"><span class="person- ' + i + '">' + userData.getPersonData()[i].firstname + 
                ' ' + userData.getPersonData()[i].lastname + ' - ' + userData.getPersonData()[i].score + 
                ' Points</span><button id = "delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn" > Delete</button ></p >'

                domItems.resultListWrapper.insertAdjacentHTML('afterBegin', resultHTML);
            }
        },

        deleteResult: function (event, userData) {
            let getId, personArr;

            personArr = userData.getPersonData();

            if ("delete-result-btn_".indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('_')[1]);
                console.log(getId);

                for (let i = 0; i < personArr.length; i++) {
                    if (personArr[i].id === getId) {
                        personArr.splice(i, 1);
                        userData.setPersonData(personArr);
                    }
                }
            }
        },
        clearResultsList: function (userData) {
                let $confirm;

                if (userData.getPersonData().length !== null) {

                    if (userData.getPersonData().length > 0) {

                    $confirm = confirm('Warning!, you will lose entire result list');
                    if ($confirm) {
                        userData.removePersonData();
                        domItems.resultListWrapper.innerHTML = '';
                    }
                }
            }
        }
    }; 
})();


/************************************************
* ************Controller*******************
* **********************************************/
let controller = (function (quizCtrl, UICtrl) {
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    UICtrl.addInputsDynamically();

    const selectedDomItems = UICtrl.getDomItems;

    selectedDomItems.questionInsertBtn.addEventListener('click', function () {
        let adminOptions = document.querySelectorAll('.admin-option');
        let checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);

        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });

    selectedDomItems.insertQuestsWrapper.addEventListener('click', function (e) {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
    });

    selectedDomItems.questsClearBtn.addEventListener('click', function () {
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });

    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
    selectedDomItems.quizOptionsWrapper.addEventListener('click', function (e) {
        let updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for (let i = 0; i < updatedOptionsDiv.length; i++) {
            if (e.target.className === 'choice-' + i) {
                const answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                const answerResult = quizCtrl.checkAnswer(answer);
                UICtrl.newDesign(answerResult, answer);

                if (quizCtrl.isFinished()) {
                    selectedDomItems.nextQuestbtn.textContent = 'Quiz Ended';
                }
                
                let nextQuestion = function (questData, progress) {
                    if (quizCtrl.isFinished()) {
                        console.log('finished')
                        quizCtrl.addPerson();

                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                    
                    } else {
                        UICtrl.resetDesign();

                        quizCtrl.getQuizProgress.questionIndex++

                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                    }
                }

                selectedDomItems.nextQuestbtn.onclick = function () {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                }
            }
        }
    });
    selectedDomItems.startQuizBtn.addEventListener('click', function () {
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });

    selectedDomItems.lastNameInput.addEventListener('focus', function () {
        selectedDomItems.lastNameInput.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
        });
    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    selectedDomItems.resultListWrapper.addEventListener('click', function (e) {
        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);

        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
        
    });

    selectedDomItems.clearResultsBtn.addEventListener('click', function () {
        UICtrl.clearResultsList(quizCtrl.getPersonLocalStorage);
    })
})(quizController, UIController);