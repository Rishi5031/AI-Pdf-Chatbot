import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Home />
    </>
  );
}

export default App;