CREATE TABLE IF NOT EXISTS `inventory_InventoryOrder` (
 `id` VARCHAR(191) NOT NULL,
 `requestId` VARCHAR(191) NOT NULL,
 `name` VARCHAR(191) NOT NULL,
 `note` TEXT NULL,
 `items` JSON NOT NULL,
 `totalPrice` DECIMAL(18,2) NOT NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY (`id`),
 UNIQUE INDEX `inventory_InventoryOrder_requestId_key` (`requestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
