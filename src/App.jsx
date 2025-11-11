import AppContextProvider from "./components/Configurator/contexts/appContext"
import Configurator from "./components/Configurator"
import HomePage from "./HomePage"
export default function App() {

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <AppContextProvider>
        {/* <Configurator /> */}
        <HomePage/>
      </AppContextProvider >
    </div>
  )
}
