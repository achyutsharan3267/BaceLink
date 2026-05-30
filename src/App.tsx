import Cards, { EventsPage } from "./Cards"
import Admin from "./Admin"
import CompetitionAdminPage from "./routes/CompetitionAdminPage"
import ParticipantCompetitionPage from "./routes/ParticipantCompetitionPage"
import LiveLeaderboardPage from "./routes/LiveLeaderboardPage"


const App = () => {
  if (window.location.pathname === "/admin") {
    return <Admin />
  }

  if (window.location.pathname === "/events") {
    return <EventsPage />
  }

  if (window.location.pathname === "/quiz") {
    return <ParticipantCompetitionPage />
  }

  if (window.location.pathname === "/competition-admin") {
    return <CompetitionAdminPage />
  }

  if (window.location.pathname === "/competition") {
    return <ParticipantCompetitionPage />
  }

  if (window.location.pathname === "/live-leaderboard") {
    return <LiveLeaderboardPage />
  }

  return (
    <>
      <Cards />
    </>
  )
}

export default App
