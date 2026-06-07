import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Quiz } from './pages/Quiz'
import { QuizHome } from './pages/QuizHome'
import { Roadmap } from './pages/Roadmap'
import { Review } from './pages/Review'
import { SDQuiz } from './pages/SDQuiz'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<QuizHome />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/review" element={<Review />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/quiz/:slug" element={<SDQuiz />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
