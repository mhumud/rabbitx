import { SmartMerge } from "./Helpers";

export function HandleSubscription(ctx, setOrderBookData, sequenceRef) {
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

export function HandlePublication(ctx, setOrderBookData, sequenceRef, currentSubscription) {
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
        console.log('listoo');
      }, 1000); // Add a one second delay before resubscribing to avoid rapid retry


      // Else, merge the update
    } else {
      setOrderBookData((prevState) => ({
        ...prevState,
        asks: newAsks.reduce(
          (acc, newAsk) => SmartMerge(newAsk, acc, "Ask"),
          prevState.asks
        ),
        bids: newBids.reduce(
          (acc, newBid) => SmartMerge(newBid, acc, "Bid"),
          prevState.bids
        ),
      }));

      // Update the sequence reference
      sequenceRef.current = sequence;
    }

  }
}

export function SetRenderOrderBookData(
  setOrderBookData,
  renderAsks,
  renderBids,
  averagePrice
) {
  setOrderBookData((prevState) => {
    const { averageColor: prevAverageColor, averagePrice: prevAveragePrice } =
      prevState;

    const averageColor =
      parseInt(averagePrice) > parseInt(prevAveragePrice)
        ? "average-price-up"
        : parseInt(averagePrice) < parseInt(prevAveragePrice)
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