
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from './components/ui/sonner.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <Toaster richColors={true} duration={3000} />
    </>
)
