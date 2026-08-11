# BUG 1 - timer not updating

### Symptom
- As I started the app I observed that the Timer is not updating for "user's time on page".
- When the app is started the timer starts from 0 but it somehow gets freeze at 1 second only.


### Root cause
The reason for the bug is that : 
- in `useEffect` : the dependency array is `[]` empty that is, it runs the code run only once after the initial render.

- when the app starts initially `secondsOpen = 0`

- Therefore in `setInterval()` callback remembers the value of `secondsOpen` when it was created initally (0)

       const tick = setInterval(() => {
        setSecondsOpen(secondsOpen + 1);
        }, 1000);

- After 1 render the callback runs and  `setSecondsOpen(1)` but the dependency array is `[]` so the `useEffect` will not run again.


### Why the fix is correct
- So i have created another callback function inside `setSecondsOpen` this tells the React to use the current value instead of value defined initially at first render.
`() => setSecondsOpen((seconds) => seconds + 1),`

- as it uses the current value therefore, the timer works successfully and shows correct time on the app.


### How you verified the behavior after the fix
- So i started the app again and observed that the timer is running effeciantly and updates the time every second the user is accessing the app
- Also on every refresh the timer becomes 0 and then updates itself