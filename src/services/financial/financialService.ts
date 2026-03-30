import OperatingExpense, { IOperatingExpense } from '../../models/financial/OperatingExpense';
import CapitalContribution, { ICapitalContribution } from '../../models/financial/CapitalContribution';
import Order from '../../models/order/order.model';
import Product from '../../models/product/product.model';
import type {
  IOperatingExpenseData,
  ICapitalContributionData,
  IDateRangeFilter,
  IOperatingExpenseResponse,
  ICapitalContributionResponse,
  IIncomeStatement,
  ICashFlow,
} from './types';

/**
 * @description Crea un nuevo gasto operativo.
 */
export const createOperatingExpense = async (
  data: IOperatingExpenseData
): Promise<IOperatingExpenseResponse> => {
  try {
    const expense = new OperatingExpense(data);
    await expense.save();

    return {
      id: expense._id.toString(),
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      createdAt: expense.createdAt!,
      updatedAt: expense.updatedAt!,
    };
  } catch (error: any) {
    console.error('Error en createOperatingExpense:', error);
    throw {
      statusCode: 500,
      message: 'Error al crear el gasto operativo.',
    };
  }
};

/**
 * @description Obtiene gastos operativos con filtros opcionales.
 */
export const getOperatingExpenses = async (
  filters: IDateRangeFilter
): Promise<IOperatingExpenseResponse[]> => {
  try {
    const query: any = {};

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate;
      }
    }

    const expenses = await OperatingExpense.find(query).sort({ date: -1 });

    return expenses.map((expense) => ({
      id: expense._id.toString(),
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      createdAt: expense.createdAt!,
      updatedAt: expense.updatedAt!,
    }));
  } catch (error: any) {
    console.error('Error en getOperatingExpenses:', error);
    throw {
      statusCode: 500,
      message: 'Error al obtener los gastos operativos.',
    };
  }
};

/**
 * @description Actualiza un gasto operativo.
 */
export const updateOperatingExpense = async (
  id: string,
  updateData: Partial<IOperatingExpenseData>
): Promise<IOperatingExpenseResponse> => {
  try {
    const expense = await OperatingExpense.findByIdAndUpdate(id, updateData, { new: true });

    if (!expense) {
      throw {
        statusCode: 404,
        message: 'Gasto operativo no encontrado.',
      };
    }

    return {
      id: expense._id.toString(),
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      createdAt: expense.createdAt!,
      updatedAt: expense.updatedAt!,
    };
  } catch (error: any) {
    console.error('Error en updateOperatingExpense:', error);
    throw error.statusCode ? error : { statusCode: 500, message: 'Error al actualizar el gasto operativo.' };
  }
};

/**
 * @description Elimina un gasto operativo.
 */
export const deleteOperatingExpense = async (id: string): Promise<void> => {
  try {
    const expense = await OperatingExpense.findByIdAndDelete(id);

    if (!expense) {
      throw {
        statusCode: 404,
        message: 'Gasto operativo no encontrado.',
      };
    }
  } catch (error: any) {
    console.error('Error en deleteOperatingExpense:', error);
    throw error.statusCode ? error : { statusCode: 500, message: 'Error al eliminar el gasto operativo.' };
  }
};

/**
 * @description Crea un nuevo aporte de capital.
 */
export const createCapitalContribution = async (
  data: ICapitalContributionData
): Promise<ICapitalContributionResponse> => {
  try {
    const contribution = new CapitalContribution(data);
    await contribution.save();

    return {
      id: contribution._id.toString(),
      description: contribution.description,
      amount: contribution.amount,
      date: contribution.date,
      createdAt: contribution.createdAt!,
      updatedAt: contribution.updatedAt!,
    };
  } catch (error: any) {
    console.error('Error en createCapitalContribution:', error);
    throw {
      statusCode: 500,
      message: 'Error al crear el aporte de capital.',
    };
  }
};

/**
 * @description Obtiene aportes de capital con filtros opcionales.
 */
export const getCapitalContributions = async (
  filters: IDateRangeFilter
): Promise<ICapitalContributionResponse[]> => {
  try {
    const query: any = {};

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate;
      }
    }

    const contributions = await CapitalContribution.find(query).sort({ date: -1 });

    return contributions.map((contribution) => ({
      id: contribution._id.toString(),
      description: contribution.description,
      amount: contribution.amount,
      date: contribution.date,
      createdAt: contribution.createdAt!,
      updatedAt: contribution.updatedAt!,
    }));
  } catch (error: any) {
    console.error('Error en getCapitalContributions:', error);
    throw {
      statusCode: 500,
      message: 'Error al obtener los aportes de capital.',
    };
  }
};

/**
 * @description Actualiza un aporte de capital.
 */
