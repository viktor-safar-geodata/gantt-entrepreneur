import './App.css';
import { SchedulerWithMap } from './scheduler/SchedulerWithMap';
import { getUserName } from './utils/authenticate';

function App() {
  getUserName();

  return (
    <div id="app-root">
      <SchedulerWithMap />
    </div>
  );
}

export default App;
