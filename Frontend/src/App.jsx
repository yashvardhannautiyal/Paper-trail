// See full contents above. Notable defects:
// 1. Persisted books stop updating after initial render due to useEffect(() => { localStorage.setItem(...) }, []) – missing dependency on books.
// 2. Page validation allows zero-page draft to enable Add book button due to pagesInvalid = draftNum === "" || Number(draftNum) < 0 instead of <= 0 (UI and submit check inconsistent).
// 3. Display of book count uses books.length (total library) instead of visible.length (filtered view), so 'Showing X of Y books' is misleading under filter/search.
