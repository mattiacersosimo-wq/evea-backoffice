import PropTypes from "prop-types";
import DataHandlerTable from "src/components/data-handler/table";
import Loop from "src/components/loop";
import Row from "./row";

const headers = [
  "support_tickets.table.no",
  "support_tickets.table.date",
  "support_tickets.table.subject",
  "support_tickets.table.status",
  "support_tickets.table.priority",
  "support_tickets.table.department",
  "support_tickets.table.category",
  "support_tickets.table.actions",
];

const ListItem = ({ state, rowStart }) => {
  const { data, ...dataProps } = state;

  return (
    <DataHandlerTable
      headers={headers}
      name="all-tickets"
      dataProps={{ ...dataProps }}
    >
      <Loop
        list={data}
        render={(row, i) => <Row data={row} rowNumber={i + rowStart} />}
      />
    </DataHandlerTable>
  );
};

ListItem.propTypes = {
  isDense: PropTypes.bool,
};

export default ListItem;
