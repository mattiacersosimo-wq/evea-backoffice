import React from "react";

import { isBinary } from "src/utils/isBinary";

const TableHeader = () => {
  {
    ("adminSettings.network.update");
  }
  const binaryMode = isBinary();
  return (
    <thead>
      <tr>
        <th className=""></th>
        <th colspan={binaryMode ? "3" : "2"}>
          {"adminSettings.network.condition"} 01
        </th>
        <th colspan={binaryMode ? "3" : "2"}>
          {"adminSettings.network.condition"} 02
        </th>
        <th colspan={binaryMode ? "3" : "2"}>
          {"adminSettings.network.condition"} 03
        </th>
        <th colspan={binaryMode ? "3" : "2"}>
          {"adminSettings.network.condition"} 04
        </th>
        <th colspan="2">{"adminSettings.network.condition"} 05</th>
      </tr>
      <tr>
        <th className="">{"adminSettings.network.rankName"}</th>
        <th>{"adminSettings.network.personallyEnrolledRank"}</th>
        <th>{"adminSettings.network.count"}</th>
        {binaryMode && <th>{"adminSettings.network.leg"}</th>}
        <th>{"adminSettings.network.personalEnrolledRank"}</th>
        <th>{"adminSettings.network.count"}</th>
        {binaryMode && <th>{"adminSettings.network.leg"}</th>}
        <th>{"adminSettings.network.personalEnrolledRank"}</th>
        <th>{"adminSettings.network.count"}</th>
        {binaryMode && <th>{"adminSettings.network.leg"}</th>}
        <th>{"adminSettings.network.personalEnrolledRank"}</th>
        <th>{"adminSettings.network.count"}</th>
        {binaryMode && <th>{"adminSettings.network.leg"}</th>}
        <th>{"adminSettings.network.teamVolume"}</th>
        <th>{"adminSettings.network.consecutiveWeek"}</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
