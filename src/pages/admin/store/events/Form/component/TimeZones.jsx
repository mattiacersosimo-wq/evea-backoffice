const TimeZones = () => {
  const timeZones = [
    ...Intl.supportedValuesOf("timeZone"),
    "Asia/Kolkata",
  ].sort();
  return timeZones.map((zone) => <option value={zone}>{zone}</option>);
};

export default TimeZones;
