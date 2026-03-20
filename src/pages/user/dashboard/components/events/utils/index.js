import _data from "./_data";

const getTiles = () => [
  ...document.querySelectorAll(
    ".react-calendar__tile:not(.react-calendar__month-view__days__day--neighboringMonth) abbr"
  ),
];

export const paintEvents = (events) => {
  const tiles = getTiles();

  tiles.forEach((element) => {

    events.forEach(({ date_time }) => {
      const haveEvent =
        new Date(date_time).getDate() === parseInt(element.innerHTML);

      if (haveEvent) {
        element.parentElement.classList.add("event");
      }
    });
  });
};

export const genDate = (v = Date.now()) => {
  const date = new Date(v);
  return {
    selectedDate: date.toLocaleDateString("en-GB", { day: "2-digit" }),
    selectedMonth: date.toLocaleDateString("en-GB", { month: "long" }),
  };
};

export const getEvent = (month, day) => {
  const selectedMonth = _data[month];
  if (selectedMonth) return selectedMonth[parseInt(day)];
  return [];
};

export const paintCurrentDateOnMonthChange = (currentMonth, color) => {
  if (currentMonth === new Date().getMonth()) {
    const currentDate = new Date().getDate();
    [
      ...document.querySelectorAll(
        ".react-calendar__tile:not(.react-calendar__month-view__days__day--neighboringMonth) abbr"
      ),
    ].map((item) => {
      if (parseInt(item.innerHTML) === currentDate) {
        item.parentNode.style.backgroundColor = color;
        item.parentNode.classList.add("react-calendar__tile--active");
      }
    });
  }
};
