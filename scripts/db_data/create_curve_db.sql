
create table state (
    id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
    abbrev TEXT NOT NULL
);

create table time_bucket_format (
    id SERIAL PRIMARY KEY,
	name TEXT NOT NULL
);

create table time_bucket (
    id SERIAL PRIMARY KEY,
	name TEXT NOT NULL
);


create table iso (
    id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
    time_bucket_format_id INT REFERENCES time_bucket_format(id) NOT NULL
);

create table iso_state (
    id SERIAL PRIMARY KEY,
    iso_id INT REFERENCES iso(id) NOT NULL,
    state_id INT REFERENCES state(id) NOT NULL
);


create table zone (
    id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
    iso_id INT REFERENCES iso(id) NOT NULL
);


create table lmp (
    id SERIAL PRIMARY KEY,
    dt DATE NOT NULL,
    price TEXT NOT NULL,
    is_real_time boolean default False,
    hr_ending INT NOT NULL,
    zone_id INT REFERENCES zone(id) NOT NULL,
    utc_created timestamptz NOT NULL,
    UNIQUE(dt, hr_ending, zone_id, is_real_time)
);


create table curve_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

create table file_upload (
    id SERIAL PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    utc_created timestamptz NOT NULL,
    curve_type_id INT REFERENCES curve_type(id) NOT NULL
);

CREATE TYPE bid_mid_offer_type AS ENUM ('bid', 'mid', 'offer');

create table energy_curve (
    id SERIAL PRIMARY KEY,
    dt_forward DATE NOT NULL,
    utc_computed timestamptz NOT NULL,
    offer decimal(12, 2) NOT NULL,
    mid decimal(12, 2) NOT NULL,
    is_financial boolean default False,
    is_real_time boolean default False,
    zone_id INT REFERENCES zone(id) NOT NULL,
    time_bucket_id INT REFERENCES time_bucket(id) NOT NULL,
    utc_create timestamptz NOT NULL,
    UNIQUE(zone_id, time_bucket_id, dt_forward)
);

create table date_time_bucket (
    id SERIAL PRIMARY KEY,
    dt DATE NOT NULL,
    hr_ending INT NOT NULL,
    is_weekend boolean default False,
    time_bucket_format_id INT REFERENCES time_bucket_format(id) NOT NULL,
    time_bucket_id INT REFERENCES time_bucket(id) NOT NULL
);

create table price_scalar (
    id SERIAL PRIMARY KEY,
    delivery_year INT NOT NULL,
    delivery_month INT NOT NULL,
    hr_ending INT NOT NULL,
    is_weekend boolean default false,
    is_real_time boolean NOT NULL,
    scalar INT NOT NULL,
    zone_id INT REFERENCES zone(id) NOT NULL
);

create table zone_state (
    id SERIAL PRIMARY KEY,
    zone_id INT REFERENCES zone(id) NOT NULL,
    state_id INT REFERENCES state(id) NOT NULL
);

create table unit (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    symbol TEXT NOT NULL,
    measure_of TEXT NOT NULL,
    unique(symbol)
);

create table non_energy_curve (
    id SERIAL PRIMARY KEY,
    utc_computed timestamptz NOT NULL,  
    dt_forward DATE NOT NULL,
    price decimal(12, 2) NOT NULL,
    compliance_year INT NOT NULL,
    zone_id INT REFERENCES zone(id) NOT NULL,
    unit_id INT REFERENCES unit(id) NOT NULL,
    curve_type_id INT REFERENCES curve_type(id) NOT NULL,
    utc_create timestamptz NOT NULL,
    UNIQUE(zone_id, curve_type_id, dt_forward)
);

create table goliath_quote (
    id SERIAL PRIMARY KEY,
    quote JSON NOT NULL,
    customer_id INT REFERENCES customer(id) NOT NULL,
    utc_created timestamptz NOT NULL
);

create table customer (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    legal_name TEXT NOT NULL,
    UNIQUE(legal_name)
);

create table customer_lead (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customer(id) NOT NULL,
    is_renewal boolean default false
);

create table utility (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

create table facility (
    id SERIAL PRIMARY KEY,
    facility_number TEXT NOT NULL,
    utility_id INT REFERENCES utility(id) NOT NULL
);

create table customer_lead_detail (
    id SERIAL PRIMARY KEY,
    dt_start DATE NOT NULL,
    facility_id INT REFERENCES facility(id) NOT NULL,
    zone_id INT REFERENCES zone(id) NOT NULL,
    customer_lead_id INT REFERENCES customer_lead(id) NOT NULL,
    utc_created timestamptz NOT NULL
);

create table utility_zone (
    id SERIAL PRIMARY KEY,
    utility_id INT REFERENCES utility(id) NOT NULL,
    zone_id INT REFERENCES zone(id) NOT NULL,
    UNIQUE(utility_id, zone_id)
);

create table rate_class (
    id SERIAL PRIMARY KEY,
    utility_id INT REFERENCES utility(id) NOT NULL,
    name TEXT NOT NULL
);

create table season (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

create table utility_season (
    id SERIAL PRIMARY KEY,
    utility_id INT REFERENCES utility(id) NOT NULL,
    season_id INT REFERENCES season(id) NOT NULL,
    delivery_month INT NOT NULL,
    UNIQUE(utility_id, season_id, delivery_month)
);

create table demand_charge (
    id SERIAL PRIMARY KEY,
    curve_type_id INT REFERENCES curve_type(id) NOT NULL,
    rate_class_id INT REFERENCES rate_class(id) NOT NULL,
    unit_id INT REFERENCES unit(id) NOT NULL,
    time_bucket_id INT REFERENCES time_bucket(id) NOT NULL,
    is_ratchet boolean default false,
    is_rolling boolean default false,
    is_contract_demand boolean default false,
    is_max_of_time_bucket boolean default false,
    is_load_factor_dependent boolean default false,
    interval_length INT NOT NULL,
    ratchet_length INT NOT NULL,
    dt_implementation timestamptz NOT NULL,
    start_hour INT NOT NULL,
    end_hour INT NOT NULL,
    delivery_month INT NOT NULL,
    hour_id INT NOT NULL
);

create table dcm_charge_curve (
    id SERIAL PRIMARY KEY,
    price INT NOT NULL,
    dt_forward DATE NOT NULL,
    demand_level INT NOT NULL,
    load_factor_level INT NOT NULL,
    demand_charge_id INT REFERENCES time_bucket(id) NOT NULL
);

create table rps_curve_type (
    id SERIAL PRIMARY KEY,
    state_id INT REFERENCES state(id) NOT NULL,
    name TEXT NOT NULL,
    dt_effective DATE NOT NULL,
    dt_end DATE NOT NULL
);

create table rps_curve (
    id SERIAL PRIMARY KEY,
    utc_timestamp timestamptz NOT NULL,
    rps_curve_type_id INT REFERENCES rps_curve_type(id) NOT NULL,
    dt_forward DATE NOT NULL,
    obligation_percentage NUMERIC NOT NULL,
    wholesale_rec_offer NUMERIC NOT NULL
);

create table rps_obligation (
    id SERIAL PRIMARY KEY,
    utc_timestamp timestamptz NOT NULL,
    rps_curve_type_id INT REFERENCES rps_curve_type(id) NOT NULL,
    dt_forward DATE NOT NULL,
    obligation_percentage NUMERIC NOT NULL,
    acp_rate NUMERIC NOT NULL,
    compliance_year INT NOT NULL
);

