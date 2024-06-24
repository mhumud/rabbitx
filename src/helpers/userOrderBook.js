import { useState, useEffect, useRef } from "react";
import { Centrifuge } from "centrifuge";
import GetTotals from "./GetTotals";
import SmartMerge from "./SmartMerge";

export default function useOrderBook() {
  const NUMBER_OF_ELEMENTS = 11;
  const [orderBookData, setOrderBookData] = useState({
    asks: [],
    bids: [],
    renderAsks: [],
    renderBids: [],
    averagePrice: 0,
    averageColor: "",
  });
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const jwtToken = process.env.REACT_APP_JWT_TOKEN;
    const centrifuge = new Centrifuge("wss://api.prod.rabbitx.io/ws", {
      token: jwtToken,
    });

    centrifuge.connect();

    const subscription = centrifuge.newSubscription("orderbook:BTC-USD");
    subscriptionRef.current = subscription;
    subscription.subscribe();

    return () => {
      centrifuge.disconnect();
    };
  }, []);

  useEffect(() => {
    const currentSubscription = subscriptionRef.current;
    if (currentSubscription) {
      currentSubscription.on("subscribed", (ctx) => {
        const { data } = ctx;
        if (data) {
          const { asks: initialAsks, bids: initialBids } = data;

          setOrderBookData((prevData) => ({
            ...prevData,
            asks: initialAsks.sort(
              (a, b) => parseFloat(a[0]) - parseFloat(b[0])
            ),
            bids: initialBids.sort(
              (a, b) => parseFloat(a[0]) - parseFloat(b[0])
            ),
          }));
        }
      });

      currentSubscription.on("publication", (ctx) => {
        const { data } = ctx;
        if (data) {
          const { asks: newAsks, bids: newBids } = data;

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
        }
      });
    }
  }, []);

  useEffect(() => {
    // ASKS //
    // Truncate asks
    const reducedAsks = orderBookData.asks.slice(0, NUMBER_OF_ELEMENTS);

    // Add total values and percentages
    const totalizedAsks = GetTotals(reducedAsks);

    // Order descending
    const renderAsks = totalizedAsks.sort(
      (a, b) => parseFloat(b[0]) - parseFloat(a[0])
    );

    // BIDS //
    // Order descending
    const sortedBids = orderBookData.bids.sort(
      (a, b) => parseFloat(b[0]) - parseFloat(a[0])
    );

    // Truncate bids
    const reducedBids = sortedBids.slice(0, NUMBER_OF_ELEMENTS);

    // Add total values and percentages
    const renderBids = GetTotals(reducedBids);

    // AVERAGE PRICE //
    const lastAsk = parseInt(renderAsks[NUMBER_OF_ELEMENTS - 1]);
    const firstBid = parseInt(renderBids[0]);
    const averagePrice = (lastAsk + firstBid) / 2;

    setOrderBookData((prevState) => {
      const { averageColor: prevAverageColor, averagePrice: prevAveragePrice } =
        prevState;

      const averageColor =
        averagePrice > prevAveragePrice
          ? "average-price-up"
          : averagePrice < prevAveragePrice
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
  }, [orderBookData.asks, orderBookData.bids]);

  return orderBookData;
}
