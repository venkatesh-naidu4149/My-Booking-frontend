import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const movies = [
  { title: "Pushpa 2: The Rule", genre: ["Action", "Drama"], language: "Telugu", rating: "8.9/10", votes: "245.2K Votes", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85" },
  { title: "Mufasa: The Lion King", genre: ["Animation", "Adventure"], language: "English", rating: "8.5/10", votes: "120.5K Votes", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=85" },
  { title: "Baby John", genre: ["Action", "Thriller"], language: "Hindi", rating: "7.8/10", votes: "89.3K Votes", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85" },
  { title: "Max", genre: ["Drama", "Crime"], language: "Kannada", rating: "8.2/10", votes: "156.8K Votes", image: "https://images.unsplash.com/photo-1586899028174-e7098604235b?auto=format&fit=crop&w=700&q=85" },
  { title: "Marco", genre: ["Action", "Thriller"], language: "Malayalam", rating: "8.7/10", votes: "98.4K Votes", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=85" },
  { title: "Sonic the Hedgehog 3", genre: ["Animation", "Comedy"], language: "English", rating: "8.1/10", votes: "67.2K Votes", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=85" },
];

const upcoming = [
  { title: "Sky Force", genre: ["Action", "War"], language: "Hindi", rating: "7.9/10", votes: "45.0K Votes", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85" },
  { title: "War 2", genre: ["Action", "Thriller"], language: "Hindi", rating: "8.0/10", votes: "32.0K Votes", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85" },
];

function Header({ onLogin }) {
  const [query, setQuery] = useState("");
  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/"><span className="brand-mark">MB</span><span>My Booking</span></Link>
        <div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for Movies, Events, Plays..." /></div>
        <div className="top-actions"><span className="location">⌖ <span>Mumbai</span></span>{localStorage.getItem("uname") ? <Link className="user-link" to="/dboard">♙ <b>{localStorage.getItem("uname")}</b></Link> : <button className="signin-small" onClick={onLogin}>Sign In</button>}</div>
      </header>
      <nav className="nav"><span className="active">Movies</span><span>Stream</span><span>Events</span><span>Plays</span><span>Sports</span><span>Activities</span></nav>
    </>
  );
}

function MovieCard({ movie, onBook }) {
  return (
    <article className="movie-card" onClick={() => onBook(movie)}>
      <div className="poster-wrap"><img src={movie.image} alt={movie.title}/><div className="rating"><strong>★ {movie.rating}</strong><span>{movie.votes}</span></div><button className="hover-book">Book Now</button></div>
      <h3>{movie.title}</h3><div className="chips">{movie.genre.map(g => <span key={g}>{g}</span>)}</div><p>{movie.language}</p>
    </article>
  );
}

function Modal({ children, onClose, wide=false }) { return <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className={`modal ${wide ? "wide" : ""}`}><button className="close" onClick={onClose}>×</button>{children}</div></div>; }

function AuthModal({ mode, onClose, switchMode }) {
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const change = e => setData({ ...data, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const url = mode === "login" ? "http://localhost:8080/login" : "http://localhost:8080/register";
      const body = mode === "login" ? { username: data.username, password: data.password } : data;
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const text = await response.text();
      if (!response.ok) throw new Error(text || "Request failed");
      if (mode === "login") {
        let result; try { result = JSON.parse(text); } catch { result = { username: data.username, password: data.password }; }
        localStorage.setItem("uname", result.username || data.username); localStorage.setItem("upsw", result.password || data.password);
        onClose(); navigate("/dboard");
      } else { alert(text || "Account created successfully"); switchMode("login"); }
    } catch (err) { alert(err.message || "Unable to connect to backend. Start Spring Boot on port 8080."); }
    finally { setBusy(false); }
  };
  return <Modal onClose={onClose}><div className="auth-title">{mode === "login" ? "Welcome Back" : "Create Account"}</div><form onSubmit={submit} className="form">
    {mode === "register" && <label>Full Name<input name="username" value={data.username} onChange={change} placeholder="venkatesh" required /></label>}
    <label>Email<input name="email" type="email" value={data.email} onChange={change} placeholder="john@example.com" required={mode === "register"} /></label>
    {mode === "login" && <label>Username<input name="username" value={data.username} onChange={change} placeholder="Enter username" required /></label>}
    <label>Password<input name="password" type="password" value={data.password} onChange={change} placeholder="••••••••" required /></label>
    <button className="primary full" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}</button>
  </form><button className="switch" onClick={() => switchMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</button></Modal>;
}

function BookingModal({ movie, onClose }) {
  const [step, setStep] = useState(1); const [tickets, setTickets] = useState(1); const [date, setDate] = useState(0);
  const dates = ["Today", "Tomorrow", "Sat", "Sun", "Mon", "Tue"].map((day, i) => ({ day, date: 8+i, month: "Oct" }));
  const theaters = ["PVR Icon", "INOX Megaplex", "Cinepolis", "My Booking Cinemas"];
  if (step === 1) return <Modal onClose={onClose}><h2>Select Tickets</h2><div className="movie-summary"><b>{movie.title}</b><span>Select the number of tickets you want to book</span></div><div className="ticket-icon">🎟</div><label className="center-label">Number of Tickets<select value={tickets} onChange={e => setTickets(Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} Ticket{n>1?'s':''}</option>)}</select></label><button className="primary full" onClick={() => setStep(2)}>Continue to Select Theater</button></Modal>;
  if (step === 2) return <Modal onClose={onClose} wide><h2>Select Theater & Showtime</h2><div className="movie-summary"><b>{movie.title}</b></div><div className="date-title">▣ &nbsp; Select Date</div><div className="dates">{dates.map((d,i)=><button key={d.day} className={date===i?"date selected":"date"} onClick={()=>setDate(i)}><b>{d.day}</b><strong>{d.date}</strong><span>{d.month}</span></button>)}</div><h3 className="available">Available Halls & Showtimes</h3><div className="theaters">{theaters.map((t,i)=><div className="theater" key={t}><div><b>{t}</b><span>Premium Cinema • Hindi, English, Telugu</span></div><div className="times"><button onClick={()=>setStep(3)}>{i+1}:00 PM</button><button onClick={()=>setStep(3)}>{i+2}:30 PM</button><button onClick={()=>setStep(3)}>{i+4}:45 PM</button></div></div>)}</div></Modal>;
  return <Modal onClose={onClose}><h2>Booking Confirmed</h2><div className="success">✓</div><h3>{movie.title}</h3><p className="confirm-text">{tickets} ticket{tickets>1?'s':''} • {theaters[0]} • {dates[date].day}, {dates[date].date} {dates[date].month}</p><button className="primary full" onClick={onClose}>Done</button></Modal>;
}

export default function Home() {
  const [auth, setAuth] = useState(null); const [booking, setBooking] = useState(null); const [search, setSearch] = useState("");
  const filtered = useMemo(() => movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase())), [search]);
  return <div className="site"><Header onLogin={() => setAuth("login")} />
    <section className="hero"><div className="hero-image"></div><div className="hero-content"><span className="pill">Action / Thriller</span><h1>Baby John</h1><p>One Man. One Mission.</p><button className="primary" onClick={()=>setBooking(movies[2])}>Book Tickets</button></div><button className="hero-arrow left">‹</button><button className="hero-arrow right">›</button><div className="dots"><i></i><i></i><i className="on"></i></div></section>
    <main>
      <div className="section-heading"><div><h2>Now Showing</h2><p>Book tickets for the latest movies</p></div><button>See All →</button></div>
      <div className="search-mobile"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search movies..." /></div>
      <div className="movie-grid">{filtered.map(m => <MovieCard key={m.title} movie={m} onBook={setBooking}/>)}</div>
      <div className="section-heading coming"><div><h2>Coming Soon</h2><p>Upcoming movies to watch out for</p></div></div>
      <div className="movie-grid upcoming">{upcoming.map(m => <MovieCard key={m.title} movie={m} onBook={setBooking}/>)}</div>
    </main>
    <footer><div><h4>Movies Now Showing</h4><button className="footer-link">Pushpa 2</button><button className="footer-link">Mufasa</button><button className="footer-link">Baby John</button><button className="footer-link">Max</button></div><div><h4>Upcoming Movies</h4><button className="footer-link">Fighter 2</button><button className="footer-link">War 2</button><button className="footer-link">Alpha</button><button className="footer-link">Sky Force</button></div><div><h4>Help</h4><button className="footer-link">About Us</button><button className="footer-link">Contact Us</button><button className="footer-link">FAQs</button><button className="footer-link">Terms &amp; Conditions</button></div><div><h4>My Booking</h4><p>Your one-stop destination for booking movie tickets, events, and more.</p><span className="footer-logo">MB</span></div><div className="copyright">© 2024 My Booking. Made with ♥</div></footer>
    {auth && <AuthModal mode={auth} onClose={()=>setAuth(null)} switchMode={setAuth}/>} {booking && <BookingModal movie={booking} onClose={()=>setBooking(null)}/>} 
  </div>;
}
