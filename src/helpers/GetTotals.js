export default function GetTotals(orders) {
  const orderTotalsAmount = orders.reduce(
    (sum, order) => sum + parseFloat(order[1]),
    0
  );
  let orderTotalsCounter = 0;
  orders.forEach((order) => {
    orderTotalsCounter += parseFloat(order[1]);
    order[2] = orderTotalsCounter.toFixed(4);
    order[3] = (orderTotalsCounter / orderTotalsAmount) * 100;
  });

  return orders;
}
