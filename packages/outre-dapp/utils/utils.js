export function numberOfDaysLeft(deadline) {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const timeDifference = Math.abs(deadlineDate - today);
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysLeft;
}
