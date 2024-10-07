import { HashRouter, Route, Routes } from 'react-router-dom';
import HomePage from "./Pages/HomePage/Homepage"
import SettingPage from './Pages/SettingPage/SettingPage';
import Layout from './Layout/Layout';
import { useEffect } from 'react';
import ListOfCostsPage from './Pages/ListOfCostsPage/ListOfCostsPage';
import InventoryPage from './Pages/InventoryPage/InventoryPage';
import { RecoilRoot } from 'recoil';


function App() {

  useEffect(() => {
    document.title = "Ciane 13 Manager";
  }, []);

  return (

    // <HashRouter>
    //   <Routes>
    //     <Route element={<Layout />}>
    //       <Route path="/" element={<TestPage />} />
    //     </Route>
    //   </Routes>
    // </HashRouter>
    <RecoilRoot>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/CostiGestione" element={<ListOfCostsPage />} />
            <Route path="/CostiFornitori" element={<ListOfCostsPage />} />
            <Route path="/Inventario" element={<InventoryPage />} />
            <Route path="/Setting" element={<SettingPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </RecoilRoot>
  );
}

export default App;
