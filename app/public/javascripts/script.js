const app = {
  // total of one throw
  total_roll: null,
  // default value for the number of die on the field
  counter_number: 1,
  // history of the last throw
  roll_history: [],

  // elements of the DOM
  fetchComponents: {
    CONTAINER: document.querySelector(".container"),
    FIELD: document.querySelector(".container__dice"),
    CONTROLLER_MINUS: document.querySelector(".controller__minus"),
    CONTROLLER_PLUS: document.querySelector(".controller__plus"),
    CONTROLLER_RESET: document.querySelector(".block-left__reset"),
    TOTAL: document.querySelector(".total__number"),
    COUNTER: document.querySelector(".controller__counter"),
    DICE: null,

    NAV_HISTORY: document.querySelector(".nav__history"),
    HISTORY_CONTENT: document.querySelector(".history__content"),
    LAST_LAUNCH: document.querySelector(".stats__roll__last"),
    LAST_TOTAL: document.querySelector(".stats__roll__total"),
    INSTRUCTIONS: document.querySelector(".container__instructions")
  },

  // object config
  config: {
    // func() => get a random number
    getRandom: (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.round(Math.random() * (max - min)) + min;
    },

    // func() => add a die on the field 
    addDie: (event) => {
      // cancels the default effect of the button (refreshes the page)
      event.preventDefault();

      // empêche d'activer l'action du bouton avec la touche "espace"
      if (event.screenX && event.screenX != 0 && event.screenY && event.screenY != 0) {
        if (app.counter_number < 10) {
          // console.log("Dé ajouté.");

          // a new die is generated
          app.config.generateDie();

          // the counter variable is incremented
          app.counter_number++;

          // we put the new value in the counter
          app.fetchComponents.COUNTER.innerHTML = app.counter_number;
        };
      };
    },

    delDie: (event) => {
      // cancels the default effect of the button (refreshes the page)
      event.preventDefault();

      // prevents the button from being activated with the "space" key
      if (event.screenX && event.screenX != 0 && event.screenY && event.screenY != 0) {
        if (app.counter_number > 0) {
          // console.log("Dé supprimé.");

          // remove the last "child" element from the "parent" tray
          app.fetchComponents.FIELD.removeChild(app.fetchComponents.FIELD.lastChild);

          // decrement the counter variable
          app.counter_number--;

          // we put the new value in the counter
          app.fetchComponents.COUNTER.textContent = app.counter_number;

          // remove the last item from the pitch history
          const lastNumberDie = app.roll_history.pop();

          // the number extracted is removed from the total
          app.total_roll -= lastNumberDie;
          app.fetchComponents.TOTAL.textContent = app.total_roll;
        };
      };

      if (app.counter_number == 0) {
        // reset the total to zero
        app.total_roll = 0;
        app.fetchComponents.TOTAL.textContent = app.total_roll;
      }
    },

    resetDice: (event) => {
      event.preventDefault();

      // console.log("Tous les dés ont été supprimés.")

      // reset the dice counter
      app.counter_number = 0;
      app.fetchComponents.COUNTER.innerHTML = app.counter_number;

      // reset the total to zero
      app.total_roll = 0;
      app.fetchComponents.TOTAL.innerHTML = app.total_roll;

      while (app.fetchComponents.FIELD.firstChild) {
        app.fetchComponents.FIELD.removeChild(app.fetchComponents.FIELD.firstChild);
      };
    },

    generateDie: () => {
      // create the die and add a class
      const die = document.createElement("div");
      die.classList.add("die");

      // integration of the die into the board
      app.fetchComponents.FIELD.appendChild(die);

      app.roll_history.push(null);

      die.addEventListener("click", app.config.rollDie);
    },

    totalUpdate: () => {
      // the total number of throws is reset to 0
      app.total_roll = 0;

      // we go through the table and add the elements together
      app.roll_history.forEach((roll) => {
        app.total_roll += roll;
      });

      // we integrate the total number of throws in the HTML
      app.fetchComponents.TOTAL.innerHTML = app.total_roll;
    },

    rollDie: (event) => {
      app.total_roll = 0;

      // recovery of the clicked die
      const dieClicked = event.target;

      // get a random number between 1 and 6
      // and apply the new style to the clicked die
      const dieFace = app.config.getRandom(1, 6);

      // if we are on mobile, we apply a different background-position-x on the clicked die
      const onMobile = window.matchMedia("all and (max-device-width: 480px)");
      if (onMobile.matches) {
        dieClicked.style.backgroundPositionX = ((dieFace) * -65) + 'px';
      } else {
        // i apply a new style to the element
        dieClicked.style.backgroundPositionX = ((dieFace) * -85) + 'px';
      }

      // recover all the dice present on the board
      app.fetchComponents.DICE = document.querySelectorAll(".die");

      // transformation of the dice list (in NodeList) into an array
      const arrayDice = Array.from(app.fetchComponents.DICE);

      // retrieve the index in the array of the clicked element
      const indexDie = arrayDice.indexOf(event.target);

      if (indexDie !== "undefined") {
        // if there is nothing at the index of the clicked die, we replace
        app.roll_history.splice(indexDie, 1, dieFace);
      } else {
        // otherwise, we add to the index of the clicked die
        app.roll_history.splice(indexDie, 0, dieFace);
      };

      app.config.totalUpdate();

      app.DOM.setHistory();
    },

    rollDice: () => {
      // console.log(`Dé(s) lancé(s).`);

      // reset the history of the throw
      app.roll_history = [];

      // we recover the node with all the dice
      app.fetchComponents.DICE = document.querySelectorAll(".die");

      // for each of the dice on the board
      app.fetchComponents.DICE.forEach((dice) => {
        // i get a random number between 1 and 6
        const dieFace = app.config.getRandom(1, 6);

        // i add the launch(s) in the history
        app.roll_history.push(dieFace);

        // if we are on mobile, we apply a different background-position-x on the dice
        const onMobile = window.matchMedia("all and (max-device-width: 480px)");
        if (onMobile.matches) {
          dice.style.backgroundPositionX = ((dieFace) * -65) + 'px';
        } else {
          // i apply a new style to the element
          dice.style.backgroundPositionX = ((dieFace) * -85) + 'px';
        }
      });

      app.config.totalUpdate();

      app.DOM.setHistory();
    },
  },

  DOM: {
    toggleHistory: () => {
      app.fetchComponents.WRAPPER_HISTORY.classList.toggle("body__history--active");
    },

    setHistory: () => {
      app.fetchComponents.LAST_LAUNCH.innerHTML = `${app.roll_history.join(", ")}`;

      app.fetchComponents.LAST_TOTAL.innerHTML = `${app.total_roll}`;
    },
  },

  init: () => {
    document.addEventListener("DOMContentLoaded", () => {
      // we generate, in all cases, a first die
      app.config.generateDie();

      app.fetchComponents.COUNTER.innerHTML = app.counter_number;

      // we listen to the "click" event on the "minus" and "plus" buttons, and we execute the corresponding functions
      app.fetchComponents.CONTROLLER_PLUS.addEventListener("click", app.config.addDie);
      app.fetchComponents.CONTROLLER_MINUS.addEventListener("click", app.config.delDie);

      // we listen to the "click" event on the "reset" button, and we execute the corresponding function
      app.fetchComponents.CONTROLLER_RESET.addEventListener("click", app.config.resetDice);

      // we integrate the total number of throws in the HTML
      app.fetchComponents.CONTAINER.onclick = function (event) {
        if (event.target !== this) {
          return;
        }
        app.config.rollDice();
      }

      // if you are on mobile, you apply a different background-position-x on the clicked die
      const onMobile = window.matchMedia("all and (max-device-width: 480px)");
      if (onMobile.matches) {
        app.fetchComponents.INSTRUCTIONS.innerHTML = "Pour lancer les dés, appuyez n'importe où sur l'écran."
      } else {
        app.fetchComponents.INSTRUCTIONS.innerHTML = "Pour lancer les dés, appuyez sur la touche espace </br> ou cliquez n'importe où sur le fond."
      }

      // when, in the document, the user presses the "space" key, the dice are rolled
      document.body.addEventListener("keydown", (event) => {
        if (event.code === "Space" && app.counter_number > 0 && app.counter_number < 11) {
          app.config.rollDice();
        };
      });
    });
  },
};

app.init();