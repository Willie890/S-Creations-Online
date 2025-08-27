import { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';

export default function Layout({ children }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Head>
        <title>S-Creations Online</title>
        <meta name="description" content="Premium handmade products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <Header onCartClick={() => setCartOpen(true)} />
        <Main>
          {children}
        </Main>
        <Footer />
        
        <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </Container>
    </>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: 80px;
`;