export const updateCapitalContribution = async (
  id: string,
  updateData: Partial<ICapitalContributionData>
): Promise<ICapitalContributionResponse> => {
  try {
    const contribution = await CapitalContribution.findByIdAndUpdate(id, updateData, { new: true });

    if (!contribution) {
      throw {
        statusCode: 404,
        message: 'Aporte de capital no encontrado.',
      };
    }

    return {
      id: contribution._id.toString(),
      description: contribution.description,
      amount: contribution.amount,
      date: contribution.date,
      createdAt: contribution.createdAt!,
      updatedAt: contribution.updatedAt!,
    };
  } catch (error: any) {
    console.error('Error en updateCapitalContribution:', error);
    throw error.statusCode ? error : { statusCode: 500, message: 'Error al actualizar el aporte de capital.' };
  }
};

/**
 * @description Elimina un aporte de capital.
 */
export const deleteCapitalContribution = async (id: string): Promise<void> => {
  try {
    const contribution = await CapitalContribution.findByIdAndDelete(id);

    if (!contribution) {
      throw {
        statusCode: 404,
        message: 'Aporte de capital no encontrado.',
      };
    }
  } catch (error: any) {
    console.error('Error en deleteCapitalContribution:', error);
    throw error.statusCode ? error : { statusCode: 500, message: 'Error al eliminar el aporte de capital.' };
  }
};

/**
 * @description Genera un Estado de Resultados (Income Statement).
 * Calcula: Ventas - Costo de Mercadería - Gastos Operativos = Ganancia Neta
 */
export const getIncomeStatement = async (filters: IDateRangeFilter): Promise<IIncomeStatement> => {
  try {
    const startDate = filters.startDate || new Date(new Date().getFullYear(), 0, 1);
    const endDate = filters.endDate || new Date();

    // Calcular Ingresos por Ventas
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ['confirmed', 'preparing', 'shipped', 'delivered'] },
    });

    const totalSalesRevenue = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

    // Calcular Costo de Mercadería Vendida (COGS) - usando batch query
    let totalCostOfGoodsSold = 0;

    // Recolectar todas las IDs de productos únicos
    const productIds = new Set<string>();
    for (const order of orders) {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.product?._id) {
            productIds.add(item.product._id.toString());
          }
        }
      }
    }

    // Obtener todos los productos en una sola consulta
    const products = await Product.find({
      _id: { $in: Array.from(productIds) },
    });

    const productMap = new Map(products.map((p) => [p._id.toString(), p.costPrice || 0]));

    // Calcular COGS usando el mapa de productos
    for (const order of orders) {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          const costPrice = productMap.get(item.product._id.toString()) || 0;
          totalCostOfGoodsSold += costPrice * (item.quantity || 0);
        }
      }
    }

    // Obtener Gastos Operativos
    const expenses = await OperatingExpense.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const totalOperatingExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calcular Ganancia Bruta y Ganancia Neta
    const grossProfit = totalSalesRevenue - totalCostOfGoodsSold;
    const netProfit = grossProfit - totalOperatingExpenses;

    return {
      period: {
        startDate,
        endDate,
      },
      totalSalesRevenue,
      totalCostOfGoodsSold,
      grossProfit,
      totalOperatingExpenses,
      netProfit,
    };
  } catch (error: any) {
    console.error('Error en getIncomeStatement:', error);
    throw {
      statusCode: 500,
      message: 'Error al generar el Estado de Resultados.',
    };
  }
};

/**
 * @description Genera un Flujo de Caja (Cash Flow).
 * Calcula: Ingresos - Gastos + Aportes de Capital = Flujo Neto de Caja
 */
export const getCashFlow = async (filters: IDateRangeFilter): Promise<ICashFlow> => {
  try {
    const startDate = filters.startDate || new Date(new Date().getFullYear(), 0, 1);
    const endDate = filters.endDate || new Date();

    // Calcular Ingresos (ventas completadas)
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ['confirmed', 'preparing', 'shipped', 'delivered'] },
    });

    const totalIncome = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

    // Calcular Gastos (gastos operativos)
    const expenses = await OperatingExpense.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Obtener Aportes de Capital
    const contributions = await CapitalContribution.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const capitalContributions = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);

    // Calcular Flujo Neto de Caja
    const netCashFlow = totalIncome - totalExpenses + capitalContributions;

    return {
      period: {
        startDate,
        endDate,
      },
      totalIncome,
      totalExpenses,
      capitalContributions,
      netCashFlow,
    };
  } catch (error: any) {
    console.error('Error en getCashFlow:', error);
    throw {
      statusCode: 500,
      message: 'Error al generar el Flujo de Caja.',
    };
  }
};
