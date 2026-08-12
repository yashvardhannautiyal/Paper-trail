// Paper Trail — stage 2 starter. Replace src/App.jsx of a fresh Vite React
// project with this file, then: npm install && npm run dev
import { useEffect, useState } from "react";

const STARTING_BOOKS = [
  {
    id: 1,
    title: "The Remains of the Day",
    genre: "Fiction",
    pages: 258,
    finished: false,
  },
  {
    id: 2,
    title: "Deep Work",
    genre: "Non-fiction",
    pages: 296,
    finished: true,
  },
  {
    id: 3,
    title: "Project Hail Mary",
    genre: "Sci-fi",
    pages: 476,
    finished: false,
  },
  {
    id: 4,
    title: "Wings of Fire",
    genre: "Biography",
    pages: 180,
    finished: false,
  },
  {
    id: 5,
    title: "Klara and the Sun",
    genre: "Fiction",
    pages: 320,
    finished: false,
  },
];

// Simulated server-side lookup (no network needed): longer queries answer faster.
function lookupBooks(q, books) {
  const wait = 900 - Math.min(q.length * 150, 700);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        books.filter((x) => x.title.toLowerCase().includes(q.toLowerCase())),
      );
    }, wait);
  });
}

const PAGE_SIZE = 3;

export default function App() {
  const [books, setBooks] = useState(STARTING_BOOKS);
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [secondsOpen, setSecondsOpen] = useState(0);
  const [serverMatches, setServerMatches] = useState(null);
  const [draftText, setDraftText] = useState("");
  const [draftNum, setDraftNum] = useState("");

  // ---------- 1 Timer update --------------------
  useEffect(() => {
    const tick = setInterval(
      () => setSecondsOpen((seconds) => seconds + 1),
      1000,
    );
    return () => clearInterval(tick);
  }, []);


  // ---------- 2 Pagination reset --------------------
  const activeView = { search: query, genre: genreFilter };

  useEffect(() => {
    setPage(1); // back to page 1 whenever the view changes
  }, [query, genreFilter]);


  // ---------- 3 async server-search race --------------------
  useEffect(() => {
    if (query.trim() === "") {
      setServerMatches(null);
      return;
    }

    let doNot = false; //initally 

    //request finishes lookupBooks
    lookupBooks(query, books).then((found) =>{
      if(!doNot){ //if true do not update state
      setServerMatches(found) }
  });

  return () => {
    doNot = true; //sets to true => now the state will not be updated
  }
  }, [query, books]);





  const visible = books
    .filter((x) => x.title.toLowerCase().includes(query.toLowerCase()))
    .filter((x) => genreFilter === "All" || x.genre === genreFilter);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const shown = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


  // ---------- 4 toggle change defect --------------------
 function toggleFinished(x) {
  setBooks(
    books.map((e) =>
      e.id === x.id //checks for the book
        ? { ...e, finished: !e.finished } //if found reverse the finished toggle value
        : e //else keeps it same
    )
  );
}

  function removeBook(x) {
    setBooks(books.filter((it) => it.id !== x.id));
  }

  function NewBookForm() {
    function submit(e) {
      e.preventDefault();
      if (draftText.trim() === "" || Number(draftNum) <= 0) return;
      setBooks([
        {
          id: Date.now(),
          title: draftText.trim(),
          genre: "Fiction",
          pages: Number(draftNum),
          finished: false,
        },
        ...books,
      ]);
      setDraftText("");
      setDraftNum("");
    }
    return (
      <form className="new-entry" onSubmit={submit}>
        <input
          placeholder="Book title"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
        />
        <input
          placeholder="Pages"
          type="number"
          value={draftNum}
          onChange={(e) => setDraftNum(e.target.value)}
        />
        <button type="submit">Add book</button>
      </form>
    );
  }

  return (
    <div className="app">
      <h1>Paper Trail</h1>
      <p className="timer">Time on page: {secondsOpen}s</p>
      <NewBookForm />
      <div className="filters">
        <input
          placeholder="Search books…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option>All</option>
          <option>Fiction</option>
          <option>Non-fiction</option>
          <option>Sci-fi</option>
          <option>Biography</option>
        </select>
      </div>
      {serverMatches !== null && (
        <p className="matches">
          Server search: {serverMatches.length} match(es) for “{query}”
        </p>
      )}
      <ul className="rows">
        {shown.map((x) => (
          <BookRow
            key={x.id}
            book={x}
            onToggle={() => toggleFinished(x)}
            onRemove={() => removeBook(x)}
          />
        ))}
      </ul>
      <div className="pager">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          {" "}
          page {page} of {pageCount}{" "}
        </span>
        <button disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

function BookRow({ book, onToggle, onRemove }) {
  const [note, setNote] = useState("");
  return (
    <li className="row">
      <label>
        <input type="checkbox" checked={book.finished} onChange={onToggle} />{" "}
        Finished
      </label>
      <b> {book.title} </b>
      <span>
        {" "}
        · {book.genre} · {book.pages}{" "}
      </span>
      <input
        className="note"
        placeholder="Margin note…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={onRemove}>Remove</button>
    </li>
  );
}