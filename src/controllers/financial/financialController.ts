import { Request, Response } from 'express';
import * as financialService from '../../services/financial/financialService';
import type {
  ICreateOperatingExpenseDto,
  IUpdateOperatingExpenseDto,
  ICreateCapitalContributionDto,
  IUpdateCapitalContributionDto,
} from './types';

/**
 * @description Crea un nuevo gasto operativo.
 * @route POST /api/financial/operating-expenses
 * @access Private/Admin
 */
export const createOperatingExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, amount, date, category } = req.body as ICreateOperatingExpenseDto;

    // Validaciones
    if (!description || !amount || !date || !category) {
      res.status(400).json({
        message: 'Los campos description, amount, date y category son obligatorios.',
      });
      return;
    }

    if (amount < 0) {
      res.status(400).json({
        message: 'El monto del gasto no puede ser negativo.',
      });
      return;
    }

    const newExpense = await financialService.createOperatingExpense({
      description,
      amount,
      date: new Date(date),
      category,
    });

    res.status(201).json({
      message: 'Gasto operativo creado exitosamente.',
      expense: newExpense,
    });
  } catch (error: any) {
    console.error('Error al crear gasto operativo:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al crear el gasto operativo.',
    });
  }
};

/**
 * @description Obtiene todos los gastos operativos con filtros opcionales.
 * @route GET /api/financial/operating-expenses
 * @access Private/Admin
 */
export const getOperatingExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;

    const expenses = await financialService.getOperatingExpenses({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.status(200).json({
      message: 'Gastos operativos obtenidos exitosamente.',
      expenses,
    });
  } catch (error: any) {
    console.error('Error al obtener gastos operativos:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al obtener los gastos operativos.',
    });
  }
};

/**
 * @description Actualiza un gasto operativo existente.
 * @route PUT /api/financial/operating-expenses/:id
 * @access Private/Admin
 */
export const updateOperatingExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body as IUpdateOperatingExpenseDto;

    if (updateData.amount !== undefined && updateData.amount < 0) {
      res.status(400).json({
        message: 'El monto del gasto no puede ser negativo.',
      });
      return;
    }

    const updatedExpense = await financialService.updateOperatingExpense(id, {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : undefined,
    });

    res.status(200).json({
      message: 'Gasto operativo actualizado exitosamente.',
      expense: updatedExpense,
    });
  } catch (error: any) {
    console.error('Error al actualizar gasto operativo:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al actualizar el gasto operativo.',
    });
  }
};

/**
 * @description Elimina un gasto operativo.
 * @route DELETE /api/financial/operating-expenses/:id
 * @access Private/Admin
 */
export const deleteOperatingExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await financialService.deleteOperatingExpense(id);

    res.status(200).json({
      message: 'Gasto operativo eliminado exitosamente.',
    });
  } catch (error: any) {
    console.error('Error al eliminar gasto operativo:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al eliminar el gasto operativo.',
    });
  }
};

/**
 * @description Crea un nuevo aporte de capital.
 * @route POST /api/financial/capital-contributions
 * @access Private/Admin
 */
export const createCapitalContribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { description, amount, date } = req.body as ICreateCapitalContributionDto;

    // Validaciones
    if (!description || !amount || !date) {
      res.status(400).json({
        message: 'Los campos description, amount y date son obligatorios.',
      });
      return;
    }

    if (amount < 0) {
      res.status(400).json({
        message: 'El monto del aporte no puede ser negativo.',
      });
      return;
    }

    const newContribution = await financialService.createCapitalContribution({
      description,
      amount,
      date: new Date(date),
    });

    res.status(201).json({
      message: 'Aporte de capital creado exitosamente.',
      contribution: newContribution,
    });
  } catch (error: any) {
    console.error('Error al crear aporte de capital:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al crear el aporte de capital.',
    });
  }
};

/**
 * @description Obtiene todos los aportes de capital con filtros opcionales.
 * @route GET /api/financial/capital-contributions
 * @access Private/Admin
 */
export const getCapitalContributions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;

    const contributions = await financialService.getCapitalContributions({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.status(200).json({
      message: 'Aportes de capital obtenidos exitosamente.',
      contributions,
    });
  } catch (error: any) {
    console.error('Error al obtener aportes de capital:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al obtener los aportes de capital.',
    });
  }
};

/**
 * @description Actualiza un aporte de capital existente.
 * @route PUT /api/financial/capital-contributions/:id
 * @access Private/Admin
 */
export const updateCapitalContribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body as IUpdateCapitalContributionDto;

    if (updateData.amount !== undefined && updateData.amount < 0) {
      res.status(400).json({
        message: 'El monto del aporte no puede ser negativo.',
      });
      return;
    }

    const updatedContribution = await financialService.updateCapitalContribution(id, {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : undefined,
    });

    res.status(200).json({
      message: 'Aporte de capital actualizado exitosamente.',
      contribution: updatedContribution,
    });
  } catch (error: any) {
    console.error('Error al actualizar aporte de capital:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al actualizar el aporte de capital.',
    });
  }
};

/**
 * @description Elimina un aporte de capital.
 * @route DELETE /api/financial/capital-contributions/:id
 * @access Private/Admin
 */
export const deleteCapitalContribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await financialService.deleteCapitalContribution(id);

    res.status(200).json({
      message: 'Aporte de capital eliminado exitosamente.',
    });
  } catch (error: any) {
    console.error('Error al eliminar aporte de capital:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al eliminar el aporte de capital.',
    });
  }
};

/**
 * @description Genera el Estado de Resultados (Income Statement).
 * @route GET /api/financial/reports/income-statement
 * @access Private/Admin
 */
export const getIncomeStatement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;

    const report = await financialService.getIncomeStatement({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.status(200).json({
      message: 'Estado de Resultados generado exitosamente.',
      report,
    });
  } catch (error: any) {
    console.error('Error al generar Estado de Resultados:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al generar el Estado de Resultados.',
    });
  }
};

/**
 * @description Genera el Flujo de Caja (Cash Flow).
 * @route GET /api/financial/reports/cash-flow
 * @access Private/Admin
 */
export const getCashFlow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;

    const report = await financialService.getCashFlow({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.status(200).json({
      message: 'Flujo de Caja generado exitosamente.',
      report,
    });
  } catch (error: any) {
    console.error('Error al generar Flujo de Caja:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error al generar el Flujo de Caja.',
    });
  }
};
