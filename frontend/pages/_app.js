import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#0D1F3C', color: '#fff', borderLeft: '3px solid #C9A84C' },
          duration: 4000,
        }}
      />
    </>
  );
}
