BEGIN;

-- Очистка (порядок: сначала таблицы с FK, затем справочники)
DELETE FROM public.parking_sessions;
DELETE FROM public.bookings;
DELETE FROM public.vehicles;
DELETE FROM public.parking_slots;
DELETE FROM public.sectors;
DELETE FROM public.parkings;
DELETE FROM public.clients;
DELETE FROM public.booking_types;
DELETE FROM public.booking_statuses;
DELETE FROM public.parking_session_statuses;
DELETE FROM public.explotation_statuses;

-- explotation_statuses (Enum: Статус эксплуатации — conceptual-model-with-attributes.md)
INSERT INTO public.explotation_statuses (id, status) VALUES
  (1, 'в эксплуатации'),
  (2, 'закрыт на обслуживание'),
  (3, 'выведен из эксплуатации'),
  (4, 'планируется к вводу');

-- booking_statuses (Enum: Статус бронирования)
INSERT INTO public.booking_statuses (id, status) VALUES
  (1, 'черновик'),
  (2, 'ожидает оплаты'),
  (3, 'подтверждено'),
  (4, 'активно'),
  (5, 'завершено'),
  (6, 'отменено'),
  (7, 'просрочено');

-- parking_session_statuses (Enum: Статус парковочной сессии)
INSERT INTO public.parking_session_statuses (id, status) VALUES
  (1, 'активна'),
  (2, 'завершена');

-- booking_types
INSERT INTO public.booking_types (id, type) VALUES
  (1, 'автоматическое'),
  (2, 'краткосрочное'),
  (3, 'долгосрочное'),
  (4, 'гостевое'),
  (5, 'корпоративное'),
  (6, 'ночное'),
  (7, 'абонементное'),
  (8, 'почасовое расширенное'),
  (9, 'тестовое'),
  (10, 'сезонное'),
  (11, 'льготное'),
  (12, 'служебное');

-- clients
INSERT INTO public.clients (id, surname, name, patronymic, phone_number, email, password_hash) VALUES
  (1, 'Иванов', 'Алексей', 'Петрович', '+79001001001', 'client01@example-parking.local', '$2a$10$abcdefghijklmnopqrstuvwxyz0123456789012345678901234567890ab'),
  (2, 'Петрова', 'Мария', 'Сергеевна', '+79001001002', 'client02@example-parking.local', '$2a$10$bcdefghijklmnopqrstuvwxyz0123456789012345678901234567890abc'),
  (3, 'Сидоров', 'Дмитрий', 'Андреевич', '+79001001003', 'client03@example-parking.local', '$2a$10$cdefghijklmnopqrstuvwxyz0123456789012345678901234567890abcd'),
  (4, 'Козлова', 'Елена', 'Игоревна', '+79001001004', 'client04@example-parking.local', '$2a$10$defghijklmnopqrstuvwxyz0123456789012345678901234567890abcde'),
  (5, 'Николаев', 'Игорь', 'Викторович', '+79001001005', 'client05@example-parking.local', '$2a$10$efghijklmnopqrstuvwxyz0123456789012345678901234567890abcdef'),
  (6, 'Орлова', 'Ольга', 'Павловна', '+79001001006', 'client06@example-parking.local', '$2a$10$fghijklmnopqrstuvwxyz0123456789012345678901234567890abcdefg'),
  (7, 'Смирнов', 'Павел', 'Николаевич', '+79001001007', 'client07@example-parking.local', '$2a$10$ghijklmnopqrstuvwxyz0123456789012345678901234567890abcdefgh'),
  (8, 'Волкова', 'Анна', 'Денисовна', '+79001001008', 'client08@example-parking.local', '$2a$10$hijklmnopqrstuvwxyz0123456789012345678901234567890abcdefghi'),
  (9, 'Федоров', 'Сергей', 'Олегович', '+79001001009', 'client09@example-parking.local', '$2a$10$ijklmnopqrstuvwxyz0123456789012345678901234567890abcdefghij'),
  (10, 'Морозова', 'Татьяна', 'Романовна', '+79001001010', 'client10@example-parking.local', '$2a$10$jklmnopqrstuvwxyz0123456789012345678901234567890abcdefghijk'),
  (11, 'Лебедев', 'Роман', 'Максимович', '+79001001011', 'client11@example-parking.local', '$2a$10$klmnopqrstuvwxyz0123456789012345678901234567890abcdefghijkl'),
  (12, 'Соколова', 'Виктория', 'Артемовна', '+79001001012', 'client12@example-parking.local', '$2a$10$lmnopqrstuvwxyz0123456789012345678901234567890abcdefghijklm');

