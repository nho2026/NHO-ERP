CREATE TABLE IF NOT EXISTS `inventory_InventoryDepartmentOrder` (
 `id` VARCHAR(191) NOT NULL PRIMARY KEY, `departmentId` VARCHAR(191) NOT NULL,
 `departmentName` VARCHAR(191) NOT NULL, `type` VARCHAR(191) NOT NULL,
 `deadline` DATETIME(3) NULL, `note` TEXT NULL, `phone` VARCHAR(191) NULL,
 `items` JSON NOT NULL, `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
 `price` DECIMAL(18,2) NULL, `reason` TEXT NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS `inventory_InventoryDepartmentOrderComment` (
 `id` VARCHAR(191) NOT NULL PRIMARY KEY, `orderId` VARCHAR(191) NOT NULL,
 `note` TEXT NOT NULL, `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 INDEX `inventory_InventoryDepartmentOrderComment_orderId_idx` (`orderId`),
 CONSTRAINT `inventory_InventoryDepartmentOrderComment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `inventory_InventoryDepartmentOrder` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
