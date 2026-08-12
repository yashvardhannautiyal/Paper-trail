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





# BUG 2 - Page reset to 1 when search or change genre

### Symptom
- As I observed further in the app, the pages were not changing. 

- Whenever I clicked on `next` button the page did not moved to next page that is to page 2. It remains at Page 1 only.



### Root cause
The reason for no change in page is :

- `const activeView = { search: query, genre: genreFilter };` : it is an object so at each render this line executes and sets to it's inital state.

- That is why in `useEffect` 

        useEffect(() => {
        setPage(1); // back to page 1 whenever the view changes
        }, [activeView]);

- in dependency array `activeView` is passed so whenever the values are changed then at every render the object becomes same as it's inital value.

- so whenever `setPage(1)` is changed the react re-renders the values and when we try to change the page the values remains same due to which the page remains at `Page 1`


### Why the fix is correct
- So to remove this error I passed the states `query` and `genreFilter` in the dependency array.

- So whenever the user `search` or change `genre` the page becomes 1 as the dependencies are changed and the `useEffect` runs.

- And whenever we go from `page 1 -> 2` then the dependencies are neither changed and the effect does not run therefore the page remains same.