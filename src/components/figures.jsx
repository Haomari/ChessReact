import { useState, useEffect } from "react";

export default function Figures() {
  const position = {};
  const figures = {
    pawn: {
      name: "pawn",
      moves: function (squares, squareSelected) {
        /* if (
          !position ||
          typeof position.row !== "number" ||
          typeof position.column !== "number"
        ) {
          throw new Error("Invalid position object");
        } */

        // Example logic to create a new position
				const position = squareSelected.position
				console.log(squares);
				

        let posibleMoves = {
					figure: {},
					moves: []
				};
        const log = [];
        const forwardMove = { row: position.row, column: position.column + 1};
        const atackMove = [
          { row: position.row + 1, column: position.column + 1 },
          { row: position.row - 1, column: position.column + 1 },
        ];
        const atackMoveChecked = [];
        atackMove.forEach((move) =>
          move.row >= 9 || move.column <= 0 || move.row >= 9 || move.column <= 0
            ? false
            : atackMoveChecked.push(move)
        );
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
								posibleMoves.figure = squareSelected
              }
            }
          });
        });
        //atack check
        squares.forEach((square) => {
          if (
            square.position.row === forwardMove.row &&
            square.position.column === forwardMove.column
          ) {
            if (!square.isOccupied) {
              posibleMoves.moves.push(square.position);
							posibleMoves.figure = squareSelected
            }
          }
        });
        return posibleMoves;
      },
    },
  };

  return figures;
}

/* squares.forEach((square) => 
	square.isOccupied === true 
	? position = square.position : false
) */

// export default function Figures() {
// 	const position = {}
// 	const figures = {
// 		pawn: {
// 			name: "pawn",
// 			select: function move(squares, position) {
// 				const positionNew = position.assign({rows: position++, position})

// 				return positionNew
// /* 				squares.forEach(square => {

// 				}); */
// 			}
// 		},
// 	};
