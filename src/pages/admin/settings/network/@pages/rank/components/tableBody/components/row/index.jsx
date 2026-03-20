import { useEffect, useState } from "react";

import FinalCondition from "./components/finalConditions";
import MainConditions from "./components/mainConditions";
import RankName from "./components/rankName";

const extractData = (data, condition) => {
  return {
    count: data[`condition${condition}_count`],
    rank: data[`condition${condition}_personal_rank`],
    leg: data[`condition${condition}_leg`],
  };
};

const Row = ({ setDataProduct, ...props }) => {
  const [data, setData] = useState(props);
  const { rank_name, team_volume, consecutive } = data;

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setDataProduct(data);
  };

  return (
    <tr>
      <RankName value={rank_name} />
      <MainConditions
        {...extractData(data, 2)}
        keyNumber={2}
        onChange={onChange}
        // onBlur={onBlur}
      />
      <MainConditions
        {...extractData(data, 3)}
        keyNumber={3}
        onChange={onChange}
        // onBlur={onBlur}
      />
      <MainConditions
        {...extractData(data, 4)}
        keyNumber={4}
        // onBlur={onBlur}
        onChange={onChange}
      />
      <MainConditions
        {...extractData(data, 5)}
        keyNumber={5}
        onChange={onChange}
        // onBlur={onBlur}
      />
      <FinalCondition
        team={team_volume}
        consecutive={consecutive}
        onChange={onChange}
        // onBlur={onBlur}
      />
    </tr>
  );
};

export default Row;
