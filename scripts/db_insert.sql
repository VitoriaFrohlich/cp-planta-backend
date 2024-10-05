INSERT INTO "users" ("username", "email", "password", "first_name", "last_name", "user_type", "gender")
VALUES 
	('Cassio', 'cassio@gmail.com', 'cassio', 'Cassio', 'Santos', 'PUBLIC', 'MALE'),
    ('fulano', 'fulano@gmail.com', 'fulano', 'Fulano', 'De Tals', 'PUBLIC', 'MALE'),
    ('kieroff', 'kieroff@gmail.com', 'abracadabra', 'Rodrigo', 'Oliveira', 'PUBLIC', 'MALE'),
    ('Maria', 'maria@gmail.com', 'maria', 'Maria', 'Silva', 'PUBLIC', 'FEMALE');
	
-- Insert into groups
INSERT INTO "groups" ("description", "father_id" )
VALUES 
    ('Batata', Null),
	('Tomate', Null),
	('Cebola', Null),
	('Couve', Null),
    ('Melancia', Null),
	('Batata Branca',1),
	('Tomate Cereja',2),
	('Cebola Roxa',3),
	('Couve Mirim',4),
    ('Melancia Gigante',5);
	
-- Insert into categories
INSERT INTO "categories" ("description")
VALUES 
    ('Premium'),
    ('Importado'),
    ('Nacional'),
    ('Top Demais'),
    ('Promoção');
	
-- Insert into customers
INSERT INTO "customers" ("name")
VALUES 
    ('Pedro Cabral'),
    ('Machado Assis'),
    ('Clarice Lispector'),
    ('Sebastião Costa'),	
    ('Produtor Rural'),
    ('Ecologia na Veia');
	
-- Insert into suppliers
INSERT INTO "suppliers" ("name")
VALUES 
    ('Fazendinha'),
    ('Feira de Acari'),
    ('Produtor X'),
    ('Fulaninho da Feira'),	
    ('Produtor Rural'),
    ('Eco-Produtor');
	
-- Insert into stock_location
INSERT INTO "stock_location" ("description")
VALUES 
    ('Câmara Fria A'),
    ('Depósito'),
    ('Pátio'),
    ('Câmara Fria B');
	
-- Insert into ocurrences
INSERT INTO "ocurrences" ("description")
VALUES 
    ('CORPO ESTRANHO'),
    ('MAU CHEIRO'),
    ('FALTA DE ENERGIA'),
    ('DEFEITO EQUIPAMENTO'),
    ('RISCO BIOLÓGICO'),
    ('IMPRÓPRIO PARA CONSUMO'),
    ('FORA DA ESPECIFICAÇÃO'),
    ('CONTROLE DE QUALIDADE');

-- Insert into products
INSERT INTO "products" ("description", "code", "sku", "origin", "unit_measure","category_id", "group_id", "supplier_id", "nutritional_info")
VALUES 
('batata branca', 'CODE001', 'SKU001', 'RAW_MATERIAL', 'KG',1, 1, 1, 'cada 100g desse produto contém xyz'),
('cenoura', 'CODE002', 'SKU015', 'RAW_MATERIAL', 'KG',1, 1, 1, 'cada 100g desse produto contém xyz'),
('aipim', 'CODE003', 'SKU002', 'RAW_MATERIAL', 'KG',1, 1, 1, 'cada 100g desse produto contém xyz'),
('mirtilo', 'CODE004', 'SKU003', 'RAW_MATERIAL', 'KG',1, 1, 1, 'cada 100g desse produto contém xyz'),
('laranja', 'CODE005', 'SKU004', 'RAW_MATERIAL', 'KG',1, 1, 1, 'cada 100g desse produto contém xyz'),
('couve', 'CODE006', 'SKU005', 'RAW_MATERIAL', 'KG',1, 1, 1, 'cada 100g desse produto contém xyz'),
('uva', 'CODE007', 'SKU006', 'RAW_MATERIAL', 'KG',1, 1, 1, 'cada 100g desse produto contém xyz'),
('batata frita', 'CODE016', 'SKU007', 'MADE', 'KG',2, 2, 2, 'cada 100g desse produto contém xyz'),
('cenoura cubinhos', 'CODE008', 'SKU008', 'MADE', 'KG',2, 2, 2, 'cada 100g desse produto contém xyz'),
('aipim descascado', 'CODE009', 'SKU009', 'MADE', 'KG',2, 2, 2, 'cada 100g desse produto contém xyz'),
('mirtilos selecionados', 'CODE010', 'SKU010', 'MADE', 'KG',2, 2, 2, 'cada 100g desse produto contém xyz'),
('laranja fatiada', 'CODE011', 'SKU011', 'MADE', 'KG',2, 2, 2, 'cada 100g desse produto contém xyz'),
('mix de verduras', 'CODE012', 'SKU012', 'MADE', 'KG',2, 2, 2, 'cada 100g desse produto contém xyz'),
('suco natural de uva', 'CODE013', 'SKU013', 'MADE', 'KG',2, 2, 2, 'cada 100g desse produto contém xyz');	

