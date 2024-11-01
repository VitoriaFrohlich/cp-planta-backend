--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations VALUES ('ab9a8f58-3374-4e31-9ad3-eb2e1165c13c', '1e8d2e126bc71d48c70754acc63b30fafc330b2394097501a2bc2a6f7eaefb59', '2024-10-18 02:58:24.884603-03', '20241018055822_init', NULL, NULL, '2024-10-18 02:58:23.031053-03', 1);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories VALUES (1, 'Premium', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.categories VALUES (2, 'Importado', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.categories VALUES (3, 'Nacional', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.categories VALUES (4, 'Top Demais', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.categories VALUES (5, 'Promoção', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.groups VALUES (1, 'Batata', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (2, 'Tomate', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (3, 'Cebola', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (4, 'Couve', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (5, 'Melancia', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (6, 'Batata Branca', 1, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (7, 'Tomate Cereja', 2, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (8, 'Cebola Roxa', 3, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (9, 'Couve Mirim', 4, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.groups VALUES (10, 'Melancia Gigante', 5, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: persons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.persons VALUES (1, 'Pedro Cabral', 'SUPPLIER', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.persons VALUES (2, 'Machado Assis', 'SUPPLIER', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.persons VALUES (3, 'Clarice Lispector', 'SUPPLIER', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.persons VALUES (4, 'Sebastião Costa', 'SUPPLIER', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.persons VALUES (5, 'Produtor Rural', 'SUPPLIER', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.persons VALUES (6, 'Ecologia na Veia', 'SUPPLIER', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products VALUES (1, 'batata branca', 'CODE001', 'SKU001', 'RAW_MATERIAL', 'KG', 1, 1, 1, '{"fat": {"total": 8, "trans": 0, "saturated": 3}, "sodium": 150, "protein": 10, "calories": 200, "vitamins": {"iron": 10, "calcium": 30, "vitamin_a": 20, "vitamin_c": 15}, "carbohydrates": {"fiber": 5, "total": 30, "sugars": 12}}', 'https://images.app.goo.gl/DDnkSGBFhtAJ6LAF7', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (2, 'cenoura', 'CODE002', 'SKU015', 'RAW_MATERIAL', 'KG', 1, 1, 1, '{"fat": {"total": 8, "trans": 0, "saturated": 3}, "sodium": 150, "protein": 10, "calories": 200, "vitamins": {"iron": 10, "calcium": 30, "vitamin_a": 20, "vitamin_c": 15}, "carbohydrates": {"fiber": 5, "total": 30, "sugars": 12}}', 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (3, 'aipim', 'CODE003', 'SKU002', 'RAW_MATERIAL', 'KG', 1, 1, 1, '{"fat": {"total": 8, "trans": 0, "saturated": 3}, "sodium": 150, "protein": 10, "calories": 200, "vitamins": {"iron": 10, "calcium": 30, "vitamin_a": 20, "vitamin_c": 15}, "carbohydrates": {"fiber": 5, "total": 30, "sugars": 12}}', 'https://th.bing.com/th/id/OIP.iFm2DffdX5eMg2LjmcRovQHaEK?rs=1&pid=ImgDetMain', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (4, 'mirtilo', 'CODE004', 'SKU003', 'RAW_MATERIAL', 'KG', 1, 1, 1, '{"fat": {"total": 8, "trans": 0, "saturated": 3}, "sodium": 150, "protein": 10, "calories": 200, "vitamins": {"iron": 10, "calcium": 30, "vitamin_a": 20, "vitamin_c": 15}, "carbohydrates": {"fiber": 5, "total": 30, "sugars": 12}}', 'https://th.bing.com/th/id/R.185f438e71c11e0506d11e41566f22e4?rik=lHVWNPA5HwV8Sg&pid=ImgRaw&r=0', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (5, 'laranja', 'CODE005', 'SKU004', 'RAW_MATERIAL', 'KG', 1, 1, 1, '{"fat": {"total": 8, "trans": 0, "saturated": 3}, "sodium": 150, "protein": 10, "calories": 200, "vitamins": {"iron": 10, "calcium": 30, "vitamin_a": 20, "vitamin_c": 15}, "carbohydrates": {"fiber": 5, "total": 30, "sugars": 12}}', 'https://th.bing.com/th/id/OIP.0bFqMiCtpbitfhNSc3fd9gHaFj?rs=1&pid=ImgDetMain', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (6, 'couve', 'CODE006', 'SKU005', 'RAW_MATERIAL', 'KG', 1, 1, 1, '{"fat": {"total": 8, "trans": 0, "saturated": 3}, "sodium": 150, "protein": 10, "calories": 200, "vitamins": {"iron": 10, "calcium": 30, "vitamin_a": 20, "vitamin_c": 15}, "carbohydrates": {"fiber": 5, "total": 30, "sugars": 12}}', 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (7, 'uva', 'CODE007', 'SKU006', 'RAW_MATERIAL', 'KG', 1, 1, 1, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (8, 'Batata cubinhos', 'CODE016', 'SKU007', 'MADE', 'KG', 2, 2, 2, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (9, 'cenoura cubinhos', 'CODE008', 'SKU008', 'MADE', 'KG', 2, 2, 2, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (10, 'Mandioca descascada', 'CODE009', 'SKU009', 'MADE', 'KG', 2, 2, 2, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (11, 'mirtilos selecionados', 'CODE010', 'SKU010', 'MADE', 'KG', 2, 2, 2, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (12, 'laranja descascada', 'CODE011', 'SKU011', 'MADE', 'KG', 2, 2, 2, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (13, 'mix de verduras', 'CODE012', 'SKU012', 'MADE', 'KG', 2, 2, 2, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.products VALUES (14, 'suco natural de uva', 'CODE013', 'SKU013', 'MADE', 'KG', 2, 2, 2, NULL, 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: compositions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.compositions VALUES (1, 8, 'batata frita', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, NULL);
INSERT INTO public.compositions VALUES (2, 9, 'cenoura cubinhos', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, NULL);
INSERT INTO public.compositions VALUES (3, 10, 'aipim descascado', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, NULL);
INSERT INTO public.compositions VALUES (4, 11, 'mirtilos selecionados', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, NULL);
INSERT INTO public.compositions VALUES (5, 12, 'laranja fatiada', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, NULL);
INSERT INTO public.compositions VALUES (6, 13, 'mix de verduras', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, NULL);
INSERT INTO public.compositions VALUES (7, 14, 'suco natural de uva', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, NULL);


--
-- Data for Name: composition_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.composition_items VALUES (1, 1, 1, 1, 20, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.composition_items VALUES (2, 2, 1, 2, 20, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.composition_items VALUES (3, 3, 1, 3, 20, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.composition_items VALUES (4, 4, 1, 4, 20, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.composition_items VALUES (5, 5, 1, 5, 20, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.composition_items VALUES (6, 6, 1, 6, 20, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.composition_items VALUES (7, 7, 1, 7, 20, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: ocurrences; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ocurrences VALUES (1, 'Problema na Linha de Produção', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (2, 'Manutenção Necessária', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (3, 'Falha na Verificação de Qualidade', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (4, 'Novo Equipamento Instalado', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (5, 'Incidente de Segurança', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (6, 'Corpo estranho', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (7, 'Mau odor', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (8, 'Falta de energia', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (9, 'Defeito no equipamento', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (10, 'Impróprio para consumo', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (11, 'Não especificado', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences VALUES (12, 'Controle de qualidade', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: production_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.production_lines VALUES (1, 'Esteira 1', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_lines VALUES (2, 'Esteira 2', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_lines VALUES (3, 'Esteira 3', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_lines VALUES (4, 'Linha 4', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_lines VALUES (5, 'Linha 5', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: production_order_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.production_order_steps VALUES (1, 'Corte', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (2, 'Descascamento', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (3, 'Seleção', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (4, 'Desfolhamento', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (5, 'Embalagem', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (6, 'Seleção de Qualidade', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (7, 'Higienização', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (8, 'Lavagem', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (9, 'Seleção de Tamanho', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (10, 'Seleção de Cor', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (11, 'Seleção de Maturidade', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (12, 'Seleção de Peso', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (13, 'Seleção de Textura', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (14, 'Seleção de Sabor', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_order_steps VALUES (15, 'Seleção de Aroma', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: production_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.production_orders VALUES (1, 1, 'Production A', '2024-12-31 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, 'CREATED');
INSERT INTO public.production_orders VALUES (2, 2, 'Production B', '2024-12-15 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, 'SCHEDULED');
INSERT INTO public.production_orders VALUES (3, 3, 'Production C', '2024-12-31 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, 'IN_PROGRESS');
INSERT INTO public.production_orders VALUES (4, 4, 'Production D', '2024-12-15 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, 'SCHEDULED');
INSERT INTO public.production_orders VALUES (5, 5, 'Production E', '2024-12-31 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL, 'OPEN');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (10, 'root@gmail.com', '$2b$10$R6pcILCI6LhYW4wd3UjDNOjOD9Rg5nCxp4ZZmMUrfRD0UGb4rrViC', 'ROOT', 'root', 'CP', 'Planta', 'MALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.users VALUES (11, 'cassio@gmail.com', '$2b$10$R6pcILCI6LhYW4wd3UjDNOjOD9Rg5nCxp4ZZmMUrfRD0UGb4rrViC', 'ROOT', 'Cassio', 'Cassio', 'Santos', 'MALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.users VALUES (12, 'fulano@gmail.com', '$2b$10$R6pcILCI6LhYW4wd3UjDNOjOD9Rg5nCxp4ZZmMUrfRD0UGb4rrViC', 'DEMO', 'Roberto', 'Roberto', 'Da Silva', 'MALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.users VALUES (13, 'ana@gmail.com', '$2b$10$R6pcILCI6LhYW4wd3UjDNOjOD9Rg5nCxp4ZZmMUrfRD0UGb4rrViC', 'DEMO', 'Ana', 'Ana', 'Oliveira', 'FEMALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.users VALUES (14, 'maria@gmail.com', '$2b$10$R6pcILCI6LhYW4wd3UjDNOjOD9Rg5nCxp4ZZmMUrfRD0UGb4rrViC', 'DEMO', 'Maria', 'Maria', 'Silva', 'FEMALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: production_steps_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.production_steps_progress VALUES (1, 1, 1, 1, 10, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine A', 1, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (2, 1, 2, 2, 10, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine B', 1, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (3, 1, 3, 3, 10, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine C', 1, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (4, 1, 4, 4, 10, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine D', 1, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (5, 1, 5, 5, 10, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine E', 1, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (6, 1, 6, 6, 10, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine F', 1, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (7, 1, 1, 1, 10, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine A', 1, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (8, 1, 2, 2, 10, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine B', 1, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (9, 1, 3, 3, 10, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine C', 1, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (10, 1, 4, 4, 10, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine D', 1, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (11, 1, 5, 5, 10, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine E', 1, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (12, 1, 6, 6, 10, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine F', 1, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (13, 2, 1, 1, 11, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine A', 2, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (14, 2, 2, 2, 11, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine B', 2, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (15, 2, 3, 3, 11, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine C', 2, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (16, 2, 4, 4, 11, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine D', 2, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (17, 2, 5, 5, 11, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine E', 2, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (18, 2, 6, 6, 11, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine F', 2, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (19, 3, 1, 1, 12, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine A', 2, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (20, 3, 2, 2, 12, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine B', 2, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (21, 3, 3, 3, 12, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine C', 2, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (22, 3, 4, 4, 12, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine D', 2, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (23, 3, 5, 5, 12, '2024-09-01 08:00:00', '2024-09-01 10:00:00', 120, 1000, 950, 50, 'Machine E', 2, NULL, NULL, 'No issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_steps_progress VALUES (24, 3, 6, 6, 12, '2024-09-02 08:00:00', '2024-09-02 12:00:00', 240, 2000, 1900, 100, 'Machine F', 2, NULL, NULL, 'Minor issues', NULL, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: ocurrences_of_production_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ocurrences_of_production_stages VALUES (1, 1, 'Problema na Linha de Produção', 'Houve um problema na linha de produção que causou um atraso.', 'https://images.app.goo.gl/DDnkSGBFhtAJ6LAF7', NULL, 1, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences_of_production_stages VALUES (2, 2, 'Manutenção Necessária', 'Manutenção programada é necessária para o equipamento.', 'https://th.bing.com/th/id/R.185f438e71c11e0506d11e41566f22e4?rik=lHVWNPA5HwV8Sg&pid=ImgRaw&r=0', NULL, 2, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences_of_production_stages VALUES (3, 3, 'Falha na Verificação de Qualidade', 'A verificação de qualidade falhou para o lote #123.', 'https://images.app.goo.gl/xyXxbBfENNM2R1fM9', NULL, 3, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences_of_production_stages VALUES (4, 4, 'Novo Equipamento Instalado', 'Novo equipamento foi instalado na linha de produção.', 'https://th.bing.com/th/id/R.185f438e71c11e0506d11e41566f22e4?rik=lHVWNPA5HwV8Sg&pid=ImgRaw&r=0', NULL, 4, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.ocurrences_of_production_stages VALUES (5, 5, 'Incidente de Segurança', 'Ocorreu um incidente de segurança no armazém.', 'https://th.bing.com/th/id/OIP.iFm2DffdX5eMg2LjmcRovQHaEK?rs=1&pid=ImgDetMain', NULL, 5, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.prices VALUES (1, 1, 1, 'COST', false, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (2, 1, 1.5, 'COST', false, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (3, 1, 2, 'COST', false, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (4, 1, 3, 'COST', false, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (5, 1, 4, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (6, 2, 2, 'COST', false, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (7, 2, 10, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (8, 3, 13, 'COST', false, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (9, 3, 15, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (10, 4, 21, 'COST', false, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (11, 4, 20, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (12, 5, 18, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (13, 6, 14, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (14, 7, 11, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (15, 8, 7, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (16, 9, 9, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (17, 10, 8, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (18, 11, 12, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (19, 12, 3, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (20, 13, 4, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (21, 14, 5, 'COST', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (22, 8, 7, 'SALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (23, 9, 9, 'SALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (24, 10, 8, 'SALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (25, 11, 12, 'SALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (26, 12, 3, 'SALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (27, 13, 4, 'SALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.prices VALUES (28, 14, 5, 'SALE', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: production_orders_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.production_orders_items VALUES (1, 1, 1, 10, 1000, 950, 50, 'LoteTY123', '2024-12-31 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_orders_items VALUES (2, 2, 2, 11, 2000, 1900, 100, 'LoteER56', '2024-12-15 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_orders_items VALUES (3, 3, 3, 12, 1000, 950, 50, 'LoteOI123', '2024-12-31 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_orders_items VALUES (4, 4, 4, 13, 2000, 1900, 100, 'LoteB456', '2024-12-15 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.production_orders_items VALUES (5, 5, 5, 14, 2000, 1900, 100, 'LoteABC123', '2024-12-15 23:59:59', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.settings VALUES (3, 'enableNegativeStock', 'true', 'Serve para habilitar ou desabilitar o controle de estoque negativo', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');
INSERT INTO public.settings VALUES (4, 'defaultStockLocation', '1', 'Serve para definir o local de estoque padrão', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');
INSERT INTO public.settings VALUES (5, 'defaultRoleForNewUser', 'DEFAULT', 'Serve para definir o papel padrão para novos usuários', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');
INSERT INTO public.settings VALUES (6, 'defaultLoteInputMask', 'P', 'Define o padrão de máscara para lote de entrada', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');
INSERT INTO public.settings VALUES (7, 'defaultLoteOutputMask', 'PD', 'Define o padrão de máscara para lote de saída', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');
INSERT INTO public.settings VALUES (8, 'lastDocumentNumber', '3000', 'Serve para guardar o último número de documento criado para incrementar a partir dele', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');
INSERT INTO public.settings VALUES (9, 'lastLoteNumber', '1000', 'Serve para guardar o último número de lote criado para incrementar a partir dele', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');
INSERT INTO public.settings VALUES (10, 'loteNumberLength', '5', 'Define o tamanho do número do lote para preenchimento com zeros à esquerda (ex: 00001)', true, '2024-10-18 03:11:19.116716', 'root', '2024-10-18 03:11:19.116716', 'root');


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock VALUES (1, 'NFE123', '2024-09-01 09:00:00', 'INPUT', false, 'nota entrada', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock VALUES (2, 'OP124', '2024-09-02 10:00:00', 'INPUT', false, 'ordem de produção', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock VALUES (3, 'DOC123', '2024-09-01 09:00:00', 'OUTPUT', false, 'documento entrada', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock VALUES (4, 'NFE124', '2024-09-02 10:00:00', 'OUTPUT', false, 'documento saida', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock VALUES (5, '1001', '2024-09-02 10:00:00', 'RESERVED', false, 'reserva producao', '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock_location VALUES (1, 'Câmara Fria A', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_location VALUES (2, 'Depósito', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_location VALUES (3, 'Pátio', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_location VALUES (4, 'Câmara Fria B', true, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Data for Name: stock_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.stock_items VALUES (1, 1, 1, 1, 100, 10, 1000, 'LoteA123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (2, 1, 2, 2, 100, 10, 1000, 'LoteC123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (3, 1, 3, 3, 200, 20, 4000, 'LoteD456', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (4, 1, 4, 4, 100, 10, 1000, 'LoteE123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (5, 1, 5, 5, 100, 10, 1000, 'LoteF123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (6, 1, 6, 6, 200, 20, 4000, 'LoteG456', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (7, 1, 1, 7, 100, 10, 1000, 'LoteA123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (8, 1, 2, 8, 100, 10, 1000, 'LoteC123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (9, 3, 1, 1, 20, 10, 1000, 'LoteA123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (10, 3, 2, 2, 20, 10, 1000, 'LoteC123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (11, 3, 3, 3, 20, 20, 4000, 'LoteD456', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (12, 3, 4, 4, 10, 10, 1000, 'LoteE123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (13, 3, 5, 5, 10, 10, 1000, 'LoteF123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (14, 3, 6, 6, 20, 20, 4000, 'LoteG456', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (15, 3, 1, 7, 10, 10, 1000, 'LoteA123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (16, 3, 2, 8, 10, 10, 1000, 'LoteC123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (17, 2, 1, 9, 100, 10, 1000, 'LoteKK123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (18, 2, 2, 10, 100, 10, 1000, 'LoteTY123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (19, 2, 3, 11, 200, 20, 4000, 'LoteER56', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (20, 2, 4, 12, 100, 10, 1000, 'LoteOI123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (21, 2, 5, 13, 100, 10, 1000, 'LoteABC123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (22, 2, 6, 14, 200, 20, 4000, 'LoteWW456', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (23, 4, 1, 9, 10, 10, 1000, 'LoteKK123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (24, 4, 2, 10, 10, 10, 1000, 'LoteTY123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (25, 4, 3, 11, 20, 20, 4000, 'LoteER56', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (26, 4, 4, 12, 10, 10, 1000, 'LoteOI123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (27, 4, 5, 13, 10, 10, 1000, 'LoteABC123', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (28, 4, 6, 14, 20, 20, 4000, 'LoteWW456', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (29, 5, 5, 13, 10, 10, 1000, 'LOTE-TESTE', '2024-12-31 23:59:59', NULL, NULL, NULL, NULL, 1, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);
INSERT INTO public.stock_items VALUES (30, 5, 6, 14, 20, 20, 4000, 'LOTE-TESTE', '2024-12-15 23:59:59', NULL, NULL, NULL, NULL, 3, NULL, '2024-10-18 03:09:25.922412', '2024-10-18 03:09:25.922412', NULL, NULL);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


--
-- Name: composition_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.composition_items_id_seq', 7, true);


--
-- Name: compositions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compositions_id_seq', 7, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 10, true);


--
-- Name: ocurrences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ocurrences_id_seq', 12, true);


--
-- Name: ocurrences_of_production_stages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ocurrences_of_production_stages_id_seq', 5, true);


--
-- Name: persons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.persons_id_seq', 6, true);


--
-- Name: prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prices_id_seq', 28, true);


--
-- Name: production_lines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_lines_id_seq', 5, true);


--
-- Name: production_order_steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_order_steps_id_seq', 15, true);


--
-- Name: production_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_orders_id_seq', 5, true);


--
-- Name: production_orders_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_orders_items_id_seq', 5, true);


--
-- Name: production_steps_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.production_steps_progress_id_seq', 24, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 14, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 10, true);


--
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_id_seq', 5, true);


--
-- Name: stock_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_items_id_seq', 30, true);


--
-- Name: stock_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_location_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- PostgreSQL database dump complete
--

