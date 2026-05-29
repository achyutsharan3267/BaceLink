import Cards, { EventsPage } from "./Cards"
import Admin from "./Admin"


const App = () => {
  if (window.location.pathname === "/admin") {
    return <Admin />
  }

  if (window.location.pathname === "/events") {
    return <EventsPage />
  }

  return (
    <>
      <Cards />
    </>
  )
}

export default App
