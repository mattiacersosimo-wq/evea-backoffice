import { RHFSelect } from "src/components/hook-form";

const Status = () => {
  return (
    <RHFSelect
      name="status"
      label={"adminCommunication.helpCenter.status"}
      size="small"
    >
      <option value="" />
      <option value="open"> {"adminCommunication.helpCenter.open"} </option>
      <option value="resolved">
        {" "}
        {"adminCommunication.helpCenter.resolved"}{" "}
      </option>
      <option value="closed"> {"adminCommunication.helpCenter.closed"} </option>
      <option value="archived">
        {" "}
        {"adminCommunication.helpCenter.archived"}{" "}
      </option>
      <option value="deleted">
        {" "}
        {"adminCommunication.helpCenter.deleted"}{" "}
      </option>
      <option value="unverified">
        {" "}
        {"adminCommunication.helpCenter.unverified"}{" "}
      </option>
      <option value="request_approval">
        {" "}
        {"adminCommunication.helpCenter.requestApproval"}{" "}
      </option>
      <option value="in_progress">
        {" "}
        {"adminCommunication.helpCenter.inProgress"}{" "}
      </option>
      <option value="responded">
        {" "}
        {"adminCommunication.helpCenter.responded"}{" "}
      </option>
    </RHFSelect>
  );
};

export default Status;
