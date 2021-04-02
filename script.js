let cursorIndex = 0;
let wordsIndex = 0;
let prompt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tellus felis, pellentesque et velit blandit, ullamcorper ultrices eros. Donec faucibus leo ac malesuada lacinia. In ultrices laoreet orci, ac volutpat dolor accumsan porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nisi metus, molestie vitae ex dapibus, porta suscipit elit. Donec ac placerat ante. Etiam mollis dolor a arcu consectetur rutrum. In porttitor justo at diam sagittis, ut molestie ante malesuada. Cras nec velit eros. Nunc consectetur quam sit amet facilisis pharetra. Etiam fermentum sit amet sapien in semper. Aenean nec enim leo. Duis quis tincidunt massa, viverra finibus ipsum. Maecenas eu molestie tellus.";
let words = prompt.split(" ");
let typedWords = "";
let remainingWords = "";
let input = "";
let numberIncorrect = 0;
let incorrectFlag = false;

let correctLetters = "";
let untypedLetters = "";
let started = false;
let currentPromptType = "";
let slimesKilled = 0;

const promptEl = document.getElementById("prompt-div")
const inputEl = document.getElementById("type-input")

var startTime, endTime;

document.getElementById("mobile-warning").addEventListener('click', function(e) {
    document.getElementById("mobile-warning").style="display:none;";
})

function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  timeDiff /= 1000;
  return timeDiff;
}

function setPrompt(newPrompt) {
    cursorIndex = 0;
    wordsIndex = 0;
    prompt = newPrompt;
    words = newPrompt.split(" ");
    typedWords = "";
    remainingWords = "";
    input = "";
    started = false;
    numberIncorrect = 0;

    correctLetters = "";
    untypedLetters = "";
    promptEl.textContent = newPrompt;
    remainingWords = newPrompt;
}

function updatePromptTypedWords() {
    let promptHTML = `<span class="typed">${typedWords}</span><span class="typed">${correctLetters}</span>${untypedLetters}${remainingWords}`
    promptEl.innerHTML = promptHTML;
}

function updateInputVar() {

}
function enterWord() {
    typedWords += inputEl.value;
    inputEl.value = "";
    wordsIndex++;

    updatePromptTypedWords();
}

function createLogEntry(entryType, WPM, accuracy, characters, time, reactionWPM = 0) {
    let adjective;
    let punctuation;
    if (entryType == "attack") {
        if (accuracy >= 100) {
            adjective = "Perfect";
            punctuation = "!!";
        } else if (accuracy >= 98) {
            adjective = "Great";
            punctuation = "!";
        } else if (accuracy >= 96) {
            adjective = "Good";
            punctuation = ".";
        } else {
            adjective = "OK";
            punctuation = ".";
        }
    } else if (entryType == "reaction") {
        if (WPM > reactionWPM && accuracy >= 100) {
            adjective = "Perfect";
            punctuation = "!!";
        } else if (WPM > reactionWPM) {
            adjective = "Good";
            punctuation = ".";
        } else {
            adjective = "OK";
            punctuation = ".";
        }
    } else if (entryType == "--") {
        adjective = "-";
        punctuation = "-";
    }
    

    let html = `<div class="entry">
                <p>${adjective} ${entryType}${punctuation}</p>
                <p>WPM: ${WPM}</p>
                <p>Accuracy: ${accuracy}%</p>
                <p>Characters: ${characters}</p>
                <p>Time Elapsed: ${time}s</p>
    </div>`
    document.getElementById("log").innerHTML = html;
}

function enterLetter() {
    if (started == false) {
        started = true;
        start();
    }
    if (wordsIndex == words.length - 1 && inputEl.value == words[wordsIndex]) {
        document.getElementById("prompt-div").style = "";
        if (incorrectFlag == true) {
            incorrectFlag = false;
        }
        correctLetters = "";
        remainingWords = "";
        enterWord();
        finish();
    } else if (inputEl.value == words[wordsIndex] + " ") {
        document.getElementById("prompt-div").style = "";
        correctLetters = "";
        cursorIndex = inputEl.value.length + typedWords.length;
        enterWord();
    } else if (words[wordsIndex].startsWith(inputEl.value)) {
        document.getElementById("prompt-div").style = "";
        correctLetters = inputEl.value;
        cursorIndex = inputEl.value.length + typedWords.length;
        remainingWords = prompt.substring(cursorIndex);
        updatePromptTypedWords();
    } else {
        document.getElementById("prompt-div").style = "background-color: #FFCCCB;";
        if (incorrectFlag == false) {
            incorrectFlag = true;
            // document.getElementById("prompt-div").classList = "incorrect";
            // setTimeout(function() {
            //     document.getElementById("prompt-div").classList = "";
            // }, 200);
        }
        if (!(input.length - 1 == inputEl.value || input.startsWith(inputEl.value))) {
            numberIncorrect++;
        }
    }
    input = inputEl.value;
}

