import { Tree, TreeNode } from "react-organizational-chart";
import Account from "./components/account";
import AddNew from "./components/addNew";

const chooseComponent = (parent) =>
  parent
    ? TreeNode
    : (props) => (
        <Tree
          {...props}
          lineWidth="2px"
          lineColor="#bbc"
          lineBorderRadius="12px"
        >
          {props.children}
        </Tree>
      );

const Node = ({ node, parent, onClick, openAdd }) => {
  const T = chooseComponent(parent);

  const {
    unique_id,
    country,
    children,
    className,
    id,
    name,
    leg,
    profile_pic,
    rank_name,
    pv,
    bv,
    ev,
    qv,
    dqv,
    user_type,
    smartship_status,
    pqv, tv,
    gv,
    join_date,
  } = node;
  const label =
    className === "vacant" ? (
      <AddNew
        onClick={() => {
          const { id } = parent;
          openAdd(id, leg);
        }}
      />
    ) : (
      <Account
        country={country}
        unique_id={unique_id}
        profile={profile_pic}
        join_date={join_date}
        rank_name={rank_name}
        pv={pv}
        name={name}
        bv={bv}
        ev={ev}
        qv={qv}
        dqv={dqv}
        pqv={pqv}
        tv={tv}
        gv={gv}
        user_type={user_type}
        smartship_status={smartship_status}
        onClick={() => {
          if (id) onClick(node);
        }}
      />
    );

  return (
    <T label={label}>
      {children?.map((account, i) => {
        return (
          <Node
            key={i}
            onClick={onClick}
            node={account}
            parent={node}
            openAdd={openAdd}
          />
        );
      })}
    </T>
  );
};

export default Node;
