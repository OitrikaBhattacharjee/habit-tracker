export default function About() {
  return (
    <div className="container section">
      <div className="about-block">
        <h2>About this app</h2>
        <p>
          This is Ember, my habit tracker for Assignment 3. You can add habits, check them off
          each day, and see your streaks build up over time. Everything is saved in your
          browser's localStorage, so closing the tab won't lose your data.
        </p>

        <h3>Built with</h3>
        <ul>
          <li>React (function components + hooks)</li>
          <li>React Router for the different pages</li>
          <li>Context API for the global habit state</li>
          <li>localStorage for saving data, no backend</li>
          <li>Plain CSS, no UI library</li>
        </ul>

        <h3>What I learned</h3>
        <ul>
          <li>Streak math is way harder than it looks. Deciding whether "today" counts before it's even checked off took a few tries to get right.</li>
          <li>Working with dates as plain strings (YYYY-MM-DD) saved me from a bunch of timezone bugs that were eating my time.</li>
          <li>You don't need a charting library for a heatmap, a CSS grid and some background colors do the job fine.</li>
          <li>Only showing form errors after a field is touched makes a huge difference in how a form feels to use.</li>
        </ul>

        <div className="meme-card">
          // me after fixing the streak bug for the third time:
          <br />
          if (doneToday) streak++;
          <br />
          else if (doneYesterday) streak = streak;
          <br />
          else streak = 0; // it was never this simple
        </div>

        <p>
          If you're also building something with streaks and dates, my advice: draw it out on
          paper first. Saved me a lot of debugging.
        </p>
      </div>
    </div>
  );
}