function finish() {
    if (currentPromptType == "attack") {
        finishAttack();
    } else if (currentPromptType == "reaction") {
        finishReaction();
    }
    
}
function finishReaction() {
    WPMWords = prompt.length / 5
    endTime = end()
    WPMTime = endTime / 60;
    WPM = Math.floor(WPMWords / WPMTime);

    accuracy = (((prompt.length - numberIncorrect) / prompt.length) * 100).toFixed(2);
    
    createLogEntry("reaction", WPM, accuracy, prompt.length, endTime);
    
    if (WPM > currentEnemy.reactionWPM && accuracy >= 100) {
        Player.changeHealth(0);
    } else if (WPM > currentEnemy.reactionWPM) {
        Player.changeHealth(Math.floor(currentEnemy.attack / (WPM * accuracy / currentEnemy.WPMFloor * 100)));
    } else {
        Player.changeHealth(Math.floor(currentEnemy.attack / (WPM * accuracy / currentEnemy.WPMFloor) * 150));
    }

}
function finishAttack() {
    WPMWords = prompt.length / 5
    endTime = end()
    WPMTime = endTime / 60;
    WPM = Math.floor(WPMWords / WPMTime);
    

    accuracy = (((prompt.length - numberIncorrect) / prompt.length) * 100).toFixed(2);
    
    createLogEntry("attack", WPM, accuracy, prompt.length, endTime);

    let damage = (calculateDefenseDamage(Player.attack * calculateWPMDamageMultiplier(WPM, accuracy, currentEnemy.WPMFloor), currentEnemy.defense))
    currentEnemy.changeHealth(damage);
}

inputEl.addEventListener("input", function(e) {
    enterLetter();
})

class Enemy {
    constructor(name, health, defense, WPMFloor, attack, prompts) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.defense = defense;
        this.WPMFloor = WPMFloor;
        this.attack = attack;
        this.prompts = prompts;
    }

    displayHP = function() {
        document.getElementById("enemy-hp").textContent = this.health + "/" + this.maxHealth + " HP";
    }

    generateReaction = function() {
        document.getElementById("prompt-input-div").className = "reaction";

        document.getElementById("prompt-label").textContent = "Reaction";
        currentPromptType = "reaction";
        setPrompt(this.prompts[Math.floor(Math.random() * this.prompts.length)]);
    }
    changeHealth = function(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            killEnemy();
        } else {
            this.displayHP();
            this.generateReaction();
        }
        
    }
}

function killEnemy() {
    document.getElementById("enemy-div").className = "dead";
    setTimeout(function() {
        document.getElementById("enemy-div").className = "";
    }, 350)
    slimesKilled++;
    Player.displaySlimesKilled();
    let enemy = new Enemy("Slime", 150, 10, 80, 10, pangramPrompts);
    setEnemy(enemy);
    Player.generateAttack();
}

pangramPrompts = [
    "The quick brown fox jumps over a lazy dog.",
    "Waltz, nymph, for quick jigs vex Bud.",
    "Sphinx of black quartz, judge my vow.",
    "Pack my box with five dozen liquor jugs.",
    "Glib jocks quiz nymph to vex dwarf.",
    "Jackdaws love my big sphinx of quartz.",
    "The five boxing wizards jump quickly.",
    "How vexingly quick daft zebras jump!",
    "Quick zephyrs blow, vexing daft Jim.",
    "Two driven jocks help fax my big quiz.",
    "The jay, pig, fox, zebra and my wolves quack!",
    "Sympathizing would fix Quaker objectives.",
    "A wizard's job is to vex chumps quickly in fog.",
    `Watch "Jeopardy!", Alex Trebek's fun TV quiz game.`,
    "By Jove, my quick study of lexicography won a prize!",
    "Waxy and quivering, jocks fumble the pizza."
]

