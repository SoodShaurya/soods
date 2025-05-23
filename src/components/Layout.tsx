import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div 
    className="flex flex-col min-h-screen"
    style={{ position: 'relative', zIndex: 1, background: 'transparent' }}
  >
    <Header />
    <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    <Footer />
  </div>
);

export default Layout; 