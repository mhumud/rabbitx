// Function that merges a new order with previous orders
export function SmartMerge(newOrder, orders) {
  const newPrice = parseFloat(newOrder[0]);
  const newAmount = parseFloat(newOrder[1]);
  // Try to find order
  const previousOrderIndex = orders.findIndex(
    ([previousPrice]) => parseFloat(previousPrice) === newPrice
  );

  const copyOrders = [...orders];
  // The order did not exist
  if (previousOrderIndex !== -1) {
    if (newAmount > 0) {
      copyOrders[previousOrderIndex][1] = newAmount;
    } else {
      copyOrders.splice(previousOrderIndex, 1);
    }
    // It is a new order
  } else {
    if (newAmount > 0) {
      copyOrders.push(newOrder);
      copyOrders.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    }
  }

  return copyOrders;
}

// Funciton that adds the accumulated values and percentages of the total
export function GetTotals(orders) {
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

export function RenderAsks(asks, numberOfElements) {
  // Truncate asks
  const reducedAsks = asks.slice(0, numberOfElements);

  // Add total values and percentages
  const totalizedAsks = GetTotals(reducedAsks);

  // Order descending
  const renderAsks = totalizedAsks.sort(
    (a, b) => parseFloat(b[0]) - parseFloat(a[0])
  );

  return renderAsks;
}

export function RenderBids(bids, numberOfElements) {
  // Order descending
  const sortedBids = bids.sort(
    (a, b) => parseFloat(b[0]) - parseFloat(a[0])
  );

  // Truncate bids
  const reducedBids = sortedBids.slice(0, numberOfElements);

  // Add total values and percentages
  const renderBids = GetTotals(reducedBids);

  return renderBids;
}

export function GetAveragePrice(renderAsks, renderBids, numberOfElements) {
  const lastAsk = parseFloat(renderAsks[numberOfElements - 1]);
  const firstBid = parseFloat(renderBids[0]);
  const averagePrice = (lastAsk + firstBid) / 2;

  return averagePrice;
}