-- parkings (одна парковка — Санкт-Петербург)
INSERT INTO public.parkings (id, parking_name, adress, parking_type_id, description, explotation_status_id) VALUES
  (
    1,
    'Многоуровневая парковка ТРК «Московские ворота»',
    'г. Санкт-Петербург, Московский проспект, д. 186, лит. А',
    2,
    'Крытая и открытая зоны, въезд с Московского проспекта и со служебного проезда; около 900 машиномест, навигация по уровням P1–P3.',
    1
  );

-- sectors (все секторы — на этой парковке, id парковки = 1)
INSERT INTO public.sectors (id, parking_id, sector_name, zone_type_id, explotation_status_id) VALUES
  (1, 1, 'Уровень P1 — краткосрочная зона', 1, 1),
  (2, 1, 'Уровень P1 — долгосрочное хранение', 2, 1),
  (3, 1, 'Уровень P2 — стандарт', 3, 1),
  (4, 1, 'Уровень P2 — премиум', 4, 2),
  (5, 1, 'Периметр — зона B', 5, 2),
  (6, 1, 'Express до 15 минут', 6, 1),
  (7, 1, 'Гостевая зона', 7, 4),
  (8, 1, 'Корпоративный пул', 8, 1),
  (9, 1, 'Зона повышенного спроса (события)', 9, 2),
  (10, 1, 'Транзит A', 10, 1),
  (11, 1, 'Крытая — ряд у въезда', 11, 3),
  (12, 1, 'Служебная / логистика', 12, 2);

-- parking_slots
INSERT INTO public.parking_slots (id, sector_id, parking_slot_number, is_booked, is_locked, explotation_status_id) VALUES
  (1, 1, 'A-001', true, false, 1),
  (2, 1, 'A-002', false, false, 1),
  (3, 1, 'A-003', false, true, 2),
  (4, 2, 'B-010', true, false, 1),
  (5, 2, 'B-011', false, false, 1),
  (6, 3, 'M1-045', false, false, 1),
  (7, 3, 'M1-046', true, false, 1),
  (8, 4, 'M2-101', false, false, 2),
  (9, 5, 'W-12', false, false, 2),
  (10, 6, 'EX-03', true, false, 1),
  (11, 7, 'G-07', false, false, 4),
  (12, 8, 'C-210', false, false, 1);

-- vehicles
INSERT INTO public.vehicles (id, client_id, vehicle_type_id, license_plate, brand, model, color) VALUES
  (1, 1, 1, 'A001AA77', 'Toyota', 'Camry', 'серебристый'),
  (2, 2, 2, 'B702KH99', 'Honda', 'CB650R', 'красный'),
  (3, 3, 1, 'C333CC77', 'Kia', 'Sportage', 'белый'),
  (4, 4, 1, 'E555EE152', 'Volkswagen', 'Tiguan', 'синий'),
  (5, 5, 3, 'H777HK77', 'GAZ', 'Газель NEXT', 'белый'),
  (6, 6, 1, 'K008XX199', 'Mazda', 'CX-5', 'черный'),
  (7, 7, 2, 'M404MM77', 'Yamaha', 'MT-07', 'матовый серый'),
  (8, 8, 1, 'O900OO50', 'Skoda', 'Octavia', 'зеленый'),
  (9, 9, 1, 'P111PP77', 'Nissan', 'Qashqai', 'оранжевый'),
  (10, 10, 1, 'T222TT98', 'Hyundai', 'Solaris', 'бежевый'),
  (11, 11, 4, 'U333UU77', 'Ford', 'Transit', 'серый'),
  (12, 12, 1, 'X777XX77', 'Chery', 'Tiggo 8', 'белый');

