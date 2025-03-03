import React from 'react';
import '@mantine/core/styles.css'
import { MantineProvider, Container, Title, Button } from '@mantine/core';
import ExpenseTable from './components/ExpenseTable';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container>
        <ExpenseTable />
      </Container>
    </MantineProvider>
  );
}

export default App;
