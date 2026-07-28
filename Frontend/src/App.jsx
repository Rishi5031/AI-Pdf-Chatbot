import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <ChatProvider>
      <Toaster position="top-right" />
      <Home />
    </ChatProvider>
  );
}

export default App;