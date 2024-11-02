/* eslint-disable @typescript-eslint/no-unused-vars */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum Role {
  DEFAULT = 'DEFAULT',
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  DEMO = 'DEMO',
  API = 'API',
  SYSTEM = 'SYSTEM'
}

export enum Person_Type {
  COSTUMER = 'COSTUMER',
  SUPPLIER = 'SUPPLIER'
}

export enum Origin {
  RAW_MATERIAL = 'RAW_MATERIAL',
  MADE = 'MADE'
}

export enum Price_Type {
  COST = 'COST',
  SALE = 'SALE'
}

export enum Production_Status {
  CREATED = 'CREATED',
  SCHEDULED = 'SCHEDULED',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  STOPPED = 'STOPPED',
  CANCELED = 'CANCELED'
}

export enum Stock_Moviment {
  INPUT = 'INPUT',
  TRANSIT = 'TRANSIT',
  OUTPUT = 'OUTPUT',
  RESERVED = 'RESERVED',
  BALANCE = 'BALANCE',
  ADJUST = 'ADJUST',
  INVENTORY = 'INVENTORY'
}

export enum Unit_Measure {
  UN = 'UN',
  KG = 'KG',
  L = 'L',
  GR = 'GR',
  ML = 'ML',
  PC = 'PC'
}

export enum Batch_Status {
  PENDING = 'PENDING',
  USED = 'USED',
  CANCELED = 'CANCELED'
}

export enum Owner {
  PRODUCT = 'PRODUCT',
  PRODUCTION_STEP = 'PRODUCTION_STEP',
  STOCK_ITEM = 'STOCK_ITEM',
  OCURRENCE = 'OCURRENCE'
}