var quotes = [
    "Life isn't about getting and having, it's about giving and being.",
    "Whatever the mind of man can conceive and believe, it can achieve.",
    "Strive not to be a success, but rather to be of value.",
    "Two roads diverged in a wood, and I-I took the one less traveled by, And that has made all the difference.",
    "I attribute my success to this: I never gave or took any excuse.",
    "You miss 100% of the shots you don't take.",
    "The most difficult thing is the decision to act, the rest is merely tenacity.",
    "Every strike brings me closer to the next home run.",
    "Definiteness of purpose is the starting point of all achievement.",
    "We must balance conspicuous consumption with conscious capitalism.",
    "Life is what happens to you while you're busy making other plans.",
    "We become what we think about.",
    "Life is 10% what happens to me and 90% of how I react to it.",
    "The most common way people give up their power is by thinking they don't have any.",
    "The mind is everything. What you think you become.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "An unexamined life is not worth living.",
    "Eighty percent of success is showing up.",
    "Your time is limited, so don't waste it living someone else's life.",
    "Winning isn't everything, but wanting to win is.",
    "I am not a product of my circumstances. I am a product of my decisions.",
    "Every child is an artist. The problem is how to remain an artist once he grows up.",
    "You can never cross the ocean until you have the courage to lose sight of the shore.",
    "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
    "Either you run the day, or the day runs you.",
    "Whether you think you can or you think you can't, you're right.",
    "The two most important days in your life are the day you are born and the day you find out why.",
    "Whatever you can do, or dream you can, begin it. Boldness has genius, power and magic in it.",
    "The best revenge is massive success.",
    "People often say that motivation doesn't last. Well, neither does bathing. That's why we recommend it daily.",
    "Life shrinks or expands in proportion to one's courage.",
    "If you hear a voice within you say \"you cannot paint,\" then by all means paint and that voice will be silenced.",
    "There is only one way to avoid criticism: do nothing, say nothing, and be nothing.",
    "Ask and it will be given to you; search, and you will find; knock and the door will be opened for you.",
    "The only person you are destined to become is the person you decide to be.",
    "Go confidently in the direction of your dreams. Live the life you have imagined.",
    "When I stand before God at the end of my life, I would hope that I would not have a single bit of talent left and could say, I used everything you gave me.",
    "Few things can help an individual more than to place responsibility on him, and to let him know that you trust him.",
    "Certain things catch your eye, but pursue only those that capture the heart.",
    "Believe you can and you're halfway there.",
    "Everything you've ever wanted is on the other side of fear.",
    "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.",
    "Teach thy tongue to say, \"I do not know,\" and thous shalt progress.",
    "Start where you are. Use what you have. Do what you can.",
    "Fall seven times and stand up eight.",
    "When one door of happiness closes, another opens, but often we look so long at the closed door that we do not see the one that has been opened for us.",
    "Everything has beauty, but not everyone can see.",
    "How wonderful it is that nobody need wait a single moment before starting to improve the world.",
    "When I let go of what I am, I become what I might be.",
    "Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
    "Happiness is not something readymade. It comes from your own actions.",
    "If you're offered a seat on a rocket ship, don't ask what seat! Just get on.",
    "If the wind will not serve, take to the oars.",
    "You can't fall if you don't climb. But there's no joy in living your whole life on the ground.",
    "We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.",
    "Too many of us are not living our dreams because we are living our fears.",
    "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
    "If you want to lift yourself up, lift up someone else.",
    "I have been impressed with the urgency of doing. Knowing is not enough; we must apply. Being willing is not enough; we must do.",
    "Limitations live only in our minds. But if we use our imaginations, our possibilities become limitless.",
    "You take your life in your own hands, and what happens? A terrible thing, no one to blame.",
    "What's money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.",
    "I didn't fail the test. I just found 100 ways to do it wrong.",
    "In order to succeed, your desire for success should be greater than your fear of failure.",
    "A person who never made a mistake never tried anything new.",
    "The person who says it cannot be done should not interrupt the person who is doing it.",
    "There are no traffic jams along the extra mile.",
    "It is never too late to be what you might have been.",
    "You become what you believe.",
    "I would rather die of passion than of boredom.",
    "A truly rich man is one whose children run into his arms when his hands are empty.",
    "It is not what you do for your children, but what you have taught them to do for themselves, that will make them successful human beings.",
    "If you want your children to turn out well, spend twice as much time with them, and half as much money.",
    "Build your own dreams, or someone else will hire you to build theirs.",
    "The battles that count aren't the ones for gold medals. The struggles within yourself–the invisible battles inside all of us–that's where it's at.",
    "Education costs money. But then so does ignorance.",
    "I have learned over the years that when one's mind is made up, this diminishes fear.",
    "It does not matter how slowly you go as long as you do not stop.",
    "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
    "Remember that not getting what you want is sometimes a wonderful stroke of luck.",
    "You can't use up creativity. The more you use, the more you have.",
    "Dream big and dare to fail.",
    "Our lives begin to end the day we become silent about things that matter.",
    "Do what you can, where you are, with what you have.",
    "If you do what you've always done, you'll get what you've always gotten.",
    "Dreaming, after all, is a form of planning.",
    "It's your place in the world; it's your life. Go on and do all you can with it, and make it the life you want to live.",
    "You may be disappointed if you fail, but you are doomed if you don't try.",
    "Remember no one can make you feel inferior without your consent.",
    "Life is what we make it, always has been, always will be.",
    "The question isn't who is going to let me; it's who is going to stop me.",
    "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.",
    "It's not the years in your life that count. It's the life in your years.",
    "Change your thoughts and you change your world.",
    "Either write something worth reading or do something worth writing.",
    "Nothing is impossible, the word itself says, \"I'm possible!\"",
    "The only way to do great work is to love what you do.",
    "If you can dream it, you can achieve it."
]

