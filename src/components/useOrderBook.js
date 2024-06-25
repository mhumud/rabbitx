import { useState, useEffect, useRef } from "react";
import { Connect } from "../helpers/Connection";
import { NUMBER_OF_ELEMENTS } from "../helpers/Constants";
import {
  HandlePublication,
  HandleSubscription,
  SetRenderOrderBookData,
} from "../helpers/Events";
import { GetAveragePrice, RenderAsks, RenderBids } from "../helpers/Helpers";

export default function useOrderBook() {
  const [orderBookData, setOrderBookData] = useState({
    asks: [],
    bids: [],
    renderAsks: [],
    renderBids: [],
    averagePrice: 0,
    averageColor: "",
  });

  const sequenceRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Connect on mount of component
  useEffect(() => {
    return Connect(subscriptionRef);
  }, []);

  // Add event handling for subscription, publication and error
  useEffect(() => {
    const currentSubscription = subscriptionRef.current;
    if (currentSubscription) {
      currentSubscription.on("subscribed", (ctx) => {
        const props = {
          ctx,
          setOrderBookData,
          sequenceRef,
        };
        HandleSubscription(props);
      });

      currentSubscription.on("publication", (ctx) => {
        const props = {
          ctx,
          setOrderBookData,
          sequenceRef,
          currentSubscription,
        };
        HandlePublication(props);
      });

      currentSubscription.on("error", (ctx) => {
        // TODO: Handle errors gracefully
        console.log(ctx);
      });
    }
  }, []);

  // Prepare asks and bids for being rendered
  useEffect(() => {
    // Define the rendering array for asks
    const renderAsks = RenderAsks(orderBookData.asks, NUMBER_OF_ELEMENTS);

    // Define the rendering array for bids
    const renderBids = RenderBids(orderBookData.bids, NUMBER_OF_ELEMENTS);

    // Get average price
    const averagePrice = GetAveragePrice(
      renderAsks,
      renderBids,
      NUMBER_OF_ELEMENTS
    );

    // Update the order book data
    const props = {
      setOrderBookData,
      renderAsks,
      renderBids,
      averagePrice,
    };
    SetRenderOrderBookData(props);
  }, [orderBookData.asks, orderBookData.bids]);

  return orderBookData;
}
