-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROOT', 'ADMIN', 'PUBLIC', 'ERP', 'API', 'SYSTEM', 'ANONYMOUS');

-- CreateEnum
CREATE TYPE "Person_Type" AS ENUM ('COSTUMER', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('RAW_MATERIAL', 'MADE');

-- CreateEnum
CREATE TYPE "Price_Type" AS ENUM ('COST', 'SALE');

-- CreateEnum
CREATE TYPE "Production_Status" AS ENUM ('CREATED', 'SCHEDULED', 'OPEN', 'IN_PROGRESS', 'FINISHED', 'STOPPED', 'CANCELED');

-- CreateEnum
CREATE TYPE "Stock_Moviment" AS ENUM ('INPUT', 'TRANSIT', 'OUTPUT');

-- CreateEnum
CREATE TYPE "Unit_Measure" AS ENUM ('UN', 'KG', 'L', 'GR', 'ML', 'PC');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'PUBLIC',
    "gender" "Gender" DEFAULT 'OTHER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composition_items" (
    "id" SERIAL NOT NULL,
    "composition_id" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "composition_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compositions" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "production_steps" JSON,

    CONSTRAINT "compositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "father_id" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocurrences" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "Price_Type" NOT NULL DEFAULT 'COST',
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "prodution_quantity_estimated" DOUBLE PRECISION NOT NULL,
    "production_quantity_real" DOUBLE PRECISION NOT NULL,
    "lote" VARCHAR(255),
    "expiration" TIMESTAMP(3),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Production_Status" "Production_Status" NOT NULL DEFAULT 'CREATED',
    "final_product" INTEGER NOT NULL,

    CONSTRAINT "production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_steps" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_work" (
    "id" SERIAL NOT NULL,
    "production_id" INTEGER NOT NULL,
    "step_id" INTEGER NOT NULL,
    "raw_product_id" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "total_time" DOUBLE PRECISION,
    "initial_weight" DOUBLE PRECISION,
    "final_weight" DOUBLE PRECISION,
    "weight_loss" DOUBLE PRECISION,
    "machine" TEXT,
    "photo" BYTEA[],
    "observation" TEXT,
    "ocurrences" JSON,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_item" (
    "id" SERIAL NOT NULL,
    "production_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(255) NOT NULL,
    "origin" "Origin" NOT NULL DEFAULT 'RAW_MATERIAL',
    "unit_measure" "Unit_Measure" NOT NULL DEFAULT 'UN',
    "category_id" INTEGER NOT NULL DEFAULT 1,
    "group_id" INTEGER NOT NULL DEFAULT 1,
    "supplier_id" INTEGER,
    "nutritional_info" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" SERIAL NOT NULL,
    "document_number" VARCHAR(255) NOT NULL,
    "document_date" TIMESTAMP(6) NOT NULL,
    "stock_moviment" "Stock_Moviment" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
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
    "persons" INTEGER,
    "costumers" INTEGER,
    "stock_location_id" INTEGER NOT NULL,
    "observation" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_location" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "Person_Type" NOT NULL DEFAULT 'SUPPLIER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_description_key" ON "categories"("description");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- AddForeignKey
ALTER TABLE "composition_items" ADD CONSTRAINT "composition_items_composition_id_fkey" FOREIGN KEY ("composition_id") REFERENCES "compositions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composition_items" ADD CONSTRAINT "composition_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compositions" ADD CONSTRAINT "compositions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production" ADD CONSTRAINT "final_product_fkey" FOREIGN KEY ("final_product") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_work" ADD CONSTRAINT "production_work_production_id_fkey" FOREIGN KEY ("production_id") REFERENCES "production"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_work" ADD CONSTRAINT "production_work_raw_product_id_fkey" FOREIGN KEY ("raw_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_work" ADD CONSTRAINT "production_work_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "production_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_item" ADD CONSTRAINT "production_item_production_id_fkey" FOREIGN KEY ("production_id") REFERENCES "production"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_item" ADD CONSTRAINT "production_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_costumers_fkey" FOREIGN KEY ("costumers") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_stock_location_id_fkey" FOREIGN KEY ("stock_location_id") REFERENCES "stock_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_items" ADD CONSTRAINT "stock_items_persons_fkey" FOREIGN KEY ("persons") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