var Player = {
    health: 100,
    maxHealth: 100,
    defense: 10,
    attack: 40,
    prompts: quotes,

    generateAttack: function() {
        document.getElementById("prompt-label").textContent = "Attack";
        document.getElementById("prompt-input-div").className = "attack";
        let firstPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        let secondPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        if (this.prompts.length != 1) {
            while (secondPrompt == firstPrompt) {
                secondPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
            }
        }
        currentPromptType = "attack";
        setPrompt(firstPrompt + " " + secondPrompt);
    },

    changeHealth: function(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.health = 0;
            gameOver();
        } else {
            this.generateAttack();
        }
        this.displayHP();
    },

    displayHP: function() {
        document.getElementById("player-currenthp").textContent = this.health;
        document.getElementById("player-maxhp").textContent = this.maxHealth;

    },

    displaySlimesKilled: function() {
        document.getElementById("slimes-killed").textContent = slimesKilled;
    }
}

function gameOver() {
    setPrompt(" ");
    cursorIndex = -1;
    wordsIndex = -1;
    document.getElementById("prompt-input-div").className = "gameOver";
    document.getElementById("prompt-label").textContent = "Game Over";
    
    document.getElementById("prompt-div").innerHTML = '<span class="typed">Game over! Refresh the page to start over</span>'
}

var slime = new Enemy("Slime", 150, 10, 80, 10, pangramPrompts)
let currentEnemy;
function setEnemy(enemy) {
    currentEnemy = enemy;
    document.getElementById("enemy-name").textContent = enemy.name;
    enemy.displayHP();
}

function calculateDefenseDamage(damageAmount, defenseValue) {
    return Math.floor(damageAmount * (100/(100 + defenseValue)));
}
function calculateWPMDamageMultiplier(WPM, accuracy, WPMFloor) {
    let WPMCeiling = WPMFloor + 30;
    if (WPM < WPMFloor) {
        accuracy *= .5;
    }
    if (accuracy >= 1.00) {
        accuracy = 1.5;
    } else if (accuracy >= 99) {
        accuracy = 1.2;
    } else if (accuracy >= 98) {
        accuracy = 1.1;
    }
    if (WPM <= WPMCeiling) {
        return (WPM+WPMFloor)/WPMFloor / 2 * accuracy;
    }
    if (WPM > WPMCeiling) {
        return (WPM+WPMFloor)/WPMFloor / 2 * accuracy * 1.5;
    }
}

Player.displayHP();
Player.displaySlimesKilled();
Player.generateAttack();
setEnemy(slime);
createLogEntry("--", "-", "-", "-", "-");