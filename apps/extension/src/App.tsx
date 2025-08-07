import { HashRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "@/components/layout";
import Agreement from "./pages/agreement";
import ErrorPage from "./pages/error";
import Home from "./pages/home";
import SearchContent from "./pages/search-content";
import CreateContent from "./pages/create-content";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agreement" element={<Agreement />} />
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
