CREATE TABLE "bookings"(
    "id" BIGINT NOT NULL,
    "vehicle_id" BIGINT NOT NULL,
    "parking_slot_id" BIGINT NOT NULL,
    "booking_number" VARCHAR(255) NOT NULL,
    "start_time" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "end_time" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "booking_type_id" BIGINT NOT NULL,
    "booking_status_id" BIGINT NOT NULL,
    "cost" INTEGER NOT NULL
);
ALTER TABLE
    "bookings" ADD PRIMARY KEY("id");
CREATE TABLE "vehicles"(
    "id" BIGINT NOT NULL,
    "client_id" BIGINT NOT NULL,
    "vehicle_type_id" BIGINT NOT NULL,
    "license_plate" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "color" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "vehicles" ADD PRIMARY KEY("id");
CREATE TABLE "parking_sessions"(
    "id" BIGINT NOT NULL,
    "parking_session_number" VARCHAR(255) NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "start_time" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "end_time" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "parking_session_status_id" BIGINT NOT NULL
);
ALTER TABLE
    "parking_sessions" ADD PRIMARY KEY("id");
CREATE TABLE "sectors"(
    "id" BIGINT NOT NULL,
    "parking_id" BIGINT NOT NULL,
    "sector_name" VARCHAR(255) NOT NULL,
    "zone_type_id" BIGINT NOT NULL,
    "explotation_status_id" BIGINT NOT NULL
);
ALTER TABLE
    "sectors" ADD PRIMARY KEY("id");
CREATE TABLE "parking_slots"(
    "id" BIGINT NOT NULL,
    "sector_id" BIGINT NOT NULL,
    "parking_slot_number" VARCHAR(255) NOT NULL,
    "is_booked" BOOLEAN NOT NULL,
    "is_locked" BOOLEAN NOT NULL,
    "explotation_status_id" BIGINT NOT NULL
);
ALTER TABLE
    "parking_slots" ADD PRIMARY KEY("id");
CREATE TABLE "parkings"(
    "id" BIGINT NOT NULL,
    "parking_name" VARCHAR(255) NOT NULL,
    "adress" TEXT NOT NULL,
    "parking_type_id" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "explotation_status_id" BIGINT NOT NULL
);
ALTER TABLE
    "parkings" ADD PRIMARY KEY("id");
CREATE TABLE "clients"(
    "id" BIGINT NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "patronymic" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "clients" ADD PRIMARY KEY("id");
CREATE TABLE "explotation_statuses"(
    "id" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "explotation_statuses" ADD PRIMARY KEY("id");
CREATE TABLE "booking_statuses"(
    "id" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "booking_statuses" ADD PRIMARY KEY("id");
CREATE TABLE "parking_session_statuses"(
    "id" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "parking_session_statuses" ADD PRIMARY KEY("id");
CREATE TABLE "booking_types"(
    "id" BIGINT NOT NULL,
    "type" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "booking_types" ADD PRIMARY KEY("id");
ALTER TABLE
    "bookings" ADD CONSTRAINT "bookings_parking_slot_id_foreign" FOREIGN KEY("parking_slot_id") REFERENCES "parking_slots"("id");
ALTER TABLE
    "parking_slots" ADD CONSTRAINT "parking_slots_sector_id_foreign" FOREIGN KEY("sector_id") REFERENCES "sectors"("id");
ALTER TABLE
    "bookings" ADD CONSTRAINT "bookings_booking_status_id_foreign" FOREIGN KEY("booking_status_id") REFERENCES "booking_statuses"("id");
ALTER TABLE
    "parkings" ADD CONSTRAINT "parkings_explotation_status_id_foreign" FOREIGN KEY("explotation_status_id") REFERENCES "explotation_statuses"("id");
ALTER TABLE
    "parking_sessions" ADD CONSTRAINT "parking_sessions_booking_id_foreign" FOREIGN KEY("booking_id") REFERENCES "bookings"("id");
ALTER TABLE
    "vehicles" ADD CONSTRAINT "vehicles_client_id_foreign" FOREIGN KEY("client_id") REFERENCES "clients"("id");
ALTER TABLE
    "sectors" ADD CONSTRAINT "sectors_parking_id_foreign" FOREIGN KEY("parking_id") REFERENCES "parkings"("id");
ALTER TABLE
    "bookings" ADD CONSTRAINT "bookings_booking_type_id_foreign" FOREIGN KEY("booking_type_id") REFERENCES "booking_types"("id");
ALTER TABLE
    "bookings" ADD CONSTRAINT "bookings_vehicle_id_foreign" FOREIGN KEY("vehicle_id") REFERENCES "vehicles"("id");
ALTER TABLE
    "parking_sessions" ADD CONSTRAINT "parking_sessions_parking_session_status_id_foreign" FOREIGN KEY("parking_session_status_id") REFERENCES "parking_session_statuses"("id");
ALTER TABLE
    "sectors" ADD CONSTRAINT "sectors_explotation_status_id_foreign" FOREIGN KEY("explotation_status_id") REFERENCES "explotation_statuses"("id");
ALTER TABLE
    "parking_slots" ADD CONSTRAINT "parking_slots_explotation_status_id_foreign" FOREIGN KEY("explotation_status_id") REFERENCES "explotation_statuses"("id");