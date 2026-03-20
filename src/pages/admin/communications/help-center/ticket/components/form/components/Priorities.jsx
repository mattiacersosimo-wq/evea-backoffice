import React from "react";
import { RHFSelect } from "src/components/hook-form";
import Map from "src/components/map";

import usePriorities from "src/pages/admin/communications/tickets/viewTickets/hook/useGetPriority.js";

const Priorities = () => {
  const priorities = usePriorities();
  return (
    <RHFSelect name="priority_id" label="help_center.form.priority">
      <option value="" />
      <Map
        list={priorities}
        render={({ id, name }) => <option value={id}>{name}</option>}
      />
    </RHFSelect>
  );
};

export default Priorities;
