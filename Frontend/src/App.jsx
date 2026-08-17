// See full contents above. Notable defects:
// 1. Persisted books stop updating after initial render due to useEffect(() => { localStorage.setItem(...) }, []) – missing dependency on books.
// 2. Page validation allows zero-page draft to enable Add book button due to pagesInvalid = draftNum === "" || Number(draftNum) < 0 instead of <= 0 (UI and submit check inconsistent).
// 3. Display of book count uses books.length (total library) instead of visible.length (filtered view), so 'Showing X of Y books' is misleading under filter/search.


//BUG 1
//explaination : so If we do not pass or keep the dependency array empty, the app will render once and the useEffect will run only once in the code. To avoid this and make the useEffect run I have passed "books" state so that whenever books is changed the useEffect will run 
useEffect(() => {localStorage.setItem(...), [books]);

                 



//BUG 2 : As per the description above, if the condition "Number(draftNum) < 0" is given the page can be given -ve values which is wrong here. To make the valid pages we need the page number to be greater than 0 always 
pagesValid = draftNum === "" || Number(draftNum) >= 0;

if(!pagesValid){ //disable button}
}



//BUG 3 : as given above, we need - "Show books X of Y books" so if we pass books.length the total number of books will be shown as "X" but we want that only the searched number of books or filtered result length to be shown so for that we need to pass {visible.lentgh} as this is the number of books after search/filtered result 
Showing {visible.length) of {books.length}
