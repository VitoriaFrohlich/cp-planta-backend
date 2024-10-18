export const Settings = {
  enableNegativeStock: false, // serve para habilitar ou desabilitar o controle de estoque negativo
  defaultStockLocation: 1, // serve para definir o local de estoque padrão
  defaultRoleForNewUser: 'DEFAULT', // serve para definir o papel padrão para novos usuários
  defaultLoteInputMask: 'P', // serve para máscara - define o padrão de máscara para lote de entrada
  defaultLoteOutputMask: 'PD', // serve para máscara - define o padrão de máscara para lote de saída
  lastDocumentNumber: 3000, //serve para guardar o último número de documento criado para incrementar a partir dele
  lastLoteNumber: 1000, //serve para guardar o último número de lote criado para incrementar a partir dele
  loteNumberLength: 5 // serve para máscara - define o tamanho do número do lote p/ preenchimento com zeros à esquerda (ex: 00001)
};
