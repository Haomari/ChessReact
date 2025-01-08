import { useState, useEffect } from "react";
import Figures from "../components/figures";

export default function Home() {
  const [squares, setSquares] = useState(createsquares());
  const [figures, setFigures] = useState(Figures());
  const [isSelectedGlobal, setIsSelectedGlobal] = useState(false);
  const [whoseTurn, setWhoseTurn] = useState("white");
  const [posibleMoves, setPosibleMoves] = useState([]);

  /*   function createsquares() {
		let i = 1, q = 1

    while (q < 9 ) {
			if(i == 8){
				i = 1
				q++
			}
      setsquares([
        ...squares,
        {
          isOccupied: false,
          figureType: "",
          position: { width: i, height: q},
        },
      ]);
    }
  } */

  function createsquares() {
    const newsquares = [];

    // Loop
    let q = 1;
    for (let i = 0; q < 9; i++) {
      if (i == 9) {
        i = 0;
        q++;
      }
      // Code
      let figureDecider = "";
      if (q == 2 || q == 7) {
        figureDecider = "pawn";
      } else if (
        (q == 1 && i == 1) ||
        (q == 1 && i == 8) ||
        (q == 8 && i == 1) ||
        (q == 8 && i == 8)
      ) {
        figureDecider = "rook";
      } else if (
        (q == 1 && i == 2) ||
        (q == 1 && i == 7) ||
        (q == 8 && i == 2) ||
        (q == 8 && i == 7)
      ) {
        figureDecider = "knight";
      } else if (
        (q == 1 && i == 3) ||
        (q == 1 && i == 6) ||
        (q == 8 && i == 3) ||
        (q == 8 && i == 6)
      ) {
        figureDecider = "bishop";
      } else if ((q == 1 && i == 4) || (q == 8 && i == 4)) {
        figureDecider = "king";
      } else if ((q == 1 && i == 5) || (q == 8 && i == 5)) {
        figureDecider = "queen";
      }
      ///

      let colorDecider = "";
      let isOccupiedDecider = false;

      if (q === 1 || q === 2) {
        colorDecider = "white";
        isOccupiedDecider = true;
      } else if (q === 7 || q === 8) {
        colorDecider = "black";
        isOccupiedDecider = true;
      }

      ///
      if (i > 0) {
        newsquares.push({
          isOccupied: isOccupiedDecider,
          color: colorDecider,
          figureType: figureDecider,
          position: { row: i, column: q },
          isSelected: false,
        });
      }
    }

    return newsquares; // Update state
  }

  function ClickHandel(clikedSquare) {
		const location = clikedSquare.position
		console.log(location);


    if (isSelectedGlobal) {
      squares.forEach((square) => {
        if (
          square.position.row === location.row &&
          square.position.column === location.column
        ) {
          if (
            posibleMoves.moves.forEach((move) => {
              if (
                location.row === move.row &&
                location.column === move.column
              ) {

                const figureDelete = {
                  isOccupied: false,
                  color: "",
                  figureType: "",
                  position: posibleMoves.figure.position,
                  isSelected: false,
                };

								setSquares((prevSquares) =>
									prevSquares.map((square) => {
										// Check if square matches the move and location
										if (
											square.position && 
											square.position.row === move.row &&
											square.position.row === location.row &&
											square.position.column === move.column &&
											square.position.column === location.column
										) {
											return { ...posibleMoves.figure, position: move };
										}
										// Check if square matches the previous figure's location
										else if (
											square.position &&
											square.position.row === posibleMoves.figure.position.row &&
											square.position.column === posibleMoves.figure.position.column
										) {
											return figureDelete;
										}
										// Return square unchanged if no conditions match
										else {
											console.log('jijas');
											return square;
										}
									})
								);
								setIsSelectedGlobal(false)
								setWhoseTurn((lastTurn) => lastTurn === 'white' ? 'black' : 'white')
                console.log(squares);
                console.log(posibleMoves);
              }
            })
          ) {
          }
        }
      });
    } else {
      squares.forEach((square) => {
        if (
          square.position.row === location.row &&
          square.position.column === location.column
        ) {
          if (square.isOccupied) {
            if (square.color === whoseTurn) {
              setIsSelectedGlobal(true);
              console.log(isSelectedGlobal);
              setPosibleMoves(figures.pawn.moves(squares, clikedSquare));
            }
          }
        }
      });
    }
  }

  console.log(squares);
  console.log(figures);
  console.log(isSelectedGlobal);
  console.log(posibleMoves);

  // console.log(figures.pawn.moves(squares, { row: 4, column: 4 }));

  const squaresToGame = squares.map((square, index) => (
    <button
      key={index}
      className={`main__square square ${
        square.position.row % 2 == 0
          ? square.position.column % 2 == 0
            ? "square__first-color"
            : "square__second-color"
          : square.position.column % 2 == 0
          ? "square__second-color"
          : "square__first-color"
      }
			${square.figureType} ${square.color}`}
      onClick={() => ClickHandel(square)}
    >
      {index}
    </button>
  ));

  console.log(squaresToGame);

  // <div className="home__square square square__first-color"></div>

  return (
    <main className="page">
      <section className="page__main main">
        <div className="main__container">
          <div className={`${whoseTurn === 'white' ? 'white-turn' : 'black-turn'} main__board`}>{squaresToGame}</div>
        </div>
      </section>
    </main>
  );
}