-- Insert into compositions
INSERT INTO "compositions" ("product_id", "description")
VALUES 
(8,'batata frita'),
(9,'cenoura cubinhos'),
(10,'aipim descascado'),
(11,'mirtilos selecionados'),
(12,'laranja fatiada'),
(13,'mix de verduras'),
(14,'suco natural de uva');	


-- Insert into prices
INSERT INTO "prices" ("product_id", "price", "type", "is_current")
VALUES 
    (1, 1.0, 'COST',FALSE),
    (1, 1.5, 'COST',FALSE),
    (1, 2.0, 'COST',FALSE),
    (1, 3.0, 'COST',FALSE),
    (1, 4.0, 'COST',TRUE),
    (2, 2.0, 'COST',FALSE),
    (2, 10.0, 'COST',TRUE),
    (3, 13.0, 'COST',FALSE),
    (3, 15.0, 'COST',TRUE),
    (4, 21.0, 'COST',FALSE),
    (4, 20.0, 'COST',TRUE),
    (5, 18.0, 'COST',TRUE),
    (6, 14.0, 'COST',TRUE),
    (7, 11.0, 'COST',TRUE),
    (8, 7.0, 'COST',TRUE),	 
    (9, 9.0, 'COST',TRUE),
    (10, 8.0, 'COST',TRUE),
    (11, 12.0, 'COST',TRUE),
    (12, 3.0, 'COST',TRUE),
    (13, 4.0, 'COST',TRUE),
    (14, 5.0, 'COST',TRUE),
    (8, 7.0,'SALE',TRUE),
    (9, 9.0,'SALE',TRUE),
    (10, 8.0,'SALE',TRUE),
    (11, 12.0,'SALE',TRUE),
    (12, 3.0,'SALE',TRUE),
    (13, 4.0,'SALE',TRUE),
    (14, 5.0,'SALE',TRUE);



-- Insert into stock
INSERT INTO "stock" ("document_number", "document_date", "stock_moviment")
VALUES 
    ('NFE123', '2024-09-01 09:00:00', 'INPUT'),
    ('OP124', '2024-09-02 10:00:00', 'INPUT'),
    ('DOC123', '2024-09-01 09:00:00', 'OUTPUT'),
    ('NFE124', '2024-09-02 10:00:00', 'OUTPUT');


-- Insert into stock_items
INSERT INTO "stock_items" ("stock_id", "sequence", "product_id", "quantity", "unit_price", "total_price", "lote", "expiration", "stock_location_id")
VALUES 
	(1, 1, 1, 100.0, 10.0, 1000.0, 'LoteA123', '2024-12-31 23:59:59', 1),
    (1, 2, 2, 100.0, 10.0, 1000.0, 'LoteC123', '2024-12-31 23:59:59', 1),
    (1, 3, 3, 200.0, 20.0, 4000.0, 'LoteD456', '2024-12-15 23:59:59', 3),
	(1, 4, 4, 100.0, 10.0, 1000.0, 'LoteE123', '2024-12-31 23:59:59', 1),
    (1, 5, 5, 100.0, 10.0, 1000.0, 'LoteF123', '2024-12-31 23:59:59', 1),
    (1, 6, 6, 200.0, 20.0, 4000.0, 'LoteG456', '2024-12-15 23:59:59', 3),
	(1, 1, 7, 100.0, 10.0, 1000.0, 'LoteA123', '2024-12-31 23:59:59', 1),
    (1, 2, 8, 100.0, 10.0, 1000.0, 'LoteC123', '2024-12-31 23:59:59', 1),
	(3, 1, 1, 20.0, 10.0, 1000.0, 'LoteA123', '2024-12-31 23:59:59', 1),
    (3, 2, 2, 20.0, 10.0, 1000.0, 'LoteC123', '2024-12-31 23:59:59', 1),
    (3, 3, 3, 20.0, 20.0, 4000.0, 'LoteD456', '2024-12-15 23:59:59', 3),
	(3, 4, 4, 10.0, 10.0, 1000.0, 'LoteE123', '2024-12-31 23:59:59', 1),
    (3, 5, 5, 10.0, 10.0, 1000.0, 'LoteF123', '2024-12-31 23:59:59', 1),
    (3, 6, 6, 20.0, 20.0, 4000.0, 'LoteG456', '2024-12-15 23:59:59', 3),
	(3, 1, 7, 10.0, 10.0, 1000.0, 'LoteA123', '2024-12-31 23:59:59', 1),
    (3, 2, 8, 10.0, 10.0, 1000.0, 'LoteC123', '2024-12-31 23:59:59', 1),
	(2, 1, 9, 100.0, 10.0, 1000.0, 'LoteKK123', '2024-12-31 23:59:59', 1),
    (2, 2, 10, 100.0, 10.0, 1000.0, 'LoteTY123', '2024-12-31 23:59:59', 1),
    (2, 3, 11, 200.0, 20.0, 4000.0, 'LoteER56', '2024-12-15 23:59:59', 3),
	(2, 4, 12, 100.0, 10.0, 1000.0, 'LoteOI123', '2024-12-31 23:59:59', 1),
    (2, 5, 13, 100.0, 10.0, 1000.0, 'LoteABC123', '2024-12-31 23:59:59', 1),
    (2, 6, 14, 200.0, 20.0, 4000.0, 'LoteWW456', '2024-12-15 23:59:59', 3),
	(4, 1, 9, 10.0, 10.0, 1000.0, 'LoteKK123', '2024-12-31 23:59:59', 1),
    (4, 2, 10, 10.0, 10.0, 1000.0, 'LoteTY123', '2024-12-31 23:59:59', 1),
    (4, 3, 11, 20.0, 20.0, 4000.0, 'LoteER56', '2024-12-15 23:59:59', 3),
	(4, 4, 12, 10.0, 10.0, 1000.0, 'LoteOI123', '2024-12-31 23:59:59', 1),
    (4, 5, 13, 10.0, 10.0, 1000.0, 'LoteABC123', '2024-12-31 23:59:59', 1),
    (4, 6, 14, 20.0, 20.0, 4000.0, 'LoteWW456', '2024-12-15 23:59:59', 3);
	
	
