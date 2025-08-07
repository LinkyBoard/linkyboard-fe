import Layout from "@/components/layout";

import { Route, HashRouter as Router, Routes } from "react-router-dom";

import CreateContent from "./pages/create-content";
import ErrorPage from "./pages/error";
import Home from "./pages/home";
import SearchContent from "./pages/search-content";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search-content" element={<SearchContent />} />
          <Route path="/create-content" element={<CreateContent />} />
          <Route
            path="/no-summary"
            element={
              <ErrorPage
                title="생성된 북마크 요약이 없습니다."
                subtitle="북마크를 요약하러 가볼까요?"
              />
            }
          />
          <Route
            path="*"
            element={
              <ErrorPage
                title="요청하신 경로가 없습니다."
                subtitle="경로를 다시 한 번 확인해주세요."
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
