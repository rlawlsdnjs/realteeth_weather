import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SearchPage } from "../pages/SearchPage";
import { LocationDetailPage } from "../pages/LocationDetailPage";
import { FavoritesPage } from "../pages/FavoritesPage";

export function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/location/:id" element={<LocationDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
