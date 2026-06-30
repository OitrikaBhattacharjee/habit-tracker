import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="big-num">404</div>
      <h2>That streak doesn't exist.</h2>
      <p style={{ maxWidth: 420, marginBottom: 24 }}>
        This page got skipped, just like that one day you forgot to log your habit. Let's get
        you back on track.
      </p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
