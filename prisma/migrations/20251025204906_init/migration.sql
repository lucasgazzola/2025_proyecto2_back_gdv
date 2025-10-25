/*
  Warnings:

  - You are about to drop the column `providerId` on the `InvoiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Provider` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Provider` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InvoiceState" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "public"."InvoiceDetail" DROP CONSTRAINT "InvoiceDetail_providerId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "state" "InvoiceState" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "InvoiceDetail" DROP COLUMN "providerId";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "phone",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Provider_code_key" ON "Provider"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_email_key" ON "Provider"("email");
