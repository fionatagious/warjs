const startGameButton = document.getElementById("start-game");
const drawCardsButton = document.getElementById("draw-cards");
drawCardsButton.disabled = true;

const score = document.getElementById("score");

const url = "https://deckofcardsapi.com/api/deck/new/shuffle";

let deckIdA;
let deckIdB;
let pointsA = 0;
let pointsB = 0;

const RANKS = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14,
};

async function getDeckId() {
  try {
    const resA = await fetch(url);
    const dataA = await resA.json();
    deckIdA = dataA.deck_id;

    const resB = await fetch(url);
    const dataB = await resB.json();
    deckIdB = dataB.deck_id;
  } catch (err) {
    console.error(err);
  }
}

startGameButton.addEventListener("click", async function (e) {
  // create new "draw cards" text
  let getStartedTextElem = document.getElementsByTagName("P").item(2);
  let drawCardsText = document.createTextNode(
    "War! Press the 'Draw Cards' button to draw two cards, one for each player, in unison. Continue drawing cards until players run out of cards."
  );
  let drawCardsTextElem = document.createElement("P");
  drawCardsTextElem.appendChild(drawCardsText);

  // insert "draw cards" elem before "get started" elem
  let all = document.getElementById("all");
  all.insertBefore(drawCardsTextElem, getStartedTextElem);
  // remove "get started" text
  all.removeChild(getStartedTextElem);

  startGameButton.disabled = true;
  drawCardsButton.disabled = false;
});

drawCardsButton.addEventListener("click", async function (e) {
  try {
    const drawCardUrlA = `https://deckofcardsapi.com/api/deck/${deckIdA}/draw/?count=1`;
    const drawCardUrlB = `https://deckofcardsapi.com/api/deck/${deckIdB}/draw/?count=1`;

    const responseA = await fetch(drawCardUrlA);
    const responseB = await fetch(drawCardUrlB);

    const cardA = await responseA.json();
    const cardB = await responseB.json();

    const drawnCardA = cardA.cards[0];
    const drawnCardB = cardB.cards[0];

    // player A: show card face
    const cardImageA = document.getElementById("cardfaceA");
    cardImageA.src = `${drawnCardA.image}`;
    cardImageA.alt = `${drawnCardA.value} of ${drawnCardA.suit}`;

    // player B: show card face
    const cardImageB = document.getElementById("cardfaceB");
    cardImageB.src = `${drawnCardB.image}`;
    cardImageB.alt = `${drawnCardB.value} of ${drawnCardB.suit}`;

    // battle
    let playerA = RANKS[drawnCardA.value];
    let playerB = RANKS[drawnCardB.value];

    if (playerA > playerB) {
      pointsA += 1;
      score.innerHTML = `Player A won this battle!`;
    } else if (playerB > playerA) {
      pointsB += 1;
      score.innerHTML = `Player B won this battle!`;
    } else {
      score.innerHTML = `This battle is tied. Neither player earns a point.`;
    }
    score.innerHTML += `<h3>Score Board</h3> \n <p>Player A's points: ${pointsA}</p> \n <p>Player B's points: ${pointsB}</p>`;

    if (cardA.remaining === 0) {
      drawCardsButton.disabled = true;
      // declare the victor of War
      if (pointsA > pointsB) {
        score.innerHTML += `<strong> Player A wins this game of War. </strong>`;
      } else if (pointsA < pointsB) {
        score.innerHTML += `<strong> Player B wins this game of War. </strong>`;
      } else {
        score.innerHTML += `<strong> Players A and B tied in this game of War. </strong>`;
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// setup();
getDeckId();
