import { Centrifuge } from "centrifuge";

export function Connect(subscriptionRef) {
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
}
