import { useState, useEffect } from "react";

export default function Figures() {
  const position = {};
  const figures = {
    pawn: {
      name: "pawn",
      moves: function (squers, position) {
        /* if (
          !position ||
          typeof position.row !== "number" ||
          typeof position.column !== "number"
        ) {
          throw new Error("Invalid position object");
        } */

        // Example logic to create a new position
        let posibleMoves = [];
        const log = [];
        const forwardMove = { row: position.row + 1, column: position.column };
        const atackMove = [
          { row: position.row + 1, column: position.column + 1 },
          { row: position.row + 1, column: position.column - 1 },
        ];
        const atackMoveChecked = [];
        atackMove.forEach((move) =>
          move.row >= 9 || move.column <= 0 || move.row >= 9 || move.column <= 0
            ? false
            : atackMoveChecked.push(move)
        );
        //forward check
        squers.forEach((squer) => {
          atackMoveChecked.forEach((move) => {
            if (
              squer.position.row === move.row &&
              squer.position.column === move.column
            ) {
              if (squer.isOccupied) {
                posibleMoves.push(squer.position);
              }
            }
          });
        });
        //atack check
        squers.forEach((squer) => {
          if (
            squer.position.row === forwardMove.row &&
            squer.position.column === forwardMove.column
          ) {
            if (!squer.isOccupied) {
              posibleMoves.push(squer.position);
            }
          }
        });
        return posibleMoves;
      },
    },
  };

  return figures;
}

/* squers.forEach((squer) => 
	squer.isOccupied === true 
	? position = squer.position : false
) */

// export default function Figures() {
// 	const position = {}
// 	const figures = {
// 		pawn: {
// 			name: "pawn",
// 			select: function move(squers, position) {
// 				const positionNew = position.assign({rows: position++, position})

// 				return positionNew
// /* 				squers.forEach(squer => {

// 				}); */
// 			}
// 		},
// 	};
