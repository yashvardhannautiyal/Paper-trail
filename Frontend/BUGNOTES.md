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




---

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


### How you verified the behavior after the fix
- So when I started the app again and changed the page the page did changed from page 1 -> 2 which was the defect earlier

- Also now when I search or filter the genre; even if I am on 2nd page the app moved it to Page 1 itself as the values of the states in dependency array are now changed.


---
# BUG 3 - Async server-search race 

### Symptom
- So when I entered values in the `search` it showed response for the previous searched value later.


### Root cause

The main reason I observed for the behaviour is : 
 -  longer queries answer faster because in the `useEffect`

` lookupBooks(query, books).then((found) => setServerMatches(found));` : every request is allowed to update the state

- Therefore, if we search "hello" and the previous state has "hell" so even though it has matches for "hello" it will still find for "hell" and show response for older search.

- This is called "Race condition", where the async operations run at the same time and final result depends on which one finishes first.

### Why the fix is correct

So changes I have made : 
- I have created a variable `doNot = false` initially; that will ensure that the state need to be updated or not .

- when the user changes the search, the previous effect cleans up

- the request is marked as doNot adn when the request is completed the result is not calculated if it is not current request.

- only the current request search is allowed to update the `serverMatches`


### How you verified the behavior after the fix
- So now when I started the app again and searched for the book name it responded for the current value only and the older search value was not displayed over it
- Also when i empty the search input it did not showed the result for previous searched book





----
# BUG 4 - finished-toggle defect

### Symptom
- So when I started the app and whenever I marked the book as finished the toggle did not worked

- Also when I marked the already finished book toggle button it did not wroked either

### Root cause
- the function `toggleFinished()` directly changes the state due to which whenever we click on the book object it is changing directly from `finished = true` => to => `finished = false`

- also after changing the book state, we are passing the same older book in the array due to which toggle is not changing.


### Why the fix is correct
So in the code :
- I have created a `map()` that creates a new array 

- if finds the correct book to update; `e.id === x.id`

- `{...book, finished: !e.finished}` When the book is found the spread operator copies the same values and marks finished to it's reversed value

- now whenever we toggle the book it changes from `finished: true` to `finished : false` and vice versa





# BUG 5 - list identity/remount defect

### Symptom
Row notes could move to the wrong book after filtering, deleting, or paging.

### Root Cause
- I observed that in `<ul>` the `key = {index}` was given which was the index of the array.
- whereas the key for particular had a unique id `id: Date.now(),` defined in `newBookForm`
- therefore i changed it to `key = {x.id}`


### Why the fix is correct
- So the key for particular had a unique id `id: Date.now(),` defined in `newBookForm`
- therefore i changed it to `key = {x.id}`

### How you verified the behavior after the fix
- So now when I restarted the app while filtering, deleting notes remain attached to the correct book.
