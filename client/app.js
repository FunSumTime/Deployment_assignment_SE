const BACKEND_URL = "http://boxers.theisen.fit";

let allboxers = [];

let currentBoxer = null;

let playerHealth = 100;

let opponentHealth = 100;

let moves = ["punch", "block", "counter"];

let game = false;
let editing = false;
let fight_over = false;
let isGameInProgress = false;

let viewmanager = document.getElementById("view-manager");
let viewGame = document.getElementById("view-game");

let boxerForm = document.getElementById("boxer-form");
let boxerInput = document.getElementById("boxer-id");
let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let formSubmitBtn = document.getElementById("form-submit-btn");
let boxerListDiv = document.getElementById("boxer-list");
let boxerListEmptyMsg = document.getElementById("boxer-list-empty");
let gameControls = document.getElementById("game-controls");

let playerHealthBar = document.querySelector(
  "#player-health-bar .health-bar-inner"
);

let opponentHealthBar = document.querySelector(
  "#opponent-health-bar .health-bar-inner"
);

let playerFigure = document.getElementById("player-figure");
let opponentFigure = document.getElementById("opponent-figure");
let gameMessage = document.getElementById("game-message");

let modal = document.getElementById("game-over-modal");
let modalTitle = document.getElementById("modal-title");
let modalBody = document.getElementById("modal-body");

function swithcView(viewName) {
  viewmanager.classList.remove("active");
  viewGame.classList.remove("active");
  if (viewName == "manager") {
    viewmanager.classList.add("active");
    loadBoxers();
  } else {
    viewGame.classList.add("active");
    startGame();
    
  }
}

// function showModal() {

// }

function loadBoxers() {
  allboxers = [];
  boxerListDiv.innerHTML = " ";

  fetch(BACKEND_URL).then(function (response) {
    response.json().then(function (data) {
      //console.log(data);
      data.forEach(load_boxer);
    });
  });
  //console.log(allboxers);
}