-- Insert into production_steps
INSERT INTO "production_steps" ("description")
VALUES 
    ('SEPARAÇÃO'),
    ('SELEÇÃO'),
    ('LAVAGEM'),
    ('HIGIENIZAÇÃO'),
    ('CORTE'),
    ('FATIAMENTO'),
    ('EMPACOTAMENTO'),
    ('INSPEÇÃO DE QUALIDADE'),
    ('LIMPEZA'),
    ('TRITURAÇÃO'),
    ('MOAGEM'),
    ('FRITURA'),
    ('AQUECIMENTO');

-- Insert into production
INSERT INTO "production" ("description","final_product","prodution_quantity_estimated", "production_quantity_real", "lote", "expiration", "Production_Status")
VALUES 
    ('Production A', 10,1000.0, 950.0, 'LoteTY123', '2024-12-31 23:59:59', 'CREATED'),
    ('Production B', 11,2000.0, 1900.0, 'LoteER56', '2024-12-15 23:59:59','SCHEDULED'),
    ('Production C', 12,1000.0, 950.0, 'LoteOI123', '2024-12-31 23:59:59', 'IN_PROGRESS'),
    ('Production D', 13,2000.0, 1900.0, 'LoteB456', '2024-12-15 23:59:59','SCHEDULED'),
    ('Production E', 14,1000.0, 950.0, 'LoteABC123', '2024-12-31 23:59:59', 'OPEN');


-- Insert into production_work
INSERT INTO "production_work" ("production_id", "step_id", "raw_product_id", "sequence", "start_time", "end_time", "total_time", "initial_weight", "final_weight", "weight_loss", "machine", "observation")
VALUES 
    (1, 1, 10, 1, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine A', 'No issues'),
    (1, 2, 10, 2, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine B', 'Minor issues'),
    (1, 3, 10, 3, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine C', 'No issues'),
    (1, 4, 10, 4, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine D', 'Minor issues'),
    (1, 5, 10, 5, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine E', 'No issues'),
    (1, 6, 10, 6, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine F', 'Minor issues'),
    (1, 1, 10, 1, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine A', 'No issues'),
    (1, 2, 10, 2, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine B', 'Minor issues'),
    (1, 3, 10, 3, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine C', 'No issues'),
    (1, 4, 10, 4, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine D', 'Minor issues'),
    (1, 5, 10, 5, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine E', 'No issues'),
    (1, 6, 10, 6, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine F', 'Minor issues'),
    (2, 1, 11, 1, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine A', 'No issues'),
    (2, 2, 11, 2, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine B', 'Minor issues'),
    (2, 3, 11, 3, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine C', 'No issues'),
    (2, 4, 11, 4, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine D', 'Minor issues'),
    (2, 5, 11, 5, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine E', 'No issues'),
    (2, 6, 11, 6, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine F', 'Minor issues'),	
    (3, 1, 12, 1, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine A', 'No issues'),
    (3, 2, 12, 2, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine B', 'Minor issues'),
    (3, 3, 12, 3, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine C', 'No issues'),
    (3, 4, 12, 4, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine D', 'Minor issues'),
    (3, 5, 12, 5, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120.0, 1000.0, 950.0, 50.0, 'Machine E', 'No issues'),
    (3, 6, 12, 6, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240.0, 2000.0, 1900.0, 100.0, 'Machine F', 'Minor issues');
