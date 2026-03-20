import parseDate from "src/lib/parseDate";

const transformData = (data) => {
  if (data) {
    const {
      username,
      user_profile,
      rank,
      created_at: createdAt,
      total_left: leftUsers,
      total_right: rightUsers,
      point_table: pointTable,
    } = data;
    const { first_name, last_name } = user_profile || {};
    const {
      total_left: weeklyBvLeft,
      total_right: weeklyBvRight,
      right_carry: rightCarry,
      left_carry: leftCarry,
    } = pointTable || {};

    return {
      username,
      rank: rank.rank_name,
      name: `${first_name || ""} ${last_name || ""}`,
      leftUsers,
      rightUsers,
      weeklyBvLeft,
      weeklyBvRight,
      rightCarry,
      leftCarry,
      date: parseDate(createdAt),
    };
  }
};

export default transformData;
