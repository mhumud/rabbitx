import "./OrderBook.css";
import useOrderBook from "./useOrderBook";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import NorthEastIcon from "@mui/icons-material/NorthEast";

function OrderBook() {
  const { renderAsks, renderBids, averagePrice, averageColor } = useOrderBook();
  const boxClassName = "bg-slate-800	p-0.5 rounded-sm";

  return (
    <div className="order-book-container px-2">
      <table className="order-book-table">
        <thead>
          <tr className="header">
            <th className="price">
              Price <span className={boxClassName}>USD</span>
            </th>
            <th className="amount">
              Amount <span className={boxClassName}>BTC</span>
            </th>
            <th className="total">
              Total <span className={boxClassName}>BTC</span>
            </th>
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
              {averageColor === "average-price-down" ? (
                <SouthEastIcon fontSize="medium" className="mx-2"/>
              ) : averageColor === "average-price-up" ? (
                <NorthEastIcon fontSize="medium" className="mx-2"/>
              ) : null}
              {averagePrice > 0
                ? Math.round(averagePrice).toLocaleString()
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
