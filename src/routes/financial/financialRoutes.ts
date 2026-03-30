import express, { Router } from 'express';
import {
  createOperatingExpense,
  getOperatingExpenses,
  updateOperatingExpense,
  deleteOperatingExpense,
  createCapitalContribution,
  getCapitalContributions,
  updateCapitalContribution,
  deleteCapitalContribution,
  getIncomeStatement,
  getCashFlow,
} from '../../controllers/financial/financialController';

const router: Router = express.Router();

// Operating Expenses Routes
router.post('/operating-expenses', createOperatingExpense);
router.get('/operating-expenses', getOperatingExpenses);
router.put('/operating-expenses/:id', updateOperatingExpense);
router.delete('/operating-expenses/:id', deleteOperatingExpense);

// Capital Contributions Routes
router.post('/capital-contributions', createCapitalContribution);
router.get('/capital-contributions', getCapitalContributions);
router.put('/capital-contributions/:id', updateCapitalContribution);
router.delete('/capital-contributions/:id', deleteCapitalContribution);

// Financial Reports Routes
router.get('/reports/income-statement', getIncomeStatement);
router.get('/reports/cash-flow', getCashFlow);

export default router;
