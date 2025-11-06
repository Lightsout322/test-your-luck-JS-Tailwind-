const PLAY_COST = 100;
const WIN_PROBABILITY = 0.1;
const REWARD_FOR_WIN = 1000;

let balance = 1000;

let scriptedLossesOnStart = 9;
let forcedWinIfBankrupt = false;
let forcedWinUsed = false;

const playBtn = document.getElementById("playBtn");
const playEl = document.getElementById("play");
const balanceEl = document.getElementById("balance");

let messageTimeout = null;



function setPlayMessage(msg, autoReset = true, delay = 1500) {
    if (messageTimeout) {
        clearTimeout(messageTimeout);
        messageTimeout = null;
    }

    playEl.textContent = msg;

    if (autoReset) {
        messageTimeout = setTimeout(() => {
            playEl.textContent = 'Нажмите "Играть"';
            messageTimeout = null;
        }, delay);
    }
}

playBtn.addEventListener("click", function () {
    if (balance < PLAY_COST) {
        setPlayMessage("Вы в долгах!", false);
        playBtn.disabled = true;
        return;
    }

    playBtn.disabled = true;
    setTimeout(() => {
        if (balance >= PLAY_COST) {
            playBtn.disabled = false;
        }
    }, 1500);

    const oldBalance = balance;
    const guaranteedWin = forcedWinIfBankrupt && !forcedWinUsed && balance === PLAY_COST;

    let reward = 0;

    if (scriptedLossesOnStart > 0) {
        balance -= PLAY_COST;
        scriptedLossesOnStart--;

        if (scriptedLossesOnStart === 0 && balance === PLAY_COST) {
            forcedWinIfBankrupt = true;
        }

        setPlayMessage("🥀Смерть в нищете🥀", true, 1500);
    } else if (guaranteedWin) {
        balance -= PLAY_COST;
        reward = REWARD_FOR_WIN;
        balance += reward;

        forcedWinUsed = true;
        forcedWinIfBankrupt = false;

        setPlayMessage("🥳УРА, НИСКОЛЬКО НЕ ПОДКРУЧЕННАЯ ПОБЕДА🥳", true, 1500);
    } else {
        balance -= PLAY_COST;
        const winLose = Math.random() < WIN_PROBABILITY;
        reward = winLose ? REWARD_FOR_WIN : 0;
        balance += reward;

        setPlayMessage(winLose ? "🥳УРА,ПОБЕДА🥳" : "🥀Смерть в нищете🥀", true, 1500);
    }

    balanceEl.textContent = "Баланс: " + balance;

    if (balance < PLAY_COST) {
        setPlayMessage("Вы в долгах!", false);
        playBtn.disabled = true;
    }

    balanceEl.classList.remove("bg-green-400", "bg-red-400");
    if (balance > oldBalance) {
        balanceEl.classList.add("bg-green-400");
    } else if (balance < oldBalance) {
        balanceEl.classList.add("bg-red-400");
    }

    setTimeout(() => {
        balanceEl.classList.remove("bg-green-400", "bg-red-400");
    }, 1500);
});


