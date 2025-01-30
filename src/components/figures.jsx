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

      let foundSquare = false; // Track if any square matched

      for (let square of squares) {

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
              stop = true; // Stop if occupied
              break;
            } else {
              stop = true; // Stop if occupied
              break;
            }
          } else {
            moves.push({
              row: position.row + i * deltaRow,
              column: position.column + i * deltaColumn,
            });
            break; // Exit the `for` loop since square is processed
          }
        } else {
        }
      }

      if (!foundSquare) {
        stop = true;
      }

      i++; // Increment i regardless of conditions
    }


    return moves;
  }

	function dynamicPossibleMoves(figureName, squares, clickedSquare, whoseTurn) {
		return figures[figureName].moves(
			squares,
			clickedSquare,
			false,
			whoseTurn === "white" ? "black" : "white"
		);
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
          return square;
        }
      });

      const allOponentFigureSquares = newSquares.filter((square) => {
        if (square.isOccupied === true && square.color !== whoseTurn) {
          if (
            square.figureType !== "king" 
          ) {
            return true;
          } else return false;
        } else return false;
      });


      const allOponentFigureMove = allOponentFigureSquares.flatMap((square) => {
        const tempMoves = dynamicPossibleMoves(
          square.figureType,
          newSquares,
          square,
					whoseTurn
        ).moves;
        return tempMoves;
      });

      const canMove = allOponentFigureMove.some((move) => {
        return kingPositionLocal.row === move.row &&
        kingPositionLocal.column === move.column;
      });



      if (!canMove) {
        newMoves.push(move);
      }
    });
    return newMoves;
  }

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

        let posibleMoves = {
          figure: {},
          moves: [],
        };

				// forwardMove

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

				// atackMoves

        const atackMoves =
          squareSelectedLockal.color == "white"
            ? [
                { row: position.row + 1, column: position.column + 1 },
                { row: position.row - 1, column: position.column + 1 },
              ]
            : [
                { row: position.row + 1, column: position.column - 1 },
                { row: position.row - 1, column: position.column - 1 },
              ];
        const atackMovesChecked = []

        //atack check
        squares.forEach((square) => {
          atackMoves.forEach((move) => {
            if (
              square.position.row === move.row &&
              square.position.column === move.column
            ) {
              if (square.isOccupied) {
                atackMovesChecked.push(square.position);
              }
            }
          });
        });


        //forward check
        squares.forEach((square) => {
          forwardMove.forEach((move) => {
            if (
              square.position.row === move.row &&
              square.position.column === move.column
            ) {
              if (!square.isOccupied) {
                posibleMoves.moves.push(square.position);
              }
            }
          });
        });
        if (checkForKing) {
					atackMovesChecked.forEach((move) => posibleMoves.moves.push(move))
          posibleMoves.moves = checkForKingFnc(
            posibleMoves.moves,
            squareSelectedLockal,
            squares,
            checkForKing,
            whoseTurn,
            kingPosition
          );
        } else {
					posibleMoves.moves = atackMoves
				}
				posibleMoves.figure = squareSelectedLockal;
				return posibleMoves;

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

				if (checkForKing) {
          posibleMoves.moves = checkForKingFnc(
            posibleMoves.moves,
            squareSelectedLockal,
            squares,
            checkForKing,
            whoseTurn,
            kingPosition
          );
        } 

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


        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

				if (checkForKing) {
          posibleMoves.moves = checkForKingFnc(
            posibleMoves.moves,
            squareSelectedLockal,
            squares,
            checkForKing,
            whoseTurn,
            kingPosition
          );
        } 

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

        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

				if (checkForKing) {
          posibleMoves.moves = checkForKingFnc(
            posibleMoves.moves,
            squareSelectedLockal,
            squares,
            checkForKing,
            whoseTurn,
            kingPosition
          );
        } 

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

        posibleMoves.moves = isOutOfBounce(moves);
        posibleMoves.figure = squareSelectedLockal;

				if (checkForKing) {
          posibleMoves.moves = checkForKingFnc(
            posibleMoves.moves,
            squareSelectedLockal,
            squares,
            checkForKing,
            whoseTurn,
            kingPosition
          );
        } 

        return posibleMoves;
      },
    },
    king: {
      moves: function (squares, squareSelected, checkForKing, whoseTurn, kingPosition) {
        let squareSelectedLockal = squareSelected;
        const position = squareSelected.position;

        let posibleMoves = {
          figure: {},
          moves: [],
        };

        // Process each direction
        const moves = isOutOfBounce([
          { row: position.row + 1, column: position.column  },
          { row: position.row - 1, column: position.column  },
          { row: position.row , column: position.column + 1 },
          { row: position.row , column: position.column - 1 },
          { row: position.row + 1, column: position.column - 1 },
          { row: position.row - 1, column: position.column - 1 },
          { row: position.row - 1, column: position.column + 1 },
          { row: position.row + 1, column: position.column + 1 },
        ]);


        if (checkForKing) {

					const movesFiltered = moves.filter((move) => {
						const isThereFigure = 
						squares.some((square) =>{
							if (move.row === square.position.row &&
								move.column === square.position.column) {
									if (square.isOccupied && square.color === whoseTurn) {
										return false
									} else {
										const figureDelete = {
											isOccupied: false,
											color: "",
											figureType: "",
											position: squareSelectedLockal.position,
											isSelected: false,
											everMoved: false,
										};

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
												return square;
											}
										});

										console.log(newSquares);
										

										const allOponentFigureSquares = newSquares.filter((square) => {
											if (square.isOccupied === true && square.color !== whoseTurn) {
													return true;
											} else return false;
										});
										console.log(allOponentFigureSquares);
										

										const allOponentFigureMove = allOponentFigureSquares.flatMap(
											(square) => {
												const tempMoves = dynamicPossibleMoves(
													square.figureType,
													newSquares,
													square,
													whoseTurn
												).moves;
												return tempMoves;
											}
										);

										console.log(allOponentFigureMove);
										

										const isFound = allOponentFigureMove.some((opMove) => {
											const isFoundLockal = 
												move.row === opMove.row &&
												move.column === opMove.column;

											return isFoundLockal 
										})		
										
										console.log(!isFound);
										

										return !isFound 

									}
							}
						}) 
						return isThereFigure
					})
					

					console.log(movesFiltered); 
					
					
				const allOponentFigureSquares = squares.filter((square) => {
					if (square.isOccupied === true && square.color !== whoseTurn) {
							return true;
					} else return false;
				});

				const allOponentFigureMove = allOponentFigureSquares.flatMap(
					(square) => {
						const tempMoves = dynamicPossibleMoves(
							square.figureType,
							squares,
							square,
							whoseTurn
						).moves;
						return tempMoves;
					}
				);
				
				const movesChecked = movesFiltered.filter((kingMove) => {
					const isFound = allOponentFigureMove.some((opMove) => {
						return kingMove.row === opMove.row &&
						kingMove.column === opMove.column;
					})

					return !isFound
				})

				posibleMoves.moves = movesChecked

			} else {
				posibleMoves.moves = moves
			}

        posibleMoves.figure = squareSelectedLockal;

        return posibleMoves;
      },
    },
  };

  return figures;
}
