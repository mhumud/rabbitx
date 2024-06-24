// Function that merges a new order with previous orders
export default function SmartMerge(newOrder, orders, type = "") {
  // Leave a log on the client side
  // console.log(type, newOrder);

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

      // Show when removing an order
      console.log(type, " removed: ", newOrder);
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
