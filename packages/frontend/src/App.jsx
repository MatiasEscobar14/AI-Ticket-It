import {Routes, Route} from 'react-router-dom';
import Layout from './features/layout/layout.jsx';
import Home from './features/home/home.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;