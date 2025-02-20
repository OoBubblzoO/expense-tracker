import React from 'react';
import { MantineProvider, Container, Title, Button } from '@mantine/core';
import ExpenseTable from './components/ExpenseTable';
import CategoryPieChart from './components/CategoryPieChart';
function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container>
        <Title order={1} align="center" mt="md">
          Expense Tracker
        </Title>
        <Button color='teal' mt='md'>Test Mantine Button</Button>
        <ExpenseTable />

        <CategoryPieChart />
      </Container>
    </MantineProvider>
  );
}

export default App;
