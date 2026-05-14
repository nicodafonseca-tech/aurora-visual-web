import { useState } from 'react';
import ComingSoon from './pages/ComingSoon';
import EntranceLoader from './components/EntranceLoader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="App">
      {isLoading && <EntranceLoader onComplete={() => setIsLoading(false)} />}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <ComingSoon />
      </div>
    </div>
  );
}

export default App;
