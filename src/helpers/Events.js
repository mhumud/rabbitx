import { SmartMerge } from "./Helpers";

export function HandleSubscription(props) {
  const { ctx, setOrderBookData, sequenceRef } = props;
  const { data } = ctx;
  if (data) {
    const { asks: initialAsks, bids: initialBids, sequence } = data;
    // Set the reference for the sequence
    sequenceRef.current = sequence;

    // Update the order book data with the whole first snapshot
    setOrderBookData((prevData) => ({
      ...prevData,
      // Sort ascending
      asks: initialAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])),
      // Sort ascending
      bids: initialBids.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])),
    }));
  }
}

export function HandlePublication(props) {
  const { ctx, setOrderBookData, sequenceRef, currentSubscription } = props;
  const { data } = ctx;
  if (data) {
    const { asks: newAsks, bids: newBids, sequence } = data;

    // Check if the sequence is correct
    if (sequence > sequenceRef.current + 1) {
      console.log("Out-of-sequence update. Unsubscribing and resubscribing.");
      // Resuscribe to the events to reset asks, bids and the sequence
      currentSubscription.unsubscribe();
      setTimeout(() => {
        currentSubscription.subscribe();
      }, 1000); // Add a one second delay before resubscribing to avoid rapid retry

      // Else, merge the update
    } else {
      setOrderBookData((prevState) => ({
        ...prevState,
        asks: newAsks.reduce(
          (acc, newAsk) => SmartMerge(newAsk, acc),
          prevState.asks
        ),
        bids: newBids.reduce(
          (acc, newBid) => SmartMerge(newBid, acc),
          prevState.bids
        ),
      }));

      // Update the sequence reference
      sequenceRef.current = sequence;
    }
  }
}

export function SetRenderOrderBookData(props) {
  const { setOrderBookData, renderAsks, renderBids, averagePrice } = props;
  setOrderBookData((prevState) => {
    const { averageColor: prevAverageColor, averagePrice: prevAveragePrice } =
      prevState;

    // Calculation to change the color of the average more smoothly
    const difference = parseInt(averagePrice) - parseInt(prevAveragePrice);
    const averageColor =
      difference > 1
        ? "average-price-up"
        : difference < -1
        ? "average-price-down"
        : prevAverageColor;

    return {
      ...prevState,
      averageColor,
      averagePrice,
      renderBids,
      renderAsks,
    };
  });
}
