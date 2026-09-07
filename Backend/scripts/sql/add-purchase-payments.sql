ALTER TABLE `inventory_InventoryPurchase` ADD COLUMN `paidAmount` DECIMAL(18,2) NOT NULL DEFAULT 0;
CREATE TABLE `inventory_InventoryPurchasePayment` (
 `id` VARCHAR(191) NOT NULL,
 `requestId` VARCHAR(191) NOT NULL,
 `purchaseId` VARCHAR(191) NOT NULL,
 `amount` DECIMAL(18,2) NOT NULL,
 `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 `note` TEXT NULL,
 PRIMARY KEY (`id`),
 UNIQUE INDEX `inventory_InventoryPurchasePayment_requestId_key` (`requestId`),
 INDEX `inventory_InventoryPurchasePayment_purchaseId_idx` (`purchaseId`),
 CONSTRAINT `inventory_InventoryPurchasePayment_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `inventory_InventoryPurchase` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
