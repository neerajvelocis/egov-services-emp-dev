export const convertEpochToDate = (dateEpoch) => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};

export const getDurationDate = (fromDate, toDate) => {
  let monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
  ];
  let startDate = new Date(fromDate);
  let finalStartDate =
      startDate.getDate() +
      " " +
      monthNames[startDate.getMonth()] +
      " " +
      startDate.getFullYear();

  let endDate = new Date(toDate);
  endDate.setMonth(endDate.getMonth());
  let finalEndDate =
      endDate.getDate() +
      " " +
      monthNames[endDate.getMonth()] +
      " " +
      endDate.getFullYear();
  let finalDate = finalStartDate + " to " + finalEndDate;
  return finalDate;
};