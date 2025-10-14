import Header from '@/components/Header';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}