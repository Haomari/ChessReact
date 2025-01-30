import { useState, useEffect } from "react";
import Figures from "../components/figures";

export default function Home() {
  const [squares, setSquares] = useState(createsquares());
  const [figures, setFigures] = useState(Figures());
  const [isSelectedGlobal, setIsSelectedGlobal] = useState(false);
  const [whoseTurn, setWhoseTurn] = useState("white");
  const [posibleMoves, setPosibleMoves] = useState({});
  const [kingPosition, setKingPosition] = useState({
    white: { row: 4, column: 1 },
    black: { row: 4, column: 8 },
  });
  const [win, setWin] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState({ row: 0, column: 0 });
  const [animationTriger, setAnimationTriger] = useState(false);

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
          everMoved: false,
        });
      }
    }

    return newsquares; // Update state
  }

  function dynamicPossibleMoves(
    figureName,
    clickedSquare,
    checkForKing,
    newSquares,
    isKingInDander
  ) {
    if (checkForKing) {
      if (isKingInDander) {
        return figures[figureName].moves(
          newSquares,
          clickedSquare,
          checkForKing,
          whoseTurn === "white" ? "black" : "white",
          kingPosition
        );
      } else {
        setPosibleMoves(
          figures[figureName].moves(
            squares,
            clickedSquare,
            checkForKing,
            whoseTurn,
            kingPosition
          )
        );
        setIsSelectedGlobal(true);
      }
    } else {
      return figures[figureName].moves(
        newSquares,
        clickedSquare,
        false,
        whoseTurn
      );
    }
  }

  function ClickHandel(clikedSquare) {
    const location = clikedSquare.position;

    if (isSelectedGlobal) {
      if (clikedSquare.color !== whoseTurn) {
        if (posibleMoves.moves.length !== 0) {
          posibleMoves.moves.forEach((move) => {
            if (location.row === move.row && location.column === move.column) {
              if (posibleMoves.figure.figureType === "king") {
                setKingPosition((prevKingPosition) => {
                  return { ...prevKingPosition, [whoseTurn]: location };
                });
              }
              const figureDelete = {
                isOccupied: false,
                color: "",
                figureType: "",
                position: posibleMoves.figure.position,
                isSelected: false,
                everMoved: false,
              };

              const newSquares = squares.map((square) => {
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
                  return square;
                }
              });

              const allOponentFigureSquares = newSquares.filter((square) => {
                if (square.isOccupied === true && square.color == whoseTurn) {
                  if (square.figureType !== "king") {
                    return true;
                  } else return false;
                } else return false;
              });

              const allOponentFigureMove = allOponentFigureSquares.flatMap(
                (square) => {
                  const tempMoves = dynamicPossibleMoves(
                    square.figureType,
                    square,
                    false,
                    newSquares
                  ).moves;
                  return tempMoves;
                }
              );

              const kingPositionOpposite =
                whoseTurn === "white" ? kingPosition.black : kingPosition.white;

              //check if king under attack
              const kingInDanger = allOponentFigureMove.some((move) => {
                return (
                  kingPositionOpposite.row === move.row &&
                  kingPositionOpposite.column === move.column
                );
              });

              // console.log(kingInDanger);

              if (kingInDanger) {
                const allOponentFigureSquares = newSquares.filter((square) => {
                  if (
                    square.isOccupied === true &&
                    square.color !== whoseTurn
                  ) {
                    return true;
                  } else return false;
                });

                const allOponentFigureMove = allOponentFigureSquares.flatMap(
                  (square) => {
                    const tempMoves = dynamicPossibleMoves(
                      square.figureType,
                      square,
                      true,
                      newSquares,
                      true
                    ).moves;
                    return tempMoves;
                  }
                );

                if (allOponentFigureMove.length === 0) {
                  setWin(true);
                  setIsSelectedGlobal(false);
                  setSquares(newSquares);
                } else {
                  setSquares(newSquares);
                  setIsSelectedGlobal(false);
                  setWhoseTurn((lastTurn) =>
                    lastTurn === "white" ? "black" : "white"
                  );
                }
              } else {
                setSquares(newSquares);
                setIsSelectedGlobal(false);
                setWhoseTurn((lastTurn) =>
                  lastTurn === "white" ? "black" : "white"
                );
                setAnimationTriger(true);
              }
            }
          });
        }
      } else {
        dynamicPossibleMoves(clikedSquare.figureType, clikedSquare, true);
        setSelectedSquare(clikedSquare.position);
      }
    } else {
      squares.forEach((square) => {
        if (
          square.position.row === location.row &&
          square.position.column === location.column
        ) {
          if (square.isOccupied) {
            if (square.color === whoseTurn) {
              dynamicPossibleMoves(clikedSquare.figureType, clikedSquare, true);
              setSelectedSquare(clikedSquare.position);
            }
          }
        }
      });
    }
  }

  // console.log(squares);
  // console.log(figures);
  // console.log(isSelectedGlobal);
  // console.log(posibleMoves);
  // console.log(kingPosition);

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
			${square.figureType} ${square.color} ${
        square.position.row === selectedSquare.row &&
        square.position.column === selectedSquare.column
          ? "selected"
          : ""
      }`}
      onClick={() => ClickHandel(square)}
    ></button>
  ));

  const winBlock = (
    <div className="main__win-block win-block">
      <div className="win-block__body">
        <h3 className="win-block__title">
          <span>{whoseTurn}</span> won
        </h3>
        <button
          onClick={() => {
            setSquares(createsquares());
            setWin(false);
            setIsSelectedGlobal(false);
            setWhoseTurn("white");
            setKingPosition({
              white: { row: 4, column: 1 },
              black: { row: 4, column: 8 },
            });
            setPosibleMoves({});
          }}
          className="win-block__button"
        >
          reset
        </button>
      </div>
    </div>
  );

  return (
    <main className="page">
      <section className="page__main main">
        <div className="main__container">
          <div
            className={`${
              animationTriger
                ? whoseTurn === "white"
                  ? "white-turn"
                  : "black-turn"
                : ""
            } main__board`}
          >
            {squaresToGame}
          </div>
          {win && winBlock}
        </div>
      </section>
    </main>
  );
}
