import { inventoryAction } from "../shared/inventory.controller.js";
import { purchasesService } from "./purchases.service.js";
export const purchasesController = {
  debts: inventoryAction(purchasesService.debts, 200),
  pay: inventoryAction(purchasesService.pay, 201),
  list: inventoryAction(purchasesService.list, 200),
  returnPurchase: inventoryAction(purchasesService.returnPurchase, 200),
  remove: inventoryAction(purchasesService.remove, 200),
  retailers: inventoryAction(purchasesService.retailers, 200),
  create: inventoryAction(purchasesService.create, 201),
};
