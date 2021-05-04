# Questions

### 1.
If I had more time I would add:
- the logic to cancel the Websocket manually, by specifying the code and the reason. Right now, every time the Socket gets closed it will try to reconnect automatically after a specified timeout.
- consider more performant logic to merge the deltas, by trying to reduce the number of array iterations
- introduce the XState to handle the state management
- close the connection if the user switches the browser tab

### 2.

If the changes are on weekly basis I wouldn't use Websockets with deltas but simple Rest API which returns the whole list of orders.

If the app needs to send a lot of messages per second I would batch them and send multiple messages at once.


### 3.
**Typescript Indexed access**

```
type AuthRequest = {
  email: string;
  password: string;
  [key: string]: string;
}

const loginData: AuthRequest = {
  email: 'test@email.com',
  password: '123456'
};

const recoverPasswordData: AuthRequest = {
  email: 'test@email.com',
  password: '123456',
  code: '2455d5as5a#f6d5d'
};
```
### 4.
I have done this before in a couple of ways.
- Using telemetry events and measuring the time of particular action (rendering, function execution - e.g. app startup phase)
- Using Chrome dev tools for measuring the execution of particular functions, to track rerendering phases, to record heap snapshot in order to discover memory leaks (mostly caused by closures which keeps the reference of DOM nodes)
- React Profiler but only on staging and beta environments
- I haven't used any tools like LogRocket

### 5.
Some basic security concerns:
- **Authentication** - the Websocket doesn't provide a mechanism for authentication so it has to be implemented manually by introducing a token, hashed data, cookies, etc. 
- **Authorisation** - attackers can get privileges to the secure content received by the server. A refresh token is one of the solutions
- **XSS attacks** - Cross-site scripting attacks happen through inputs where an attacker can send malicious SQL or code injections. All inputs must be sanitized before sending the content to the server
- **CSRF attacks** - Cross-Site Request Forgery attacks means that attackers can hide the code on a malicious website, under the link, image, etc. When a user clicks on the link, it can trigger an action on another site where the user is logged in and it can steal the user information. Possible solutions are CSRF token, re-authentication, multi-factor authentication
- **Sniffing** - attackers can intercept the network traffic and try to read the data sent to/from the server. The secure protocol must be implemented `HTTPS`/`wss`


### 6.
I would change the format of the response to a more user-friendly format. I wouldn't use two-dimensional arrays for asks and bids, but an object with `asks` and `bids` properties.

Also, I would add some basic authorization layer by sending the token/hashed authorization data/cookie or CSRF-Tokens during the handshake.