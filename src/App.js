import "./styles.css";
import { useState } from "react";
import styled from "styled-components";

export default function App() {
  const champagneFullTower = (poured, rows) => {
    const tower = [[poured]];
    for (let i = 0; i < rows; i++) {
      const currentRow = tower[i];
      const nextRow = [];
      for (let j = 0; j < currentRow.length; j++) {
        const fillAmount = Math.min(1, currentRow[j]);
        const overflowAmount = Math.max(0, currentRow[j] - 1);
        nextRow[j] = nextRow[j] + overflowAmount / 2 || overflowAmount / 2;
        nextRow[j + 1] =
          nextRow[j + 1] + overflowAmount / 2 || overflowAmount / 2;
        currentRow[j] = fillAmount;
      }
      tower.push(nextRow);
    }
    return tower.slice(0, rows);
  };
  /************************************************************
   * Everything below this is just for the visualization
   ************************************************************/

  const [rows, setRows] = useState(5);
  const [cups, setCups] = useState(1);
  const [tower, setTower] = useState([]);
  const [selectedCup, setSelectedCup] = useState({
    row: "",
    col: "",
    fillLevel: ""
  });
  const [showEquilateral, setShowEquilateral] = useState(true);

  const handlePour = (e) => {
    e.preventDefault();
    const newTower = champagneFullTower(cups, rows);
    setTower(newTower);
  };

  const handleShowValue = (row, col) => {
    // console.log(tower[row][col]);
    const level = tower[row][col];
    setSelectedCup({ row, col, fillLevel: level });
  };

  const towerRows = tower.map((row, index) => {
    const glasses = row.map((glass, gIdx) => {
      return (
        <Glass
          key={gIdx}
          style={{ margin: "2px" }}
          onClick={() => handleShowValue(index, gIdx)}
        >
          <Liquid level={(window.innerWidth / 30) * glass} />
        </Glass>
      );
    });
    return (
      <TowerRow
        id={`row${index}`}
        key={index}
        showEquilateral={showEquilateral}
      >
        {glasses}
      </TowerRow>
    );
  });

  return (
    <div className="App">
      <Row>
        <Col
          as="label"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
        </Col>
      </Row>
      <Col as="form" onSubmit={handlePour}>
        <Row>
          <Col as="label">
            Number of Doses of Meds:
            <input
              type="number"
              min="1"
              max="100000000"
              value={cups}
              onChange={(e) => setCups(e.target.value)}
            />
          </Col>
          <Col as="label">
            Receptor Count (1 - 5):
            <input
              type="number"
              min="1"
              max="5"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
            />
          </Col>
          <input type="submit" value="Give dose" />
        </Row>
      </Col>
      <button
        onClick={() => {
          const newCups = +cups + 1;
          setCups(newCups);
          const newTower = champagneFullTower(newCups, rows);
          setTower(newTower);
        }}
      >
        Give another dose
      </button>
      <button
        onClick={() => {
          if (cups >= 1) {
            const newCups = +cups - 1;
            setCups(newCups);
            const newTower = champagneFullTower(newCups, rows);
            setTower(newTower);
          }
        }}
      >
        Remove dose
      </button>
      <Col id="tower">{towerRows}</Col>
    </div>
  );
}

const Glass = styled.div`
  position: relative;
  width: calc(100vw / 30);
  height: calc(100vw / 30);
  border-bottom: 2px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;
`;

const Liquid = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: pink;
  width: calc(100vw / 30);
  height: ${({ level }) => level.toString(10) + "px"};
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
`;

const TowerRow = styled(Row)`
  width: 100%;
  justify-content: ${({ showEquilateral }) =>
    !showEquilateral ? "flex-start" : "center"};
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 5px;
`;