-- bookings
INSERT INTO public.bookings (id, vehicle_id, parking_slot_id, booking_number, start_time, end_time, booking_type_id, booking_status_id, cost) VALUES
  (1, 1, 1, 'BK-2024-00001', '2024-02-14 09:00:00', '2024-02-14 17:30:00', 2, 5, 850),
  (2, 2, 4, 'BK-2024-00088', '2024-05-03 11:15:00', '2024-05-03 14:45:00', 2, 5, 420),
  (3, 3, 6, 'BK-2024-00120', '2024-07-19 08:00:00', '2024-07-21 20:00:00', 3, 4, 5400),
  (4, 4, 2, 'BK-2024-00201', '2024-09-10 07:45:00', '2024-09-10 19:00:00', 1, 3, 1200),
  (5, 5, 9, 'BK-2024-00340', '2024-11-02 06:30:00', '2024-11-02 22:00:00', 5, 5, 3100),
  (6, 6, 7, 'BK-2025-00007', '2025-01-18 10:00:00', '2025-01-18 18:00:00', 2, 6, 0),
  (7, 7, 10, 'BK-2025-00044', '2025-03-07 12:00:00', '2025-03-07 15:30:00', 2, 5, 680),
  (8, 8, 8, 'BK-2025-00102', '2025-04-22 09:30:00', '2025-04-25 09:30:00', 3, 4, 7200),
  (9, 9, 3, 'BK-2025-00190', '2025-06-11 16:00:00', '2025-06-11 23:59:00', 6, 5, 950),
  (10, 10, 11, 'BK-2025-00255', '2025-08-30 14:20:00', '2025-08-30 21:40:00', 7, 4, 1500),
  (11, 11, 5, 'BK-2025-00301', '2025-10-14 07:00:00', '2025-10-14 19:30:00', 8, 3, 2200),
  (12, 12, 12, 'BK-2026-00012', '2026-01-09 08:15:00', '2026-01-09 17:45:00', 2, 5, 990);

-- parking_sessions
INSERT INTO public.parking_sessions (id, parking_session_number, booking_id, start_time, end_time, parking_session_status_id) VALUES
  (1, 'PS-2024-10001', 1, '2024-02-14 09:10:00', '2024-02-14 17:20:00', 2),
  (2, 'PS-2024-10088', 2, '2024-05-03 11:20:00', '2024-05-03 14:30:00', 2),
  (3, 'PS-2024-10120', 3, '2024-07-19 08:05:00', '2024-07-21 19:45:00', 2),
  (4, 'PS-2024-10201', 4, '2024-09-10 07:50:00', '2024-09-10 18:40:00', 2),
  (5, 'PS-2024-10340', 5, '2024-11-02 06:45:00', '2024-11-02 21:30:00', 2),
  (6, 'PS-2025-10007', 6, '2025-01-18 10:05:00', '2025-01-18 17:50:00', 2),
  (7, 'PS-2025-10044', 7, '2025-03-07 12:10:00', '2025-03-07 15:20:00', 2),
  (8, 'PS-2025-10102', 8, '2025-04-22 09:45:00', '2025-04-24 18:00:00', 1),
  (9, 'PS-2025-10190', 9, '2025-06-11 16:10:00', '2025-06-11 23:45:00', 2),
  (10, 'PS-2025-10255', 10, '2025-08-30 14:35:00', '2025-08-30 20:10:00', 1),
  (11, 'PS-2025-10301', 11, '2025-10-14 07:15:00', '2025-10-14 19:10:00', 2),
  (12, 'PS-2026-10012', 12, '2026-01-09 08:30:00', '2026-01-09 17:30:00', 2);

-- В DDL идентификаторы BIGINT без SERIAL/DEFAULT; последовательности не созданы — setval не применяется.

COMMIT;
