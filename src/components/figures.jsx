import { useState, useEffect } from "react";

export default function Figures() {
  function isOutOfBounce(moves) {
    const MovesChecked = [];
    moves.forEach((move) =>
      move.row >= 9 || move.column <= 0 || move.row <= 0 || move.column >= 9
        ? false
        : MovesChecked.push(move)
    );

    return MovesChecked;
  }

  function processDirection(
    deltaRow,
    deltaColumn,
    squares,
    position,
    whoseTurn
  ) {
    let moves = [];
    let i = 1;
    let stop = false;

    while (!stop && i <= 8 && i >= 0) {
      // Stop when i exceeds 8
      console.log(deltaRow, deltaColumn, squares, position, whoseTurn);

      console.log("raz"); // Debugging log
      let foundSquare = false; // Track if any square matched

      for (let square of squares) {
        console.log("raz2"); // Debugging log

        if (
          square.position.row === position.row + i * deltaRow &&
          square.position.column === position.column + i * deltaColumn
        ) {
          foundSquare = true; // Mark that a match is found

          if (square.isOccupied) {
            if (square.color !== whoseTurn) {
              moves.push({
                row: position.row + i * deltaRow,
                column: position.column + i * deltaColumn,
              });
              // console.log("suc op fig");
              stop = true; // Stop if occupied
              break;
            } else {
              stop = true; // Stop if occupied
              // console.log("skip our fig");
              break;
            }
          } else {
            // console.log("suc nothig there");
            moves.push({
              row: position.row + i * deltaRow,
              column: position.column + i * deltaColumn,
            });
            break; // Exit the `for` loop since square is processed
          }
        } else {
          // console.log("skip");
        }
      }

      if (!foundSquare) {
        stop = true;
      }

      i++; // Increment i regardless of conditions
    }
    console.log(moves);

    return moves;
  }

  function checkForKingFnc(
    moves,
    squareSelectedLockal,
    squares,
    checkForKing,
    whoseTurn,
    kingPosition
  ) {
    const kingPositionLocal =
      whoseTurn === "white" ? kingPosition.white : kingPosition.black;
    const newMoves = [];

    const figureDelete = {
      isOccupied: false,
      color: "",
      figureType: "",
      position: squareSelectedLockal.position,
      isSelected: false,
      everMoved: false,
    };

    function setDynamicPossibleMoves(figureName, squares, clickedSquare) {
      return figures[figureName].moves(
        squares,
        clickedSquare,
        false,
        whoseTurn
      );
    }

    console.log(figureDelete);

    moves.map((move) => {
      const newSquares = squares.map((square) => {
        if (
          square.position &&
          square.position.row === move.row &&
          square.position.column === move.column
        ) {
          return { ...squareSelectedLockal, position: move };
        }
        // Check if square matches the previous figure's location
        else if (
          square.position &&
          square.position.row === squareSelectedLockal.position.row &&
          square.position.column === squareSelectedLockal.position.column
        ) {
          return figureDelete;
        }
        // Return square unchanged if no conditions match
        else {
          console.log("jijas");
          return square;
        }
      });
      console.log(newSquares);

      const allOponentFigureSquares = newSquares.filter((square) => {
        if (square.color === whoseTurn) {
          if (
            square.figureType === "rook" ||
            square.figureType === "queen" ||
            square.figureType === "bishop"
          ) {
            return true;
          } else false;
        } else false;
      });

      console.log(allOponentFigureSquares);

      const allOponentFigureMove = allOponentFigureSquares.flatMap((square) => {
        const tempMoves = setDynamicPossibleMoves(
          square.figureType,
          newSquares,
          squareSelectedLockal
        ).moves;
        return tempMoves;
      });

      const canMove = allOponentFigureMove.some((move) => {
        kingPositionLocal.row === move.row &&
          kingPositionLocal.column === move.column;
      });

      console.log(canMove);
      console.log(kingPositionLocal);
      console.log(allOponentFigureMove);

      if (!canMove) {
        newMoves.push(move);
      }
    });
    return newMoves;
  }

  const position = {};
  const figures = {
    pawn: {
      name: "pawn",
      moves: function (
        squares,
        squareSelected,
        checkForKing,
        whoseTurn,
        kingPosition
      ) {
        // Example logic to create a new position
        const position = squareSelected.position;
        let squareSelectedLockal = squareSelected;
        console.log(squares);

        let posibleMoves = {
          figure: {},
          moves: [],
        };
        const log = [];
        let forwardMove = [];

        if (squareSelectedLockal.color == "white") {
          forwardMove.push({ row: position.row, column: position.column + 1 });
          if (!squareSelectedLockal.everMoved) {
            forwardMove.push({
              row: position.row,
              column: position.column + 2,
            });
            squareSelectedLockal = { ...squareSelectedLockal, everMoved: true };
          }
        } else {
          forwardMove.push({ row: position.row, column: position.column - 1 });
          if (!squareSelectedLockal.everMoved) {
            forwardMove.push({
              row: position.row,
              column: position.column - 2,
            });
            squareSelectedLockal = { ...squareSelectedLockal, everMoved: true };
          }
        }

        // squareSelected.color == 'white'
        //     ? squareSelected.everMoved
        // 		? { row: position.row, column: position.column + 1 }
        // 		: [
        // 			{ row: position.row, column: position.column + 1 },
        // 			{ row: position.row, column: position.column + 2 },
        // 		]
        //     : squareSelected.everMoved
        // 		? { row: position.row, column: position.column - 1 }
        // 		:[
        // 			{ row: position.row, column: position.column - 1 },
        // 			{ row: position.row, column: position.column - 2 },
        // 		];
        const atackMove =
          squareSelectedLockal.color == "white"
            ? [
                { row: position.row + 1, column: position.column + 1 },
                { row: position.row - 1, column: position.column + 1 },
              ]
            : [
                { row: position.row + 1, column: position.column - 1 },
                { row: position.row - 1, column: position.column - 1 },
              ];
        const atackMoveChecked = isOutOfBounce(atackMove);

        //forward check
        console.log(squares);

        squares.forEach((square) => {
          atackMoveChecked.forEach((move) => {
            if (
              square.position.row === move.row &&
              square.position.column === move.column
            ) {
              if (square.isOccupied) {
                posibleMoves.moves.push(square.position);
                posibleMoves.figure = squareSelectedLockal;
              }
            }
          });
        });
        //atack check
        squares.forEach((square) => {
          forwardMove.forEach((move) => {
            if (
              square.position.row === move.row &&
              square.position.column === move.column
            ) {
              if (!square.isOccupied) {
                posibleMoves.moves.push(square.position);
                posibleMoves.figure = squareSelectedLockal;
              }
            }
          });
        });
        if (checkForKing) {
          posibleMoves.moves = checkForKingFnc(
            posibleMoves.moves,
            squareSelectedLockal,
            squares,
            checkForKing,
            whoseTurn,
            kingPosition
          );

          return posibleMoves;
        } else {
          return posibleMoves;
        }
      },
    },
    knight: {
      moves: function (
        squares,
        squareSelected,
        checkForKing,
        whoseTurn,
        kingPosition
      ) {
        let squareSelectedLockal = squareSelected;
        const position = squareSelected.position;

        let posibleMoves = {
          figure: {},
          moves: [],
        };

        const moves = [
          { row: position.row + 1, column: position.column + 2 },
          { row: position.row - 1, column: position.column + 2 },
          { row: position.row - 2, column: position.column + 1 },
          { row: position.row - 2, column: position.column - 1 },
          { row: position.row + 1, column: position.column - 2 },
          { row: position.row - 1, column: position.column - 2 },
          { row: position.row + 2, column: position.column - 1 },
          { row: position.row + 2, column: position.column + 1 },
        ];

        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

        return posibleMoves;
      },
    },
    rook: {
      moves: function (
        squares,
        squareSelected,
        checkForKing,
        whoseTurn,
        kingPosition
      ) {
        let squareSelectedLockal = squareSelected;
        const position = squareSelected.position;

        let posibleMoves = {
          figure: {},
          moves: [],
        };

        let moves = [];

        // Process each direction
        moves = [
          ...moves,
          ...processDirection(0, -1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(1, 0, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(-1, 0, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(0, 1, squares, position, whoseTurn),
        ];

        console.log(moves);

        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

        return posibleMoves;
      },
    },
    bishop: {
      moves: function (
        squares,
        squareSelected,
        checkForKing,
        whoseTurn,
        kingPosition
      ) {
        let squareSelectedLockal = squareSelected;
        const position = squareSelected.position;

        let posibleMoves = {
          figure: {},
          moves: [],
        };

        let moves = [];

        // Process each direction
        moves = [
          ...moves,
          ...processDirection(-1, -1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(1, -1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(-1, 1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(1, 1, squares, position, whoseTurn),
        ];

        console.log(moves);

        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

        return posibleMoves;
      },
    },
    queen: {
      moves: function (
        squares,
        squareSelected,
        checkForKing,
        whoseTurn,
        kingPosition
      ) {
        let squareSelectedLockal = squareSelected;
        const position = squareSelected.position;

        let posibleMoves = {
          figure: {},
          moves: [],
        };
        let moves = [];

        // Process each direction
        moves = [
          ...moves,
          ...processDirection(-1, -1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(1, -1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(-1, 1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(1, 1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(0, -1, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(1, 0, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(-1, 0, squares, position, whoseTurn),
        ];
        moves = [
          ...moves,
          ...processDirection(0, 1, squares, position, whoseTurn),
        ];

        console.log(moves);

        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

        return posibleMoves;
      },
    },
    king: {
      moves: function (squares, squareSelected, checkForKing) {
        let squareSelectedLockal = squareSelected;
        const position = squareSelected.position;

        let posibleMoves = {
          figure: {},
          moves: [],
        };
        let moves = [];

        // Process each direction
        moves = [...moves, ...processDirection(-1, -1, squares, position)];
        moves = [...moves, ...processDirection(1, -1, squares, position)];
        moves = [...moves, ...processDirection(-1, 1, squares, position)];
        moves = [...moves, ...processDirection(1, 1, squares, position)];
        moves = [...moves, ...processDirection(0, -1, squares, position)];
        moves = [...moves, ...processDirection(1, 0, squares, position)];
        moves = [...moves, ...processDirection(-1, 0, squares, position)];
        moves = [...moves, ...processDirection(0, 1, squares, position)];

        console.log(moves);

        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

        return posibleMoves;
      },
    },
  };

  return figures;
}
