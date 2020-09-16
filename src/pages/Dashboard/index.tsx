import React, { useState, useEffect } from 'react';

import formatValue from '../../utils/formatValue';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const receivedTransactions: Transaction[] = response.data.transactions;
      const receivedBalance: Balance = response.data.balance;

      const formattedTransactions = receivedTransactions.map(transaction => {
        const formattedDate = new Date(
          transaction.created_at,
        ).toLocaleDateString('pt-br');

        const formattedValue =
          transaction.type === 'income'
            ? formatValue(Number(transaction.value))
            : `- ${formatValue(Number(transaction.value))}`;

        return {
          ...transaction,
          formattedDate, // eslint-disable-line
          formattedValue,
        };
      });

      const formattedBalance: Balance = {
        income: formatValue(Number(receivedBalance.income)),
        outcome: formatValue(Number(receivedBalance.outcome)),
        total: formatValue(Number(receivedBalance.total)),
      };

      setBalance(formattedBalance);

      setTransactions(formattedTransactions);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title" key={transaction.id}>
                    {transaction.title}
                  </td>
                  <td className="income">{transaction.formattedValue}</td>
                  <td>{transaction.category?.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