function load_boxer(boxer) {
  //console.log(boxer);
  let card = document.createElement("div");
  card.className = "boxer-card";
  let boxerinfo = document.createElement("div");
  boxerinfo.classList.add("boxer-info");
  let Name = document.createElement("h3");
  Name.innerHTML = boxer["first_name"] + " " + boxer["last_name"];
  let record = document.createElement("p");
  record.innerHTML =
    boxer["wins"] + "W / " + boxer["loses"] + "L , " + boxer["gold"] + " gold";
  boxerinfo.appendChild(Name);
  boxerinfo.appendChild(record);
  card.appendChild(boxerinfo);

  let buttons = document.createElement("div");
  buttons.classList.add("boxer-actions");
  let fight = document.createElement("button");
  fight.classList.add("btn", "btn-primary", "btn-fight");
  fight.onclick = function () {
    console.log("boxer with is about to fight with id ", boxer.id);
    currentBoxer = boxer;
    swithcView("FIGHT");
  };
  fight.innerHTML = "Fight";

  let edit = document.createElement("button");
  edit.classList.add("btn", "btn-secondary", "btn-edit");
  edit.onclick = function () {
    // console.log("boxer is about to edit with id ", boxer.id);

    firstNameInput.value = boxer["first_name"];
    lastNameInput.value = boxer["last_name"];
    formSubmitBtn.innerHTML = "Edit Boxer";
    currentBoxer = boxer;
    //console.log(currentBoxer);
  };
  edit.innerHTML = "Edit";
  let delete_ = document.createElement("button");
  delete_.classList.add("btn", "btn-secondary", "btn-delete");
  delete_.onclick = function () {
    // console.log("boxer is about to delete with id ", boxer.id);
    let sure = window.confirm();
    if (!sure) {
      return;
    }
    fetch(BACKEND_URL + "/" + boxer["id"], {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(function () {
      //console.log("DELETED");
      loadBoxers();
    });
  };
  delete_.innerHTML = "Delete";

  buttons.appendChild(fight);
  buttons.appendChild(edit);
  buttons.appendChild(delete_);
  card.appendChild(buttons);

  boxerListDiv.appendChild(card);
  // console.log(card);
}

function post_boxer() {
  let firstName = firstNameInput.value;
  let lastName = lastNameInput.value;
  //console.log(firstName);
  //console.log(lastName);

  let wins = 0;
  let loses = 0;
  let gold = 0;
  let submitMethod = "POST";
  let adding = "";
  if (formSubmitBtn.innerHTML == "Edit Boxer") {
    wins = currentBoxer["wins"];
    loses = currentBoxer["loses"];
    gold = currentBoxer["gold"];
    submitMethod = "PUT";
    adding = "/" + currentBoxer["id"];
  } else if (fight_over == true) {
    firstName = currentBoxer["first_name"];
    lastName = currentBoxer["last_name"];
    wins = currentBoxer["wins"];
    loses = currentBoxer["loses"];
    gold = currentBoxer["gold"];
    submitMethod = "PUT";
    adding = "/" + currentBoxer["id"];
  }
  let data = "first_name=" + encodeURIComponent(firstName);
  data += "&last_name=" + encodeURIComponent(lastName);
  data += "&wins=" + encodeURIComponent(wins);
  data += "&loses=" + encodeURIComponent(loses);
  data += "&gold=" + encodeURIComponent(gold);
  fetch(BACKEND_URL + adding, {
    method: submitMethod,
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    loadBoxers();
  });
  formSubmitBtn.innerHTML = "Create Boxer";
  fight_over = false;
}

formSubmitBtn.onclick = function (event) {
  event.preventDefault();
  post_boxer();
};
// console.log(formSubmitBtn.innerHTML);
// console.log("hello");

function playAnimation(element, animationClass) {
  // Remove old animations
  element.className = "boxer-figure"; // Reset to base class

  // This is a trick to force CSS to re-apply the animation
  void element.offsetWidth;

  if (element.id === "player-figure") {
    element.classList.add("animate-" + animationClass + "-player");
  } else {
    element.classList.add("animate-" + animationClass + "-opponent");
  }

  // Clean up animation class after it finishes
  element.addEventListener(
    "animationend",
    () => {
      element.classList.remove(
        "animate-" + animationClass + "-player",
        "animate-" + animationClass + "-opponent"
      );
    },
    { once: true }
  );
}

function handlePlayerMove(move) {
  const opponentMove = moves[Math.floor(Math.random() * moves.length)];
  let message = "";
  let playerDamage = 0;
  let opponentDamage = 0;

  // --- Logic Matrix ---
  if (move === opponentMove) {
    message = `You both ${move}! Stalemate!`;
    playAnimation(playerFigure, "block");
    playAnimation(opponentFigure, "block");
  }
  // Player Punches
  else if (move === "punch") {
    if (opponentMove === "block") {
      message = "Your punch was BLOCKED!";
      playAnimation(playerFigure, "punch");
      playAnimation(opponentFigure, "block");
    } else if (opponentMove === "counter") {
      message = "You're faster! Your PUNCH lands!";
      opponentDamage = 20;
      playAnimation(playerFigure, "punch");
      playAnimation(opponentFigure, "get-hit");
    }
  }
  // Player Blocks
  else if (move === "block") {
    if (opponentMove === "punch") {
      message = "You BLOCKED the opponent's punch!";
      playAnimation(playerFigure, "block");
      playAnimation(opponentFigure, "punch");
    } else if (opponentMove === "counter") {
      message = "You got COUNTERED while blocking!";
      playerDamage = 20;
      playAnimation(playerFigure, "get-hit");
      playAnimation(opponentFigure, "punch"); // Opponent punches
    }
  }
  // Player Counters
  else if (move === "counter") {
    if (opponentMove === "punch") {
      message = "Too slow! Their PUNCH lands!";
      playerDamage = 20;
      playAnimation(playerFigure, "get-hit");
      playAnimation(opponentFigure, "punch");
    } else if (opponentMove === "block") {
      message = "A perfect COUNTER! You hit them!";
      opponentDamage = 20;
      playAnimation(playerFigure, "punch"); // You punch
      playAnimation(opponentFigure, "get-hit");
    }
  }

  // Apply damage
  playerHealth -= playerDamage;
  opponentHealth -= opponentDamage;

  if (playerHealth < 0) playerHealth = 0;
  if (opponentHealth < 0) opponentHealth = 0;

  // Update UI
  gameMessage.textContent = message;
  playerHealthBar.style.width = `${playerHealth}%`;
  opponentHealthBar.style.width = `${opponentHealth}%`;

  // Check for game over
  if (playerHealth <= 0 || opponentHealth <= 0) {
    setTimeout(endGame, 1000); // Wait 1s for animations
  }
}

function endGame() {
  gameControls.style.display = "none"; // Hide buttons

  let title, body;
  //console.log(currentBoxer);

  if (playerHealth <= 0) {
    title = "YOU LOSE";
    body = "You were knocked out. Better luck next time.";
    currentBoxer["loses"] += 1;
  } else {
    title = "YOU WIN!";
    const goldWon = Math.floor(Math.random() * 50) + 50; // Win 50-100 gold
    body = `A stunning victory! You win ${goldWon} Gold.`;
    currentBoxer["wins"] += 1;
    currentBoxer["gold"] += goldWon;
  }
  fight_over = true;

  post_boxer();

  showModal(title, body);
}

function showModal(title, body) {
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.classList.add("active");
}

function hideModal() {
  modal.classList.remove("active");
}

document.getElementById("btn-punch").onclick = function () {
  handlePlayerMove("punch");
};
document.getElementById("btn-block").onclick = function () {
  handlePlayerMove("block");
};
document.getElementById("btn-counter").onclick = function () {
  handlePlayerMove("counter");
};

document.getElementById("btn-quit-game").addEventListener("click", () => {
  if (confirm("Forfeit the match? This will count as a loss.")) {
    playerHealth = 0; // Force a loss
    endGame();
  }
});

document.getElementById("modal-close-btn").onclick = function () {
  hideModal();
  swithcView("manager");
  currentBoxer = null;
};
loadBoxers();

// function test() {
//   fetch(BACKEND_URL + "/1", {
//     method: "GET",
//   }).then(function (response) {
//     response.json().then(function (data) {
//       console.log(data);
//     });
//   });
// }

// test();

function startGame() {
  // reset state
  console.log("Test");
  fight_over = false;
  playerHealth = 100;
  opponentHealth = 100;

  // reset UI
  gameMessage.textContent = "Choose your move!";
  playerHealthBar.style.width = "100%";
  opponentHealthBar.style.width = "100%";
  gameControls.style.display = "";      // let CSS show it (or "flex"/"block")
  hideModal();                          // just in case modal stayed open

  // clear any leftover animation classes
  playerFigure.className = "boxer-figure";
  opponentFigure.className = "boxer-figure";
}

