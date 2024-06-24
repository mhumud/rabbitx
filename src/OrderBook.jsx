import "./OrderBook.css";
import useOrderBook from "./helpers/userOrderBook";

function OrderBook() {
  const { renderAsks, renderBids, averagePrice, averageColor } = useOrderBook();

  return (
    <div className="order-book-container px-2">
      <table className="order-book-table">
        <thead>
          <tr className="header">
            <th className="price">Price</th>
            <th className="amount">Amount</th>
            <th className="total">Total</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {renderAsks.map(
            ([price, amount, accumulated, totalPercentage], index) => (
              <tr key={index}>
                <td className="price price-cell-ask">
                  {parseInt(price).toLocaleString()}
                </td>
                <td className="amount">{amount}</td>
                <td
                  className="total total-cell-ask"
                  style={{ "--total-percentage": `${totalPercentage}%` }}
                >
                  {accumulated}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <table className="order-book-table">
        <thead>
          <tr className={`lower-header ${averageColor}`}>
            <th className="price">
              {averagePrice > 0
                ? parseInt(averagePrice).toLocaleString()
                : null}
            </th>
            <th className="amount"></th>
            <th className="total"></th>
          </tr>
        </thead>
        <tbody className="table-body">
          {renderBids.map(
            ([price, amount, accumulated, totalPercentage], index) => (
              <tr key={index}>
                <td className="price price-cell-bid">
                  {parseInt(price).toLocaleString()}
                </td>
                <td className="amount">{amount}</td>
                <td
                  className="total total-cell-bid"
                  style={{ "--total-percentage": `${totalPercentage}%` }}
                >
                  {accumulated}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderBook;
