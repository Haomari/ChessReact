import { useState, useEffect } from "react";
import Figures from "../components/figures";

export default function Home() {
  const [squers, setSquers] = useState([]);
  const [figures, setFigures] = useState(Figures());

  /*   function createSquers() {
		let i = 1, q = 1

    while (q < 9 ) {
			if(i == 8){
				i = 1
				q++
			}
      setSquers([
        ...squers,
        {
          isOccupied: false,
          figureType: "",
          position: { width: i, height: q},
        },
      ]);
    }
  } */

  function createSquers() {
    const newSquers = [];

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
      } else if ((q == 1 && i == 5) || (q == 8 && i == 5)) {
        figureDecider = "king";
      } else if ((q == 1 && i == 4) || (q == 8 && i == 4)) {
        figureDecider = "queen";
      }
      if (i > 0) {
        newSquers.push({
          isOccupied: false,
          figureType: figureDecider,
          position: { row: i, column: q },
          isSelected: false,
        });
      }
    }

    setSquers(newSquers); // Update state
  }

  useEffect(() => {
    createSquers();
  }, []);

  function ClickHandel(location) {
    console.log(location);
  }

  console.log(squers);
  console.log(figures);

  /* 	const figures = Figures();
	console.log(figures.pawn.select(0, {row: 4, column: 4})); */
  // console.log(Figures());

  console.log(figures.pawn.moves(squers, { row: 4, column: 4 }));

  const SquersToGame = squers.map((squer, index) => (
    <button
      key={index}
      className={`main__squer squer ${
        squer.position.row % 2 == 0 
          ? (squer.position.column % 2 == 0 ? "squer__first-color" : "squer__second-color")
          : (squer.position.column % 2 == 0 ? "squer__second-color" : "squer__first-color")
      }
			${squer.figureType}`}
      onClick={() => ClickHandel(squer.position)}
    >{index}</button>
  ));

  console.log(SquersToGame);

  // <div className="home__squer squer squer__first-color"></div>

  return (
    <main className="page">
      <section className="page__main main">
        <div className="main__container">
          <div className="main__board">{SquersToGame}</div>
        </div>
      </section>
    </main>
  );
}
