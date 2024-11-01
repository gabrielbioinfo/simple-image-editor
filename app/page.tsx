'use client'

import ImageListComponent from '@/components/ImageListComponent';
import Footer from '../components/Footer';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">
        <ImageListComponent />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
