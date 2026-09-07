CREATE TABLE IF NOT EXISTS `inventory_InventoryPurchase` (
  `id` VARCHAR(191) NOT NULL,
  `requestId` VARCHAR(191) NOT NULL,
  `invoiceNumber` VARCHAR(191) NOT NULL,
  `buyDate` DATETIME(3) NOT NULL,
  `retailer` VARCHAR(191) NOT NULL,
  `salesperson` VARCHAR(191) NULL,
  `isDebt` BOOLEAN NOT NULL DEFAULT false,
  `note` TEXT NULL,
  `attachmentUrl` VARCHAR(191) NULL,
  `totalPrice` DECIMAL(18,2) NOT NULL,
  `items` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `inventory_InventoryPurchase_requestId_key` (`requestId`),
  UNIQUE INDEX `inventory_InventoryPurchase_retailer_invoiceNumber_key` (`retailer`, `invoiceNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
