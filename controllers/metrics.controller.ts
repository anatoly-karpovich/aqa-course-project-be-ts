import { Request, Response } from "express";
import MetricsService from "../services/metrics.service";

class MetricsController {
  async getMetrics(req: Request, res: Response) {
    try {
      const salesPortalMetrics = await MetricsService.getMetricsForCurrentYear();
      const ordersCountPerDay = await MetricsService.getOrdersCountPerDay();
      const topProducts = await MetricsService.getTopSoldProductsData();
      const customerGrowth = await MetricsService.getCustomerGrowth(15);
      const metrics = {
        orders: {
          totalRevenue: salesPortalMetrics.totalRevenue,
          totalOrders: salesPortalMetrics.totalOrders,
          averageOrderValue: salesPortalMetrics.averageOrderValue,
          totalCanceledOrders: salesPortalMetrics.totalCanceledOrders,
          recentOrders: salesPortalMetrics.recentOrders,
          ordersCountPerDay,
        },
        customers: {
          totalNewCustomers: salesPortalMetrics.totalNewCustomers,
          topCustomers: salesPortalMetrics.topCustomers,
          customerGrowth,
        },
        products: {
          topProducts,
        },
      };
      res.status(200).json({ IsSuccess: true, Metrics: metrics, ErrorMessage: null });
    } catch (error: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: error.message });
    }
  }
}

export default new MetricsController();
