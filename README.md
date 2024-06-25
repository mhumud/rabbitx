This project is an OrderBook UI that connects to RabbitX to then render the asks and bids in a beautiful way.

## Objectives
In the development of this project the following objectives were addressed:
- Connect to RabbitX via WebSockets: To obtain the events from RabbitX the library `centrifuge-js` was used. Here, the first step is to get the initial snapshot (when suscribed), to later on update with the new orders (when publications arrive). The use of the sequence number was needed to keep sync of the local OrderBook with the data received from the WebSocket.
- Build the logic: When new orders arrive, well thought logics had to be implemented to add them in the correct way. But not only that, structures and algorithms had to be crafted for highest effiency.
- Build the user interface (UI): Once the data is being recorded successfully, a good knowledge is needed to present the orders in a clear and pretty way. Libraries like `TailWind CSS` (devDependency) and `Material UI` (dependency) were used to improve both the code and the UI.

## Approach
To address this case the first step was to understand how the events are being passed by RabbitX. When that was more clear, the code was written first to optimize and order the incoming data how corresponds. Once the data logic was working, frontend development was started to being used in order to show the data properly on a table.

At the end, special and border cases were started to be analyzed and solved when possible.

## Challenges faced
After thinking the order's logic was correct, new information was found to indicate that the whole logic was not working as expected. One example, and the most notorious one, is realizing that the first step was to load the initial snapshot to then add the updates afterwards.

Another difficulty was the fact special and border cases are not easy to replicate, specially when working with WebSockets. Eventhough it is possible to induce problems and errors, more time would have been needed to go deeper into these weird cases.

## Improvements
Following the last section's idea, there are still some improvements to make, mostly when it comes to socket's disconnections and sequence's violations.

Also, error handling should be implemented in a proper way in case this code was to be used in production environments. Another point is that the average price calculation should be revised.

Regarding the UI, even though the style is quite well accomplished, more indicators like colors and font bolding have to be added to communicate the changes more clearly.

## Takeaways
Afterall it was an interesting case that required many different developing skills; from frontend views to backend logics, and always following the best coding practices.