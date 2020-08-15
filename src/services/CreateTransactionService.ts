import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();
    if (type === 'outcome' && value > total) {
      throw new Error('You do not have enough balance');
    }
    if (!title) {
      throw Error('Field title is required!');
    }
    if (!value) {
      throw Error('Field value is required!');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw Error('This type is not valid!');
    }
    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
