-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEFAULT', 'ROOT', 'ADMIN', 'DEMO', 'API', 'SYSTEM');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Person_Type" AS ENUM ('COSTUMER', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('RAW_MATERIAL', 'MADE', 'CONSUMABLE', 'OTHER');

-- CreateEnum
CREATE TYPE "Unit_Measure" AS ENUM ('UN', 'PC', 'PCT', 'ML', 'L', 'GR', 'KG', 'TON');

-- CreateEnum
CREATE TYPE "Price_Type" AS ENUM ('COST', 'SALE');

-- CreateEnum
CREATE TYPE "Stock_Moviment" AS ENUM ('INPUT', 'TRANSIT', 'OUTPUT', 'RESERVED', 'BALANCE', 'ADJUST', 'INVENTORY');

-- CreateEnum
CREATE TYPE "Production_Status" AS ENUM ('CREATED', 'SCHEDULED', 'OPEN', 'IN_PROGRESS', 'FINISHED', 'STOPPED', 'CANCELED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DEFAULT',
    "username" VARCHAR(255),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "gender" "Gender" DEFAULT 'OTHER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "Person_Type" NOT NULL DEFAULT 'SUPPLIER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(255) NOT NULL,
    "unit_measure" "Unit_Measure" NOT NULL DEFAULT 'UN',
    "category_id" INTEGER NOT NULL DEFAULT 1,
    "group_id" INTEGER NOT NULL DEFAULT 1,
    "supplier_id" INTEGER,
    "nutritional_info" JSONB,
    "photo" BYTEA[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "origin" "Origin" NOT NULL DEFAULT 'RAW_MATERIAL',

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "Price_Type" NOT NULL DEFAULT 'COST',
    "is_current" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "document_number" VARCHAR(255) NOT NULL,
    "document_date" TIMESTAMP(6) NOT NULL,
    "stock_moviment" "Stock_Moviment" NOT NULL,
    "document_type" VARCHAR(255),
    "is_balance" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_location" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "stock_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_items" (
    "id" SERIAL NOT NULL,
    "stock_id" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "lote" TEXT,
    "expiration" TIMESTAMP(3),
    "photo" BYTEA[],
    "supplier" INTEGER,
    "costumer" INTEGER,
    "batchsid" INTEGER,
    "stock_location_id" INTEGER NOT NULL,
    "observation" TEXT,

    CONSTRAINT "stock_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_orders" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "description" VARCHAR(255),
    "production_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "production_line" VARCHAR(255),
    "Production_Status" "Production_Status" NOT NULL DEFAULT 'CREATED',

    CONSTRAINT "production_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_orders_items" (
    "id" SERIAL NOT NULL,
    "production_order_id" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "final_product_id" INTEGER NOT NULL,
    "prodution_quantity_estimated" DOUBLE PRECISION NOT NULL,
    "production_quantity_real" DOUBLE PRECISION NOT NULL,
    "production_quantity_loss" DOUBLE PRECISION NOT NULL,
    "lote" VARCHAR(255),
    "lote_expiration" TIMESTAMP(3),

    CONSTRAINT "production_orders_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_order_steps" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "production_order_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_steps_progress" (
    "id" SERIAL NOT NULL,
    "production_id" INTEGER NOT NULL,
    "step_id" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "raw_product_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "total_time" DOUBLE PRECISION,
    "initial_quantity" DOUBLE PRECISION,
    "final_quantity" DOUBLE PRECISION,
    "quantity_loss" DOUBLE PRECISION,
    "machine" TEXT,
    "line_id" INTEGER DEFAULT 1,
    "image_link" TEXT,
    "photo" BYTEA[],
    "observation" TEXT,
    "operator_id" INTEGER,
    "ocurrences" JSON,

    CONSTRAINT "production_steps_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocurrences_of_production_stages" (
    "id" SERIAL NOT NULL,
    "ocurrence_id" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "observation" TEXT,
    "image_link" TEXT,
    "photo" BYTEA[],
    "stage_ocurred_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "ocurrences_of_production_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocurrences" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "ocurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batchs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "batchs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "categories_description_key" ON "categories"("description");

-- CreateIndex
CREATE UNIQUE INDEX "stock_document_number_key" ON "stock"("document_number");

-- CreateIndex
CREATE UNIQUE INDEX "production_orders_number_key" ON "production_orders"("number");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_stock_location_id_fkey" FOREIGN KEY ("stock_location_id") REFERENCES "stock_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_supplier_fkey" FOREIGN KEY ("supplier") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_costumer_fkey" FOREIGN KEY ("costumer") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_batchsid_fkey" FOREIGN KEY ("batchsid") REFERENCES "batchs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders_items" ADD CONSTRAINT "final_product_fkey" FOREIGN KEY ("final_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders_items" ADD CONSTRAINT "production_orders_items_production_order_id_fkey" FOREIGN KEY ("production_order_id") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_steps_progress" ADD CONSTRAINT "production_steps_progress_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_steps_progress" ADD CONSTRAINT "production_steps_progress_production_id_fkey" FOREIGN KEY ("production_id") REFERENCES "production_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_steps_progress" ADD CONSTRAINT "production_steps_progress_raw_product_id_fkey" FOREIGN KEY ("raw_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_steps_progress" ADD CONSTRAINT "production_steps_progress_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "production_order_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocurrences_of_production_stages" ADD CONSTRAINT "ocurrences_of_production_stages_ocurrence_id_fkey" FOREIGN KEY ("ocurrence_id") REFERENCES "ocurrences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocurrences_of_production_stages" ADD CONSTRAINT "ocurrences_of_production_stages_stage_ocurred_id_fkey" FOREIGN KEY ("stage_ocurred_id") REFERENCES "production_steps_progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
