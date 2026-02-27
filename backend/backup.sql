--
-- PostgreSQL database dump
--

\restrict rbYZxYYmZzkyJQecotUsJIRCefRg1yEsv19MicdqpqdyR0nalUojBigOjqhbxiQ

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

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
-- Name: claim_reason_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.claim_reason_enum AS ENUM (
    'missing_item',
    'wrong_item',
    'production_failure',
    'other'
);


ALTER TYPE public.claim_reason_enum OWNER TO postgres;

--
-- Name: order_claim_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_claim_type_enum AS ENUM (
    'refund',
    'replace'
);


ALTER TYPE public.order_claim_type_enum OWNER TO postgres;

--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'completed',
    'draft',
    'archived',
    'canceled',
    'requires_action'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- Name: return_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.return_status_enum AS ENUM (
    'open',
    'requested',
    'received',
    'partially_received',
    'canceled'
);


ALTER TYPE public.return_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_holder (
    id text NOT NULL,
    provider_id text NOT NULL,
    external_id text NOT NULL,
    email text,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.account_holder OWNER TO postgres;

--
-- Name: api_key; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_key (
    id text NOT NULL,
    token text NOT NULL,
    salt text NOT NULL,
    redacted text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    last_used_at timestamp with time zone,
    created_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_by text,
    revoked_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT api_key_type_check CHECK ((type = ANY (ARRAY['publishable'::text, 'secret'::text])))
);


ALTER TABLE public.api_key OWNER TO postgres;

--
-- Name: application_method_buy_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_buy_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_buy_rules OWNER TO postgres;

--
-- Name: application_method_target_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_target_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_target_rules OWNER TO postgres;

--
-- Name: auth_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_identity (
    id text NOT NULL,
    app_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.auth_identity OWNER TO postgres;

--
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    id text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- Name: capture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capture (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb
);


ALTER TABLE public.capture OWNER TO postgres;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id text NOT NULL,
    region_id text,
    customer_id text,
    sales_channel_id text,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    locale text
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_address OWNER TO postgres;

--
-- Name: cart_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item (
    id text NOT NULL,
    cart_id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    quantity integer NOT NULL,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    product_type_id text,
    is_custom_price boolean DEFAULT false NOT NULL,
    is_giftcard boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.cart_line_item OWNER TO postgres;

--
-- Name: cart_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_adjustment_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_line_item_adjustment OWNER TO postgres;

--
-- Name: cart_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text
);


ALTER TABLE public.cart_line_item_tax_line OWNER TO postgres;

--
-- Name: cart_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_payment_collection (
    cart_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_payment_collection OWNER TO postgres;

--
-- Name: cart_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_promotion (
    cart_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_promotion OWNER TO postgres;

--
-- Name: cart_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method (
    id text NOT NULL,
    cart_id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT cart_shipping_method_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_shipping_method OWNER TO postgres;

--
-- Name: cart_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_adjustment OWNER TO postgres;

--
-- Name: cart_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_tax_line OWNER TO postgres;

--
-- Name: category_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_image (
    id text NOT NULL,
    url text NOT NULL,
    type text DEFAULT 'image'::text NOT NULL,
    name text,
    mime_type text,
    size integer,
    rank integer DEFAULT 0 NOT NULL,
    file_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT category_image_type_check CHECK ((type = ANY (ARRAY['thumbnail'::text, 'image'::text])))
);


ALTER TABLE public.category_image OWNER TO postgres;

--
-- Name: credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_line (
    id text NOT NULL,
    cart_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.credit_line OWNER TO postgres;

--
-- Name: currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency (
    code text NOT NULL,
    symbol text NOT NULL,
    symbol_native text NOT NULL,
    decimal_digits integer DEFAULT 0 NOT NULL,
    rounding numeric DEFAULT 0 NOT NULL,
    raw_rounding jsonb NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.currency OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id text NOT NULL,
    company_name text,
    first_name text,
    last_name text,
    email text,
    phone text,
    has_account boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_account_holder (
    customer_id character varying(255) NOT NULL,
    account_holder_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_account_holder OWNER TO postgres;

--
-- Name: customer_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_address (
    id text NOT NULL,
    customer_id text NOT NULL,
    address_name text,
    is_default_shipping boolean DEFAULT false NOT NULL,
    is_default_billing boolean DEFAULT false NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_address OWNER TO postgres;

--
-- Name: customer_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group OWNER TO postgres;

--
-- Name: customer_group_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group_customer (
    id text NOT NULL,
    customer_id text NOT NULL,
    customer_group_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group_customer OWNER TO postgres;

--
-- Name: fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment (
    id text NOT NULL,
    location_id text NOT NULL,
    packed_at timestamp with time zone,
    shipped_at timestamp with time zone,
    delivered_at timestamp with time zone,
    canceled_at timestamp with time zone,
    data jsonb,
    provider_id text,
    shipping_option_id text,
    metadata jsonb,
    delivery_address_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    marked_shipped_by text,
    created_by text,
    requires_shipping boolean DEFAULT true NOT NULL
);


ALTER TABLE public.fulfillment OWNER TO postgres;

--
-- Name: fulfillment_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_address (
    id text NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_address OWNER TO postgres;

--
-- Name: fulfillment_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_item (
    id text NOT NULL,
    title text NOT NULL,
    sku text NOT NULL,
    barcode text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    line_item_id text,
    inventory_item_id text,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_item OWNER TO postgres;

--
-- Name: fulfillment_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_label (
    id text NOT NULL,
    tracking_number text NOT NULL,
    tracking_url text NOT NULL,
    label_url text NOT NULL,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_label OWNER TO postgres;

--
-- Name: fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_provider OWNER TO postgres;

--
-- Name: fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_set (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_set OWNER TO postgres;

--
-- Name: geo_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_zone (
    id text NOT NULL,
    type text DEFAULT 'country'::text NOT NULL,
    country_code text NOT NULL,
    province_code text,
    city text,
    service_zone_id text NOT NULL,
    postal_expression jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT geo_zone_type_check CHECK ((type = ANY (ARRAY['country'::text, 'province'::text, 'city'::text, 'zip'::text])))
);


ALTER TABLE public.geo_zone OWNER TO postgres;

--
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    rank integer DEFAULT 0 NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.image OWNER TO postgres;

--
-- Name: inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sku text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    requires_shipping boolean DEFAULT true NOT NULL,
    description text,
    title text,
    thumbnail text,
    metadata jsonb
);


ALTER TABLE public.inventory_item OWNER TO postgres;

--
-- Name: inventory_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_level (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    inventory_item_id text NOT NULL,
    location_id text NOT NULL,
    stocked_quantity numeric DEFAULT 0 NOT NULL,
    reserved_quantity numeric DEFAULT 0 NOT NULL,
    incoming_quantity numeric DEFAULT 0 NOT NULL,
    metadata jsonb,
    raw_stocked_quantity jsonb,
    raw_reserved_quantity jsonb,
    raw_incoming_quantity jsonb
);


ALTER TABLE public.inventory_level OWNER TO postgres;

--
-- Name: invite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite (
    id text NOT NULL,
    email text NOT NULL,
    accepted boolean DEFAULT false NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.invite OWNER TO postgres;

--
-- Name: link_module_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.link_module_migrations (
    id integer NOT NULL,
    table_name character varying(255) NOT NULL,
    link_descriptor jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.link_module_migrations OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.link_module_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.link_module_migrations_id_seq OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.link_module_migrations_id_seq OWNED BY public.link_module_migrations.id;


--
-- Name: locale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locale (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.locale OWNER TO postgres;

--
-- Name: location_fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_provider (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_provider OWNER TO postgres;

--
-- Name: location_fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_set (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_set OWNER TO postgres;

--
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255),
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mikro_orm_migrations OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mikro_orm_migrations_id_seq OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id text NOT NULL,
    "to" text NOT NULL,
    channel text NOT NULL,
    template text,
    data jsonb,
    trigger_type text,
    resource_id text,
    resource_type text,
    receiver_id text,
    original_notification_id text,
    idempotency_key text,
    external_id text,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    "from" text,
    provider_data jsonb,
    CONSTRAINT notification_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failure'::text])))
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_provider (
    id text NOT NULL,
    handle text NOT NULL,
    name text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    channels text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.notification_provider OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id text NOT NULL,
    region_id text,
    display_id integer,
    customer_id text,
    version integer DEFAULT 1 NOT NULL,
    sales_channel_id text,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    is_draft_order boolean DEFAULT false NOT NULL,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    no_notification boolean,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    custom_display_id text,
    locale text
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: order_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_address OWNER TO postgres;

--
-- Name: order_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_cart (
    order_id character varying(255) NOT NULL,
    cart_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_cart OWNER TO postgres;

--
-- Name: order_change; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    internal_note text,
    created_by text,
    requested_by text,
    requested_at timestamp with time zone,
    confirmed_by text,
    confirmed_at timestamp with time zone,
    declined_by text,
    declined_reason text,
    metadata jsonb,
    declined_at timestamp with time zone,
    canceled_by text,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    change_type text,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text,
    carry_over_promotions boolean,
    CONSTRAINT order_change_status_check CHECK ((status = ANY (ARRAY['confirmed'::text, 'declined'::text, 'requested'::text, 'pending'::text, 'canceled'::text])))
);


ALTER TABLE public.order_change OWNER TO postgres;

--
-- Name: order_change_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change_action (
    id text NOT NULL,
    order_id text,
    version integer,
    ordering bigint NOT NULL,
    order_change_id text,
    reference text,
    reference_id text,
    action text NOT NULL,
    details jsonb,
    amount numeric,
    raw_amount jsonb,
    internal_note text,
    applied boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_change_action OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_change_action_ordering_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_change_action_ordering_seq OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_change_action_ordering_seq OWNED BY public.order_change_action.ordering;


--
-- Name: order_claim; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    type public.order_claim_type_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_claim OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_claim_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_claim_display_id_seq OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_claim_display_id_seq OWNED BY public.order_claim.display_id;


--
-- Name: order_claim_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item (
    id text NOT NULL,
    claim_id text NOT NULL,
    item_id text NOT NULL,
    is_additional_item boolean DEFAULT false NOT NULL,
    reason public.claim_reason_enum,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item OWNER TO postgres;

--
-- Name: order_claim_item_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item_image (
    id text NOT NULL,
    claim_item_id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item_image OWNER TO postgres;

--
-- Name: order_credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_credit_line (
    id text NOT NULL,
    order_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_credit_line OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_display_id_seq OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_display_id_seq OWNED BY public."order".display_id;


--
-- Name: order_exchange; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    no_notification boolean,
    allow_backorder boolean DEFAULT false NOT NULL,
    difference_due numeric,
    raw_difference_due jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_exchange OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_exchange_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_exchange_display_id_seq OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_exchange_display_id_seq OWNED BY public.order_exchange.display_id;


--
-- Name: order_exchange_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange_item (
    id text NOT NULL,
    exchange_id text NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_exchange_item OWNER TO postgres;

--
-- Name: order_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_fulfillment (
    order_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_fulfillment OWNER TO postgres;

--
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    fulfilled_quantity numeric NOT NULL,
    raw_fulfilled_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    shipped_quantity numeric NOT NULL,
    raw_shipped_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_requested_quantity numeric NOT NULL,
    raw_return_requested_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_received_quantity numeric NOT NULL,
    raw_return_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_dismissed_quantity numeric NOT NULL,
    raw_return_dismissed_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    written_off_quantity numeric NOT NULL,
    raw_written_off_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    delivered_quantity numeric DEFAULT 0 NOT NULL,
    raw_delivered_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    unit_price numeric,
    raw_unit_price jsonb,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- Name: order_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item (
    id text NOT NULL,
    totals_id text,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_price boolean DEFAULT false NOT NULL,
    product_type_id text,
    is_giftcard boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_line_item OWNER TO postgres;

--
-- Name: order_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_line_item_adjustment OWNER TO postgres;

--
-- Name: order_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_line_item_tax_line OWNER TO postgres;

--
-- Name: order_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_payment_collection (
    order_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_payment_collection OWNER TO postgres;

--
-- Name: order_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_promotion (
    order_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_promotion OWNER TO postgres;

--
-- Name: order_shipping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    shipping_method_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_shipping OWNER TO postgres;

--
-- Name: order_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method (
    id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_amount boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_shipping_method OWNER TO postgres;

--
-- Name: order_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_adjustment OWNER TO postgres;

--
-- Name: order_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_tax_line OWNER TO postgres;

--
-- Name: order_summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_summary (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    totals jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_summary OWNER TO postgres;

--
-- Name: order_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_transaction (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    reference text,
    reference_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_transaction OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    provider_id text NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    captured_at timestamp with time zone,
    canceled_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    payment_session_id text NOT NULL,
    metadata jsonb
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    authorized_amount numeric,
    raw_authorized_amount jsonb,
    captured_amount numeric,
    raw_captured_amount jsonb,
    refunded_amount numeric,
    raw_refunded_amount jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    status text DEFAULT 'not_paid'::text NOT NULL,
    metadata jsonb,
    CONSTRAINT payment_collection_status_check CHECK ((status = ANY (ARRAY['not_paid'::text, 'awaiting'::text, 'authorized'::text, 'partially_authorized'::text, 'canceled'::text, 'failed'::text, 'partially_captured'::text, 'completed'::text])))
);


ALTER TABLE public.payment_collection OWNER TO postgres;

--
-- Name: payment_collection_payment_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection_payment_providers (
    payment_collection_id text NOT NULL,
    payment_provider_id text NOT NULL
);


ALTER TABLE public.payment_collection_payment_providers OWNER TO postgres;

--
-- Name: payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.payment_provider OWNER TO postgres;

--
-- Name: payment_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_session (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    context jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    authorized_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT payment_session_status_check CHECK ((status = ANY (ARRAY['authorized'::text, 'captured'::text, 'pending'::text, 'requires_more'::text, 'error'::text, 'canceled'::text])))
);


ALTER TABLE public.payment_session OWNER TO postgres;

--
-- Name: price; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price (
    id text NOT NULL,
    title text,
    price_set_id text NOT NULL,
    currency_code text NOT NULL,
    raw_amount jsonb NOT NULL,
    rules_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    price_list_id text,
    amount numeric NOT NULL,
    min_quantity numeric,
    max_quantity numeric,
    raw_min_quantity jsonb,
    raw_max_quantity jsonb
);


ALTER TABLE public.price OWNER TO postgres;

--
-- Name: price_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list (
    id text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    rules_count integer DEFAULT 0,
    title text NOT NULL,
    description text NOT NULL,
    type text DEFAULT 'sale'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT price_list_status_check CHECK ((status = ANY (ARRAY['active'::text, 'draft'::text]))),
    CONSTRAINT price_list_type_check CHECK ((type = ANY (ARRAY['sale'::text, 'override'::text])))
);


ALTER TABLE public.price_list OWNER TO postgres;

--
-- Name: price_list_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list_rule (
    id text NOT NULL,
    price_list_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    value jsonb,
    attribute text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.price_list_rule OWNER TO postgres;

--
-- Name: price_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_preference (
    id text NOT NULL,
    attribute text NOT NULL,
    value text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_preference OWNER TO postgres;

--
-- Name: price_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_rule (
    id text NOT NULL,
    value text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    price_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    attribute text DEFAULT ''::text NOT NULL,
    operator text DEFAULT 'eq'::text NOT NULL,
    CONSTRAINT price_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text])))
);


ALTER TABLE public.price_rule OWNER TO postgres;

--
-- Name: price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_set (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_set OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    subtitle text,
    description text,
    is_giftcard boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    thumbnail text,
    weight text,
    length text,
    height text,
    width text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    collection_id text,
    type_id text,
    discountable boolean DEFAULT true NOT NULL,
    external_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT product_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'proposed'::text, 'published'::text, 'rejected'::text])))
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    handle text NOT NULL,
    mpath text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_internal boolean DEFAULT false NOT NULL,
    rank integer DEFAULT 0 NOT NULL,
    parent_category_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category_product (
    product_id text NOT NULL,
    product_category_id text NOT NULL
);


ALTER TABLE public.product_category_product OWNER TO postgres;

--
-- Name: product_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_collection (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_collection OWNER TO postgres;

--
-- Name: product_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option (
    id text NOT NULL,
    title text NOT NULL,
    product_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option OWNER TO postgres;

--
-- Name: product_option_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option_value (
    id text NOT NULL,
    value text NOT NULL,
    option_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option_value OWNER TO postgres;

--
-- Name: product_product_brand_brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_product_brand_brand (
    product_id character varying(255) NOT NULL,
    brand_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_product_brand_brand OWNER TO postgres;

--
-- Name: product_product_category_categoryimage_category_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_product_category_categoryimage_category_image (
    product_category_id character varying(255) NOT NULL,
    category_image_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_product_category_categoryimage_category_image OWNER TO postgres;

--
-- Name: product_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sales_channel (
    product_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_sales_channel OWNER TO postgres;

--
-- Name: product_shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_shipping_profile (
    product_id character varying(255) NOT NULL,
    shipping_profile_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_shipping_profile OWNER TO postgres;

--
-- Name: product_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tag (
    id text NOT NULL,
    value text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_tag OWNER TO postgres;

--
-- Name: product_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tags (
    product_id text NOT NULL,
    product_tag_id text NOT NULL
);


ALTER TABLE public.product_tags OWNER TO postgres;

--
-- Name: product_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_type (
    id text NOT NULL,
    value text NOT NULL,
    metadata json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_type OWNER TO postgres;

--
-- Name: product_variant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant (
    id text NOT NULL,
    title text NOT NULL,
    sku text,
    barcode text,
    ean text,
    upc text,
    allow_backorder boolean DEFAULT false NOT NULL,
    manage_inventory boolean DEFAULT true NOT NULL,
    hs_code text,
    origin_country text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    metadata jsonb,
    variant_rank integer DEFAULT 0,
    product_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    thumbnail text
);


ALTER TABLE public.product_variant OWNER TO postgres;

--
-- Name: product_variant_inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_inventory_item (
    variant_id character varying(255) NOT NULL,
    inventory_item_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    required_quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_inventory_item OWNER TO postgres;

--
-- Name: product_variant_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_option (
    variant_id text NOT NULL,
    option_value_id text NOT NULL
);


ALTER TABLE public.product_variant_option OWNER TO postgres;

--
-- Name: product_variant_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_price_set (
    variant_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_price_set OWNER TO postgres;

--
-- Name: product_variant_product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_product_image (
    id text NOT NULL,
    variant_id text NOT NULL,
    image_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_product_image OWNER TO postgres;

--
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    id text NOT NULL,
    code text NOT NULL,
    campaign_id text,
    is_automatic boolean DEFAULT false NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    "limit" integer,
    used integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    CONSTRAINT promotion_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'inactive'::text]))),
    CONSTRAINT promotion_type_check CHECK ((type = ANY (ARRAY['standard'::text, 'buyget'::text])))
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- Name: promotion_application_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_application_method (
    id text NOT NULL,
    value numeric,
    raw_value jsonb,
    max_quantity integer,
    apply_to_quantity integer,
    buy_rules_min_quantity integer,
    type text NOT NULL,
    target_type text NOT NULL,
    allocation text,
    promotion_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    CONSTRAINT promotion_application_method_allocation_check CHECK ((allocation = ANY (ARRAY['each'::text, 'across'::text, 'once'::text]))),
    CONSTRAINT promotion_application_method_target_type_check CHECK ((target_type = ANY (ARRAY['order'::text, 'shipping_methods'::text, 'items'::text]))),
    CONSTRAINT promotion_application_method_type_check CHECK ((type = ANY (ARRAY['fixed'::text, 'percentage'::text])))
);


ALTER TABLE public.promotion_application_method OWNER TO postgres;

--
-- Name: promotion_campaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    campaign_identifier text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign OWNER TO postgres;

--
-- Name: promotion_campaign_budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget (
    id text NOT NULL,
    type text NOT NULL,
    campaign_id text NOT NULL,
    "limit" numeric,
    raw_limit jsonb,
    used numeric DEFAULT 0 NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    attribute text,
    CONSTRAINT promotion_campaign_budget_type_check CHECK ((type = ANY (ARRAY['spend'::text, 'usage'::text, 'use_by_attribute'::text, 'spend_by_attribute'::text])))
);


ALTER TABLE public.promotion_campaign_budget OWNER TO postgres;

--
-- Name: promotion_campaign_budget_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget_usage (
    id text NOT NULL,
    attribute_value text NOT NULL,
    used numeric DEFAULT 0 NOT NULL,
    budget_id text NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign_budget_usage OWNER TO postgres;

--
-- Name: promotion_promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_promotion_rule (
    promotion_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.promotion_promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule (
    id text NOT NULL,
    description text,
    attribute text NOT NULL,
    operator text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text, 'ne'::text, 'in'::text])))
);


ALTER TABLE public.promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule_value (
    id text NOT NULL,
    promotion_rule_id text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_rule_value OWNER TO postgres;

--
-- Name: provider_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider_identity (
    id text NOT NULL,
    entity_id text NOT NULL,
    provider text NOT NULL,
    auth_identity_id text NOT NULL,
    user_metadata jsonb,
    provider_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.provider_identity OWNER TO postgres;

--
-- Name: publishable_api_key_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publishable_api_key_sales_channel (
    publishable_key_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.publishable_api_key_sales_channel OWNER TO postgres;

--
-- Name: refund; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb,
    refund_reason_id text,
    note text
);


ALTER TABLE public.refund OWNER TO postgres;

--
-- Name: refund_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund_reason (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    code text NOT NULL
);


ALTER TABLE public.refund_reason OWNER TO postgres;

--
-- Name: region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region (
    id text NOT NULL,
    name text NOT NULL,
    currency_code text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    automatic_taxes boolean DEFAULT true NOT NULL
);


ALTER TABLE public.region OWNER TO postgres;

--
-- Name: region_country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_country (
    iso_2 text NOT NULL,
    iso_3 text NOT NULL,
    num_code text NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    region_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_country OWNER TO postgres;

--
-- Name: region_payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_payment_provider (
    region_id character varying(255) NOT NULL,
    payment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_payment_provider OWNER TO postgres;

--
-- Name: reservation_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    line_item_id text,
    location_id text NOT NULL,
    quantity numeric NOT NULL,
    external_id text,
    description text,
    created_by text,
    metadata jsonb,
    inventory_item_id text NOT NULL,
    allow_backorder boolean DEFAULT false,
    raw_quantity jsonb
);


ALTER TABLE public.reservation_item OWNER TO postgres;

--
-- Name: return; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return (
    id text NOT NULL,
    order_id text NOT NULL,
    claim_id text,
    exchange_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    status public.return_status_enum DEFAULT 'open'::public.return_status_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    received_at timestamp with time zone,
    canceled_at timestamp with time zone,
    location_id text,
    requested_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.return OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.return_display_id_seq OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_display_id_seq OWNED BY public.return.display_id;


--
-- Name: return_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_fulfillment (
    return_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_fulfillment OWNER TO postgres;

--
-- Name: return_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_item (
    id text NOT NULL,
    return_id text NOT NULL,
    reason_id text,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    received_quantity numeric DEFAULT 0 NOT NULL,
    raw_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    damaged_quantity numeric DEFAULT 0 NOT NULL,
    raw_damaged_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL
);


ALTER TABLE public.return_item OWNER TO postgres;

--
-- Name: return_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_reason (
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL,
    description character varying,
    metadata jsonb,
    parent_return_reason_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_reason OWNER TO postgres;

--
-- Name: sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    is_disabled boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel OWNER TO postgres;

--
-- Name: sales_channel_stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel_stock_location (
    sales_channel_id character varying(255) NOT NULL,
    stock_location_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel_stock_location OWNER TO postgres;

--
-- Name: script_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.script_migrations (
    id integer NOT NULL,
    script_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone
);


ALTER TABLE public.script_migrations OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.script_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.script_migrations_id_seq OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.script_migrations_id_seq OWNED BY public.script_migrations.id;


--
-- Name: service_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_zone (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    fulfillment_set_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.service_zone OWNER TO postgres;

--
-- Name: shipping_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option (
    id text NOT NULL,
    name text NOT NULL,
    price_type text DEFAULT 'flat'::text NOT NULL,
    service_zone_id text NOT NULL,
    shipping_profile_id text,
    provider_id text,
    data jsonb,
    metadata jsonb,
    shipping_option_type_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_price_type_check CHECK ((price_type = ANY (ARRAY['calculated'::text, 'flat'::text])))
);


ALTER TABLE public.shipping_option OWNER TO postgres;

--
-- Name: shipping_option_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_price_set (
    shipping_option_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_price_set OWNER TO postgres;

--
-- Name: shipping_option_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_rule (
    id text NOT NULL,
    attribute text NOT NULL,
    operator text NOT NULL,
    value jsonb,
    shipping_option_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_rule_operator_check CHECK ((operator = ANY (ARRAY['in'::text, 'eq'::text, 'ne'::text, 'gt'::text, 'gte'::text, 'lt'::text, 'lte'::text, 'nin'::text])))
);


ALTER TABLE public.shipping_option_rule OWNER TO postgres;

--
-- Name: shipping_option_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_type (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_type OWNER TO postgres;

--
-- Name: shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_profile (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_profile OWNER TO postgres;

--
-- Name: stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name text NOT NULL,
    address_id text,
    metadata jsonb
);


ALTER TABLE public.stock_location OWNER TO postgres;

--
-- Name: stock_location_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location_address (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    address_1 text NOT NULL,
    address_2 text,
    company text,
    city text,
    country_code text NOT NULL,
    phone text,
    province text,
    postal_code text,
    metadata jsonb
);


ALTER TABLE public.stock_location_address OWNER TO postgres;

--
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id text NOT NULL,
    name text DEFAULT 'Medusa Store'::text NOT NULL,
    default_sales_channel_id text,
    default_region_id text,
    default_location_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store OWNER TO postgres;

--
-- Name: store_currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_currency (
    id text NOT NULL,
    currency_code text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_currency OWNER TO postgres;

--
-- Name: store_locale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_locale (
    id text NOT NULL,
    locale_code text NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_locale OWNER TO postgres;

--
-- Name: tax_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_provider OWNER TO postgres;

--
-- Name: tax_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate (
    id text NOT NULL,
    rate real,
    code text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_combinable boolean DEFAULT false NOT NULL,
    tax_region_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate OWNER TO postgres;

--
-- Name: tax_rate_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate_rule (
    id text NOT NULL,
    tax_rate_id text NOT NULL,
    reference_id text NOT NULL,
    reference text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate_rule OWNER TO postgres;

--
-- Name: tax_region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_region (
    id text NOT NULL,
    provider_id text,
    country_code text NOT NULL,
    province_code text,
    parent_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone,
    CONSTRAINT "CK_tax_region_country_top_level" CHECK (((parent_id IS NULL) OR (province_code IS NOT NULL))),
    CONSTRAINT "CK_tax_region_provider_top_level" CHECK (((parent_id IS NULL) OR (provider_id IS NULL)))
);


ALTER TABLE public.tax_region OWNER TO postgres;

--
-- Name: translation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translation (
    id text NOT NULL,
    reference_id text NOT NULL,
    reference text NOT NULL,
    locale_code text NOT NULL,
    translations jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    translated_field_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.translation OWNER TO postgres;

--
-- Name: translation_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translation_settings (
    id text NOT NULL,
    entity_type text NOT NULL,
    fields jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.translation_settings OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    avatar_url text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preference (
    id text NOT NULL,
    user_id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_preference OWNER TO postgres;

--
-- Name: user_rbac_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_rbac_role (
    user_id character varying(255) NOT NULL,
    rbac_role_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_rbac_role OWNER TO postgres;

--
-- Name: view_configuration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.view_configuration (
    id text NOT NULL,
    entity text NOT NULL,
    name text,
    user_id text,
    is_system_default boolean DEFAULT false NOT NULL,
    configuration jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.view_configuration OWNER TO postgres;

--
-- Name: workflow_execution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_execution (
    id character varying NOT NULL,
    workflow_id character varying NOT NULL,
    transaction_id character varying NOT NULL,
    execution jsonb,
    context jsonb,
    state character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    retention_time integer,
    run_id text DEFAULT '01KEXP5MXF0JZ45E4HSVD3APMP'::text NOT NULL
);


ALTER TABLE public.workflow_execution OWNER TO postgres;

--
-- Name: link_module_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations ALTER COLUMN id SET DEFAULT nextval('public.link_module_migrations_id_seq'::regclass);


--
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- Name: order display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN display_id SET DEFAULT nextval('public.order_display_id_seq'::regclass);


--
-- Name: order_change_action ordering; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action ALTER COLUMN ordering SET DEFAULT nextval('public.order_change_action_ordering_seq'::regclass);


--
-- Name: order_claim display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim ALTER COLUMN display_id SET DEFAULT nextval('public.order_claim_display_id_seq'::regclass);


--
-- Name: order_exchange display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange ALTER COLUMN display_id SET DEFAULT nextval('public.order_exchange_display_id_seq'::regclass);


--
-- Name: return display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return ALTER COLUMN display_id SET DEFAULT nextval('public.return_display_id_seq'::regclass);


--
-- Name: script_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations ALTER COLUMN id SET DEFAULT nextval('public.script_migrations_id_seq'::regclass);


--
-- Data for Name: account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_holder (id, provider_id, external_id, email, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: api_key; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_key (id, token, salt, redacted, title, type, last_used_at, created_by, created_at, revoked_by, revoked_at, updated_at, deleted_at) FROM stdin;
apk_01KEXP5SF6GME73XYYAMNARQVD	pk_413ca9c054d20af08ff951845b7cd1b2796e51c820a6df1b954aee1364b2715a		pk_413***15a	Default Publishable API Key	publishable	\N		2026-01-14 07:22:59.43+00	\N	\N	2026-01-14 07:22:59.43+00	\N
\.


--
-- Data for Name: application_method_buy_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_buy_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: application_method_target_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_target_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: auth_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_identity (id, app_metadata, created_at, updated_at, deleted_at) FROM stdin;
authid_01KEXPMZXZZBN8BG03J04PW3X7	{"user_id": "user_01KEXPMZVWQX77SXGJHER0CY4A"}	2026-01-14 07:31:17.567+00	2026-01-14 07:31:17.575+00	\N
authid_01KFMDCQF3GJVD8SEXDKDDTQFH	\N	2026-01-23 03:12:01.507+00	2026-01-23 03:12:01.507+00	\N
authid_01KFMEMK5PGEQ49FMY5YHQQCK0	\N	2026-01-23 03:33:47.83+00	2026-01-23 03:33:47.83+00	\N
authid_01KFMEXAQ1XSAY87D2AC049604	{"customer_id": "cus_01KFMEXPEPZKS3K3D6CACQ5MVX"}	2026-01-23 03:38:34.081+00	2026-01-23 03:38:46.108+00	\N
authid_01KFMJKSN9KSQAMZKSYNAGXTAV	{"customer_id": "cus_01KFMJM9KTPNZX06CJ2HZ7CYM1"}	2026-01-23 04:43:16.009+00	2026-01-23 04:43:32.35+00	\N
\.


--
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brand (id, name, created_at, updated_at, deleted_at) FROM stdin;
01KFAD2WXX5QCGG5A12TG6N9TH	Ikea	2026-01-19 05:54:15.101+00	2026-01-19 05:54:15.101+00	\N
01KFAFZZR8536Y5GQM4BAA3K6K	Ikea	2026-01-19 06:45:05.416+00	2026-01-19 06:45:05.416+00	\N
01KFCR0V2MC2XZHHXNAYJP64ZG	Cathay Pacific	2026-01-20 03:43:50.868+00	2026-01-20 03:43:50.868+00	\N
\.


--
-- Data for Name: capture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capture (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata) FROM stdin;
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, region_id, customer_id, sales_channel_id, email, currency_code, shipping_address_id, billing_address_id, metadata, created_at, updated_at, deleted_at, completed_at, locale) FROM stdin;
cart_01KH5Q6AG9B03MR71583ASAB0R	reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	cus_01KFMEXPEPZKS3K3D6CACQ5MVX	sc_01KEXP5SEB2P87PM49V5A9WTA8	peter.chan@handmade.com	hkd	caaddr_01KH5VVKY52YB4NT8B3MC946R2	\N	\N	2026-02-11 06:46:04.554+00	2026-02-11 08:07:36.646+00	\N	\N	zh-tw
\.


--
-- Data for Name: cart_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
caaddr_01KH5VVKY52YB4NT8B3MC946R2	\N	\N	\N	\N	\N	\N	\N	hk	\N	\N	\N	\N	2026-02-11 08:07:36.645+00	2026-02-11 08:07:36.645+00	\N
\.


--
-- Data for Name: cart_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item (id, cart_id, title, subtitle, thumbnail, quantity, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, product_type_id, is_custom_price, is_giftcard) FROM stdin;
cali_01KH5VVM19CX5R35YM8C7TJTKB	cart_01KH5Q6AG9B03MR71583ASAB0R	Medusa T-Shirt	S / Black	https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png	1	variant_01KEXP5SNEF0WPB79D4AX69XTA	prod_01KEXP5SM5RRMY6D3MYZW6Z196	Medusa T-Shirt	Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.	\N	\N	Summer Collection 2026	t-shirt	SHIRT-S-BLACK	\N	S / Black	\N	t	t	f	\N	\N	70	{"value": "70", "precision": 20}	{}	2026-02-11 08:07:36.745+00	2026-02-11 08:07:58.984+00	\N	\N	f	f
cali_01KH86N1PZCVMRJYGCWBR0RSZ6	cart_01KH5Q6AG9B03MR71583ASAB0R	Boho handbag	Default variant	http://localhost:9000/static/1769134594136-product-1.webp	1	variant_01KFMA763YVDRFYFY07FTATYK5	prod_01KFMA7633M0GS3YF54WQWK8V5	Boho handbag	Size: 70cm x 60cm\n\n======================= \nThis page is only used as a product catalog. If you want to purchase, please go to Instagram inbox (@wonderhin.handmade)	\N	\N	\N	boho-handbag	\N	\N	Default variant	\N	f	t	f	\N	\N	240	{"value": "240", "precision": 20}	{}	2026-02-12 05:54:44.575+00	2026-02-12 06:10:37.971+00	\N	\N	f	f
\.


--
-- Data for Name: cart_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, item_id, is_tax_inclusive) FROM stdin;
\.


--
-- Data for Name: cart_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, item_id) FROM stdin;
\.


--
-- Data for Name: cart_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_payment_collection (cart_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_promotion (cart_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method (id, cart_id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: category_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_image (id, url, type, name, mime_type, size, rank, file_id, created_at, updated_at, deleted_at) FROM stdin;
01KHJS6MP7A98R1ZF67XQBM193	http://localhost:9000/static/1771230679743-66841999dad9d9000dd786f7.jpeg	thumbnail	66841999dad9d9000dd786f7.jpeg	image/jpeg	752017	0	1771230679743-66841999dad9d9000dd786f7.jpeg	2026-02-16 08:31:19.751+00	2026-02-16 08:31:19.751+00	\N
01KHJS8AZH0CPN8A3PPQS4T7HD	http://localhost:9000/static/1771230735320-66841999dad9d9000dd786f7.jpeg	thumbnail	66841999dad9d9000dd786f7.jpeg	image/jpeg	752017	0	1771230735320-66841999dad9d9000dd786f7.jpeg	2026-02-16 08:32:15.345+00	2026-02-16 08:32:15.345+00	\N
01KHJVF4TPMTE29H282T90BPD3	http://localhost:9000/static/1771233055566-6684190691718a001f5472d7.webp	thumbnail	6684190691718a001f5472d7.webp	image/webp	82646	0	1771233055566-6684190691718a001f5472d7.webp	2026-02-16 09:10:55.574+00	2026-02-16 09:10:55.574+00	\N
01KHJVGS0T86H15NB98NMGEXD3	http://localhost:9000/static/1771233109011-66841b10e78435001ca9ba5c.webp	thumbnail	66841b10e78435001ca9ba5c.webp	image/webp	108552	0	1771233109011-66841b10e78435001ca9ba5c.webp	2026-02-16 09:11:49.018+00	2026-02-16 09:11:49.018+00	\N
01KHJVHZ0TZ9JSWY2ESR1HB021	http://localhost:9000/static/1771233147923-66841bd9a2991700136c1a92.webp	thumbnail	66841bd9a2991700136c1a92.webp	image/webp	162814	0	1771233147923-66841bd9a2991700136c1a92.webp	2026-02-16 09:12:27.93+00	2026-02-16 09:12:27.93+00	\N
\.


--
-- Data for Name: credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_line (id, cart_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency (code, symbol, symbol_native, decimal_digits, rounding, raw_rounding, name, created_at, updated_at, deleted_at) FROM stdin;
usd	$	$	2	0	{"value": "0", "precision": 20}	US Dollar	2026-01-14 07:22:56.463+00	2026-01-14 07:22:56.463+00	\N
cad	CA$	$	2	0	{"value": "0", "precision": 20}	Canadian Dollar	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
eur	€	€	2	0	{"value": "0", "precision": 20}	Euro	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
aed	AED	د.إ.‏	2	0	{"value": "0", "precision": 20}	United Arab Emirates Dirham	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
afn	Af	؋	0	0	{"value": "0", "precision": 20}	Afghan Afghani	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
all	ALL	Lek	0	0	{"value": "0", "precision": 20}	Albanian Lek	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
amd	AMD	դր.	0	0	{"value": "0", "precision": 20}	Armenian Dram	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
ars	AR$	$	2	0	{"value": "0", "precision": 20}	Argentine Peso	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
aud	AU$	$	2	0	{"value": "0", "precision": 20}	Australian Dollar	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
azn	man.	ман.	2	0	{"value": "0", "precision": 20}	Azerbaijani Manat	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bam	KM	KM	2	0	{"value": "0", "precision": 20}	Bosnia-Herzegovina Convertible Mark	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bdt	Tk	৳	2	0	{"value": "0", "precision": 20}	Bangladeshi Taka	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bgn	BGN	лв.	2	0	{"value": "0", "precision": 20}	Bulgarian Lev	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bhd	BD	د.ب.‏	3	0	{"value": "0", "precision": 20}	Bahraini Dinar	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bif	FBu	FBu	0	0	{"value": "0", "precision": 20}	Burundian Franc	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bnd	BN$	$	2	0	{"value": "0", "precision": 20}	Brunei Dollar	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bob	Bs	Bs	2	0	{"value": "0", "precision": 20}	Bolivian Boliviano	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
brl	R$	R$	2	0	{"value": "0", "precision": 20}	Brazilian Real	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bwp	BWP	P	2	0	{"value": "0", "precision": 20}	Botswanan Pula	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
byn	Br	руб.	2	0	{"value": "0", "precision": 20}	Belarusian Ruble	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
bzd	BZ$	$	2	0	{"value": "0", "precision": 20}	Belize Dollar	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
cdf	CDF	FrCD	2	0	{"value": "0", "precision": 20}	Congolese Franc	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
chf	CHF	CHF	2	0.05	{"value": "0.05", "precision": 20}	Swiss Franc	2026-01-14 07:22:56.464+00	2026-01-14 07:22:56.464+00	\N
clp	CL$	$	0	0	{"value": "0", "precision": 20}	Chilean Peso	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
cny	CN¥	CN¥	2	0	{"value": "0", "precision": 20}	Chinese Yuan	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
cop	CO$	$	0	0	{"value": "0", "precision": 20}	Colombian Peso	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
crc	₡	₡	0	0	{"value": "0", "precision": 20}	Costa Rican Colón	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
cve	CV$	CV$	2	0	{"value": "0", "precision": 20}	Cape Verdean Escudo	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
czk	Kč	Kč	2	0	{"value": "0", "precision": 20}	Czech Republic Koruna	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
djf	Fdj	Fdj	0	0	{"value": "0", "precision": 20}	Djiboutian Franc	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
dkk	Dkr	kr	2	0	{"value": "0", "precision": 20}	Danish Krone	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
dop	RD$	RD$	2	0	{"value": "0", "precision": 20}	Dominican Peso	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
dzd	DA	د.ج.‏	2	0	{"value": "0", "precision": 20}	Algerian Dinar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
eek	Ekr	kr	2	0	{"value": "0", "precision": 20}	Estonian Kroon	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
egp	EGP	ج.م.‏	2	0	{"value": "0", "precision": 20}	Egyptian Pound	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
ern	Nfk	Nfk	2	0	{"value": "0", "precision": 20}	Eritrean Nakfa	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
etb	Br	Br	2	0	{"value": "0", "precision": 20}	Ethiopian Birr	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
gbp	£	£	2	0	{"value": "0", "precision": 20}	British Pound Sterling	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
gel	GEL	GEL	2	0	{"value": "0", "precision": 20}	Georgian Lari	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
ghs	GH₵	GH₵	2	0	{"value": "0", "precision": 20}	Ghanaian Cedi	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
gnf	FG	FG	0	0	{"value": "0", "precision": 20}	Guinean Franc	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
gtq	GTQ	Q	2	0	{"value": "0", "precision": 20}	Guatemalan Quetzal	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
hkd	HK$	$	2	0	{"value": "0", "precision": 20}	Hong Kong Dollar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
hnl	HNL	L	2	0	{"value": "0", "precision": 20}	Honduran Lempira	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
hrk	kn	kn	2	0	{"value": "0", "precision": 20}	Croatian Kuna	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
huf	Ft	Ft	0	0	{"value": "0", "precision": 20}	Hungarian Forint	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
idr	Rp	Rp	0	0	{"value": "0", "precision": 20}	Indonesian Rupiah	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
ils	₪	₪	2	0	{"value": "0", "precision": 20}	Israeli New Sheqel	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
inr	Rs	₹	2	0	{"value": "0", "precision": 20}	Indian Rupee	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
iqd	IQD	د.ع.‏	0	0	{"value": "0", "precision": 20}	Iraqi Dinar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
irr	IRR	﷼	0	0	{"value": "0", "precision": 20}	Iranian Rial	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
isk	Ikr	kr	0	0	{"value": "0", "precision": 20}	Icelandic Króna	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
jmd	J$	$	2	0	{"value": "0", "precision": 20}	Jamaican Dollar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
jod	JD	د.أ.‏	3	0	{"value": "0", "precision": 20}	Jordanian Dinar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
jpy	¥	￥	0	0	{"value": "0", "precision": 20}	Japanese Yen	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
kes	Ksh	Ksh	2	0	{"value": "0", "precision": 20}	Kenyan Shilling	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
khr	KHR	៛	2	0	{"value": "0", "precision": 20}	Cambodian Riel	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
kmf	CF	FC	0	0	{"value": "0", "precision": 20}	Comorian Franc	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
krw	₩	₩	0	0	{"value": "0", "precision": 20}	South Korean Won	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
kwd	KD	د.ك.‏	3	0	{"value": "0", "precision": 20}	Kuwaiti Dinar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
kzt	KZT	тңг.	2	0	{"value": "0", "precision": 20}	Kazakhstani Tenge	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
lbp	LB£	ل.ل.‏	0	0	{"value": "0", "precision": 20}	Lebanese Pound	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
lkr	SLRs	SL Re	2	0	{"value": "0", "precision": 20}	Sri Lankan Rupee	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
ltl	Lt	Lt	2	0	{"value": "0", "precision": 20}	Lithuanian Litas	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
lvl	Ls	Ls	2	0	{"value": "0", "precision": 20}	Latvian Lats	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
lyd	LD	د.ل.‏	3	0	{"value": "0", "precision": 20}	Libyan Dinar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mad	MAD	د.م.‏	2	0	{"value": "0", "precision": 20}	Moroccan Dirham	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mdl	MDL	MDL	2	0	{"value": "0", "precision": 20}	Moldovan Leu	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mga	MGA	MGA	0	0	{"value": "0", "precision": 20}	Malagasy Ariary	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mkd	MKD	MKD	2	0	{"value": "0", "precision": 20}	Macedonian Denar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mmk	MMK	K	0	0	{"value": "0", "precision": 20}	Myanma Kyat	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mnt	MNT	₮	0	0	{"value": "0", "precision": 20}	Mongolian Tugrig	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mop	MOP$	MOP$	2	0	{"value": "0", "precision": 20}	Macanese Pataca	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mur	MURs	MURs	0	0	{"value": "0", "precision": 20}	Mauritian Rupee	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mwk	K	K	2	0	{"value": "0", "precision": 20}	Malawian Kwacha	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mxn	MX$	$	2	0	{"value": "0", "precision": 20}	Mexican Peso	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
myr	RM	RM	2	0	{"value": "0", "precision": 20}	Malaysian Ringgit	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
mzn	MTn	MTn	2	0	{"value": "0", "precision": 20}	Mozambican Metical	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
nad	N$	N$	2	0	{"value": "0", "precision": 20}	Namibian Dollar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
ngn	₦	₦	2	0	{"value": "0", "precision": 20}	Nigerian Naira	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
nio	C$	C$	2	0	{"value": "0", "precision": 20}	Nicaraguan Córdoba	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
nok	Nkr	kr	2	0	{"value": "0", "precision": 20}	Norwegian Krone	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
npr	NPRs	नेरू	2	0	{"value": "0", "precision": 20}	Nepalese Rupee	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
nzd	NZ$	$	2	0	{"value": "0", "precision": 20}	New Zealand Dollar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
omr	OMR	ر.ع.‏	3	0	{"value": "0", "precision": 20}	Omani Rial	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
pab	B/.	B/.	2	0	{"value": "0", "precision": 20}	Panamanian Balboa	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
pen	S/.	S/.	2	0	{"value": "0", "precision": 20}	Peruvian Nuevo Sol	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
php	₱	₱	2	0	{"value": "0", "precision": 20}	Philippine Peso	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
pkr	PKRs	₨	0	0	{"value": "0", "precision": 20}	Pakistani Rupee	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
pln	zł	zł	2	0	{"value": "0", "precision": 20}	Polish Zloty	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
pyg	₲	₲	0	0	{"value": "0", "precision": 20}	Paraguayan Guarani	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
qar	QR	ر.ق.‏	2	0	{"value": "0", "precision": 20}	Qatari Rial	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
ron	RON	RON	2	0	{"value": "0", "precision": 20}	Romanian Leu	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
rsd	din.	дин.	0	0	{"value": "0", "precision": 20}	Serbian Dinar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
rub	RUB	₽.	2	0	{"value": "0", "precision": 20}	Russian Ruble	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
rwf	RWF	FR	0	0	{"value": "0", "precision": 20}	Rwandan Franc	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
sar	SR	ر.س.‏	2	0	{"value": "0", "precision": 20}	Saudi Riyal	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
sdg	SDG	SDG	2	0	{"value": "0", "precision": 20}	Sudanese Pound	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
sek	Skr	kr	2	0	{"value": "0", "precision": 20}	Swedish Krona	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
sgd	S$	$	2	0	{"value": "0", "precision": 20}	Singapore Dollar	2026-01-14 07:22:56.465+00	2026-01-14 07:22:56.465+00	\N
sos	Ssh	Ssh	0	0	{"value": "0", "precision": 20}	Somali Shilling	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
syp	SY£	ل.س.‏	0	0	{"value": "0", "precision": 20}	Syrian Pound	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
thb	฿	฿	2	0	{"value": "0", "precision": 20}	Thai Baht	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
tnd	DT	د.ت.‏	3	0	{"value": "0", "precision": 20}	Tunisian Dinar	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
top	T$	T$	2	0	{"value": "0", "precision": 20}	Tongan Paʻanga	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
tjs	TJS	с.	2	0	{"value": "0", "precision": 20}	Tajikistani Somoni	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
try	₺	₺	2	0	{"value": "0", "precision": 20}	Turkish Lira	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
ttd	TT$	$	2	0	{"value": "0", "precision": 20}	Trinidad and Tobago Dollar	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
twd	NT$	NT$	2	0	{"value": "0", "precision": 20}	New Taiwan Dollar	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
tzs	TSh	TSh	0	0	{"value": "0", "precision": 20}	Tanzanian Shilling	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
uah	₴	₴	2	0	{"value": "0", "precision": 20}	Ukrainian Hryvnia	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
ugx	USh	USh	0	0	{"value": "0", "precision": 20}	Ugandan Shilling	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
uyu	$U	$	2	0	{"value": "0", "precision": 20}	Uruguayan Peso	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
uzs	UZS	UZS	0	0	{"value": "0", "precision": 20}	Uzbekistan Som	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
vef	Bs.F.	Bs.F.	2	0	{"value": "0", "precision": 20}	Venezuelan Bolívar	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
vnd	₫	₫	0	0	{"value": "0", "precision": 20}	Vietnamese Dong	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
xaf	FCFA	FCFA	0	0	{"value": "0", "precision": 20}	CFA Franc BEAC	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
xof	CFA	CFA	0	0	{"value": "0", "precision": 20}	CFA Franc BCEAO	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
xpf	₣	₣	0	0	{"value": "0", "precision": 20}	CFP Franc	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
yer	YR	ر.ي.‏	0	0	{"value": "0", "precision": 20}	Yemeni Rial	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
zar	R	R	2	0	{"value": "0", "precision": 20}	South African Rand	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
zmk	ZK	ZK	0	0	{"value": "0", "precision": 20}	Zambian Kwacha	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
zwl	ZWL$	ZWL$	0	0	{"value": "0", "precision": 20}	Zimbabwean Dollar	2026-01-14 07:22:56.466+00	2026-01-14 07:22:56.466+00	\N
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, company_name, first_name, last_name, email, phone, has_account, metadata, created_at, updated_at, deleted_at, created_by) FROM stdin;
cus_01KFMEXPEPZKS3K3D6CACQ5MVX	Handmade Company	Peter	Chan	peter.chan@handmade.com	85291239123	t	\N	2026-01-23 03:38:46.102+00	2026-01-23 03:38:46.102+00	\N	\N
cus_01KFMJM9KTPNZX06CJ2HZ7CYM1		David	Yuen	david@handmade.com	85291239124	t	\N	2026-01-23 04:43:32.346+00	2026-01-23 04:43:32.346+00	\N	\N
\.


--
-- Data for Name: customer_account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_account_holder (customer_id, account_holder_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_address (id, customer_id, address_name, is_default_shipping, is_default_billing, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group (id, name, metadata, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group_customer (id, customer_id, customer_group_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment (id, location_id, packed_at, shipped_at, delivered_at, canceled_at, data, provider_id, shipping_option_id, metadata, delivery_address_id, created_at, updated_at, deleted_at, marked_shipped_by, created_by, requires_shipping) FROM stdin;
\.


--
-- Data for Name: fulfillment_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_address (id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_item (id, title, sku, barcode, quantity, raw_quantity, line_item_id, inventory_item_id, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_label (id, tracking_number, tracking_url, label_url, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
manual_manual	t	2026-01-14 07:22:56.526+00	2026-01-14 07:22:56.526+00	\N
\.


--
-- Data for Name: fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_set (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
fuset_01KEXP5SHQCTX37AQFF199TDE2	European Warehouse delivery	shipping	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
\.


--
-- Data for Name: geo_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geo_zone (id, type, country_code, province_code, city, service_zone_id, postal_expression, metadata, created_at, updated_at, deleted_at) FROM stdin;
fgz_01KEXP5SHQ4VDR437TT88QF2CQ	country	gb	\N	\N	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	\N	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
fgz_01KEXP5SHQ8R9RK27XQB3HPDVR	country	de	\N	\N	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	\N	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
fgz_01KEXP5SHQR3DB7ZKS9YADWGYJ	country	dk	\N	\N	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	\N	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
fgz_01KEXP5SHQX0Y14A0HXN6G0294	country	se	\N	\N	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	\N	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
fgz_01KEXP5SHQT01S4H9YNWDND8QY	country	fr	\N	\N	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	\N	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
fgz_01KEXP5SHQP3ZDN2GC8P90VJ6T	country	es	\N	\N	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	\N	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
fgz_01KEXP5SHQ5NR9A741AAFAYM3P	country	it	\N	\N	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	\N	\N	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image (id, url, metadata, created_at, updated_at, deleted_at, rank, product_id) FROM stdin;
img_01KEXP5SM75NK76FVQYQBE98FY	https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196
img_01KEXP5SM7SSQMEQKFV5VSMX0F	https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	1	prod_01KEXP5SM5RRMY6D3MYZW6Z196
img_01KEXP5SM7X3MMTZ3RX2Z8ABKA	https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	2	prod_01KEXP5SM5RRMY6D3MYZW6Z196
img_01KEXP5SM7KY6X1E2EFRR7YEK1	https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	3	prod_01KEXP5SM5RRMY6D3MYZW6Z196
img_01KEXP5SM8KHVXY6RZ71X25BBJ	https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	0	prod_01KEXP5SM6KACCKTJJZY65RPWW
img_01KEXP5SM8GT370ERP0GTHVG72	https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	1	prod_01KEXP5SM6KACCKTJJZY65RPWW
img_01KEXP5SM8C0SJH636A19J07GM	https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	0	prod_01KEXP5SM60G3EXBA2FB86C4G9
img_01KEXP5SM89TWNH0J1FFFXF1Q5	https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	1	prod_01KEXP5SM60G3EXBA2FB86C4G9
img_01KEXP5SM9P4SDJ6R4WCFHGDH9	https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	0	prod_01KEXP5SM6N24680BAA32FX71Y
img_01KEXP5SM9BC0PCX72GV276ZQD	https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	1	prod_01KEXP5SM6N24680BAA32FX71Y
img_01KFMA7634HVJTA0VMB30CVGNH	http://localhost:9000/static/1769134594136-product-1.webp	\N	2026-01-23 02:16:34.149+00	2026-01-23 02:16:34.149+00	\N	0	prod_01KFMA7633M0GS3YF54WQWK8V5
wgiaje	http://localhost:9000/static/1770865366898-6684b266aa256d0022d5a012-01.webp	\N	2026-02-12 03:02:47.034+00	2026-02-12 03:02:47.035+00	\N	0	prod_01KH5AEZE0APZ33X6WEET8PT9J
9zah7	http://localhost:9000/static/1770791470611-6684b266aa256d0022d5a012-02.webp	\N	2026-02-11 06:31:10.637+00	2026-02-12 03:02:47.036+00	\N	1	prod_01KH5AEZE0APZ33X6WEET8PT9J
\.


--
-- Data for Name: inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_item (id, created_at, updated_at, deleted_at, sku, origin_country, hs_code, mid_code, material, weight, length, height, width, requires_shipping, description, title, thumbnail, metadata) FROM stdin;
iitem_01KEXP5SP6SGFCC9FT7VQWZ7XZ	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-S-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	S / Black	S / Black	\N	\N
iitem_01KEXP5SP6TTB9E91259EN77P5	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-S-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	S / White	S / White	\N	\N
iitem_01KEXP5SP6XQR3K1JGGS32YRKD	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-M-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	M / Black	M / Black	\N	\N
iitem_01KEXP5SP6QYBCSZJH1A4JB3M9	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-M-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	M / White	M / White	\N	\N
iitem_01KEXP5SP6BQ44JK9JNK9MVESK	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-L-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	L / Black	L / Black	\N	\N
iitem_01KEXP5SP6JHZVYS0MDA8W61WP	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-L-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	L / White	L / White	\N	\N
iitem_01KEXP5SP67Q5NMJFSPB1TJ23V	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-XL-BLACK	\N	\N	\N	\N	\N	\N	\N	\N	t	XL / Black	XL / Black	\N	\N
iitem_01KEXP5SP6YZ3SC3ASCJGZX3AQ	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SHIRT-XL-WHITE	\N	\N	\N	\N	\N	\N	\N	\N	t	XL / White	XL / White	\N	\N
iitem_01KEXP5SP6KCZT1MXP3GTW9KAV	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SWEATSHIRT-S	\N	\N	\N	\N	\N	\N	\N	\N	t	S	S	\N	\N
iitem_01KEXP5SP74FQNTCPNPB01RMC2	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SWEATSHIRT-M	\N	\N	\N	\N	\N	\N	\N	\N	t	M	M	\N	\N
iitem_01KEXP5SP7MSSW8H3SBRW711E5	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SWEATSHIRT-L	\N	\N	\N	\N	\N	\N	\N	\N	t	L	L	\N	\N
iitem_01KEXP5SP7YT7T3P7AGY16GFTS	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SWEATSHIRT-XL	\N	\N	\N	\N	\N	\N	\N	\N	t	XL	XL	\N	\N
iitem_01KEXP5SP7EA6SH1VC1G01RMVJ	2026-01-14 07:22:59.655+00	2026-01-14 07:22:59.655+00	\N	SWEATPANTS-S	\N	\N	\N	\N	\N	\N	\N	\N	t	S	S	\N	\N
iitem_01KEXP5SP7WTQHWZNK07CFGKCW	2026-01-14 07:22:59.656+00	2026-01-14 07:22:59.656+00	\N	SWEATPANTS-M	\N	\N	\N	\N	\N	\N	\N	\N	t	M	M	\N	\N
iitem_01KEXP5SP7TWT2T7X4DQJCF2K9	2026-01-14 07:22:59.656+00	2026-01-14 07:22:59.656+00	\N	SWEATPANTS-L	\N	\N	\N	\N	\N	\N	\N	\N	t	L	L	\N	\N
iitem_01KEXP5SP7AZ3NB3DSAM0VGRCH	2026-01-14 07:22:59.656+00	2026-01-14 07:22:59.656+00	\N	SWEATPANTS-XL	\N	\N	\N	\N	\N	\N	\N	\N	t	XL	XL	\N	\N
iitem_01KEXP5SP772WRKW5GBQQGC5SP	2026-01-14 07:22:59.656+00	2026-01-14 07:22:59.656+00	\N	SHORTS-S	\N	\N	\N	\N	\N	\N	\N	\N	t	S	S	\N	\N
iitem_01KEXP5SP7DSMS3WKBQB87MZP5	2026-01-14 07:22:59.656+00	2026-01-14 07:22:59.656+00	\N	SHORTS-M	\N	\N	\N	\N	\N	\N	\N	\N	t	M	M	\N	\N
iitem_01KEXP5SP7QFKHCCMQ3QD6C5K2	2026-01-14 07:22:59.656+00	2026-01-14 07:22:59.656+00	\N	SHORTS-L	\N	\N	\N	\N	\N	\N	\N	\N	t	L	L	\N	\N
iitem_01KEXP5SP7HPZ8P26Q13P58MKM	2026-01-14 07:22:59.656+00	2026-01-14 07:22:59.656+00	\N	SHORTS-XL	\N	\N	\N	\N	\N	\N	\N	\N	t	XL	XL	\N	\N
\.


--
-- Data for Name: inventory_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_level (id, created_at, updated_at, deleted_at, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, metadata, raw_stocked_quantity, raw_reserved_quantity, raw_incoming_quantity) FROM stdin;
ilev_01KEXP5SSJE5H1T59V5VEADP5Q	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP67Q5NMJFSPB1TJ23V	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJJCQFGZ103ZJQSQG4	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6BQ44JK9JNK9MVESK	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJKYRG0BF14AFF8V0F	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6JHZVYS0MDA8W61WP	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJQDPT1J09D0E6G18E	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6KCZT1MXP3GTW9KAV	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJFCNT8HAV26X8HMK2	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6QYBCSZJH1A4JB3M9	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJTBWKW5ANQB7C7JZH	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6SGFCC9FT7VQWZ7XZ	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJ7PM49ZQJBY9WDW59	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6TTB9E91259EN77P5	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJ2424EKGBG6N8H4E5	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6XQR3K1JGGS32YRKD	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJ9X2JPDENWPCZ5J0K	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP6YZ3SC3ASCJGZX3AQ	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJJM6KMBQYCTPH06D7	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP74FQNTCPNPB01RMC2	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJEKJ5RQYSGVT68PFY	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP772WRKW5GBQQGC5SP	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSJXTJG6MG9N0GW8S66	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP7AZ3NB3DSAM0VGRCH	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSKRW1R7DG3R6KNYSF9	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP7DSMS3WKBQB87MZP5	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSK1C3H2966RCCSM504	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP7EA6SH1VC1G01RMVJ	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSK7JN22QRD27VKTWNH	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP7HPZ8P26Q13P58MKM	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSK812MB7AEB49GMZ1Y	2026-01-14 07:22:59.763+00	2026-01-14 07:22:59.763+00	\N	iitem_01KEXP5SP7MSSW8H3SBRW711E5	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSKG0KK8AZK6MWDZPKX	2026-01-14 07:22:59.764+00	2026-01-14 07:22:59.764+00	\N	iitem_01KEXP5SP7QFKHCCMQ3QD6C5K2	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSKYNHX5FEN5M3EHYY7	2026-01-14 07:22:59.764+00	2026-01-14 07:22:59.764+00	\N	iitem_01KEXP5SP7TWT2T7X4DQJCF2K9	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSKQBVH2Y0YBRT3PN7K	2026-01-14 07:22:59.764+00	2026-01-14 07:22:59.764+00	\N	iitem_01KEXP5SP7WTQHWZNK07CFGKCW	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KEXP5SSK2FN51M2MHENQT8YN	2026-01-14 07:22:59.764+00	2026-01-14 07:22:59.764+00	\N	iitem_01KEXP5SP7YT7T3P7AGY16GFTS	sloc_01KEXP5SH53F9HTRK7BG7P16N7	1000000	0	0	\N	{"value": "1000000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
\.


--
-- Data for Name: invite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite (id, email, accepted, token, expires_at, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: link_module_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.link_module_migrations (id, table_name, link_descriptor, created_at) FROM stdin;
1	cart_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "cart", "fromModule": "cart"}	2026-01-14 07:22:55.162987
2	cart_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "cart", "fromModule": "cart"}	2026-01-14 07:22:55.173901
3	customer_account_holder	{"toModel": "account_holder", "toModule": "payment", "fromModel": "customer", "fromModule": "customer"}	2026-01-14 07:22:55.185755
4	location_fulfillment_provider	{"toModel": "fulfillment_provider", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-01-14 07:22:55.192542
5	location_fulfillment_set	{"toModel": "fulfillment_set", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-01-14 07:22:55.199167
6	order_cart	{"toModel": "cart", "toModule": "cart", "fromModel": "order", "fromModule": "order"}	2026-01-14 07:22:55.206747
7	order_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "order", "fromModule": "order"}	2026-01-14 07:22:55.214571
8	order_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "order", "fromModule": "order"}	2026-01-14 07:22:55.222712
9	order_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "order", "fromModule": "order"}	2026-01-14 07:22:55.229458
10	return_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "return", "fromModule": "order"}	2026-01-14 07:22:55.238949
11	product_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "product", "fromModule": "product"}	2026-01-14 07:22:55.245702
12	product_shipping_profile	{"toModel": "shipping_profile", "toModule": "fulfillment", "fromModel": "product", "fromModule": "product"}	2026-01-14 07:22:55.253193
13	product_variant_inventory_item	{"toModel": "inventory", "toModule": "inventory", "fromModel": "variant", "fromModule": "product"}	2026-01-14 07:22:55.264318
14	product_variant_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "variant", "fromModule": "product"}	2026-01-14 07:22:55.271245
15	publishable_api_key_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "api_key", "fromModule": "api_key"}	2026-01-14 07:22:55.280712
16	region_payment_provider	{"toModel": "payment_provider", "toModule": "payment", "fromModel": "region", "fromModule": "region"}	2026-01-14 07:22:55.286831
17	sales_channel_stock_location	{"toModel": "location", "toModule": "stock_location", "fromModel": "sales_channel", "fromModule": "sales_channel"}	2026-01-14 07:22:55.295008
18	shipping_option_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "shipping_option", "fromModule": "fulfillment"}	2026-01-14 07:22:55.301241
19	user_rbac_role	{"toModel": "rbac_role", "toModule": "rbac", "fromModel": "user", "fromModule": "user"}	2026-01-14 07:22:55.307392
210	product_product_brand_brand	{"toModel": "brand", "toModule": "brand", "fromModel": "product", "fromModule": "product"}	2026-01-19 06:04:03.31304
1451	product_product_category_categoryimage_category_image	{"toModel": "category_image", "toModule": "categoryImage", "fromModel": "product_category", "fromModule": "product"}	2026-02-16 08:28:40.204304
\.


--
-- Data for Name: locale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locale (id, code, name, created_at, updated_at, deleted_at) FROM stdin;
loc_01KFYN5RJSDV420ETMVZ80Y2PJ	en-US	English (United States)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS1ZDN48B1M9BXKTW7	en-GB	English (United Kingdom)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSSR1E8A7EN1SABFS4	en-AU	English (Australia)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS88TMDAAT56Q8CX20	en-CA	English (Canada)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS5XQFJ3RV5J9XK2QW	es-ES	Spanish (Spain)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS9KRWS6HY635QEK0A	es-MX	Spanish (Mexico)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS0DG880WN16JY3CD2	es-AR	Spanish (Argentina)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSVD3AR2DPAT7QRYQT	fr-FR	French (France)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS5VY4CYCC59EJTN9H	fr-CA	French (Canada)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSQX2E9MP65QCH6CGA	fr-BE	French (Belgium)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS52NH2MZJ0HWH78J6	de-DE	German (Germany)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSVZ5QE4FCQ01C2XGC	de-AT	German (Austria)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS5RR09HCF63MGH4XX	de-CH	German (Switzerland)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS05FNSR2F125260D5	it-IT	Italian (Italy)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSNAMGXSBCNC9HDDRT	pt-BR	Portuguese (Brazil)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS282DGVZ8DVSZCT92	pt-PT	Portuguese (Portugal)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSR4BHRMXAKQ3R8CK1	nl-NL	Dutch (Netherlands)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSJ2WRH0RHFZQR5R1D	nl-BE	Dutch (Belgium)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSREJMBWA3FYYX3WK5	da-DK	Danish (Denmark)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSDEJ0F5HT5CQV1ZTZ	sv-SE	Swedish (Sweden)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSG5ZX571J3SBH0JV6	nb-NO	Norwegian Bokmål (Norway)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSZ9YYENK43M61FEHM	fi-FI	Finnish (Finland)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSJZ9ZB300CYDXJ04D	pl-PL	Polish (Poland)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSP02RN7WSJTKN6XNP	cs-CZ	Czech (Czech Republic)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJS1PYA0P3KPX4SQJ0Z	sk-SK	Slovak (Slovakia)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJSFXMGE14Y9W0PP87E	hu-HU	Hungarian (Hungary)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTDXYGQHTY19ETJT4J	ro-RO	Romanian (Romania)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTBBYHJ6095D6Z8HJV	bg-BG	Bulgarian (Bulgaria)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT4SB89NM808H7RYWE	el-GR	Greek (Greece)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTFRSN8X15DVD0AGV2	tr-TR	Turkish (Turkey)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTD4CWRXNV0QBWZKEA	ru-RU	Russian (Russia)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT53BDW5J9Z6TE0QGS	uk-UA	Ukrainian (Ukraine)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT141G2WRC11VRNHVD	ar-SA	Arabic (Saudi Arabia)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTV07M3718D811WJ00	ar-AE	Arabic (United Arab Emirates)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTSBECSSZ2Y4WAGV9A	ar-EG	Arabic (Egypt)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTV6DB9VWC4045V3VS	he-IL	Hebrew (Israel)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTMMVTKXS9K5D54QM2	hi-IN	Hindi (India)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTSTVZSDHATJ07P501	bn-BD	Bengali (Bangladesh)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTP0Y89FG096AYA9Q2	th-TH	Thai (Thailand)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTPKQNRQ753237KMWB	vi-VN	Vietnamese (Vietnam)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT1DS79HZ9QDRSVWDW	id-ID	Indonesian (Indonesia)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT8CXW3KGD8JPBCMSW	ms-MY	Malay (Malaysia)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT9JBVT7S0SK722EFS	tl-PH	Tagalog (Philippines)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT2FM5Z89NTM0J605H	zh-CN	Chinese Simplified (China)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTHXZV6PR4KBH1SJAT	zh-TW	Chinese Traditional (Taiwan)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT6CFJZ9AN77T2VXW8	zh-HK	Chinese Traditional (Hong Kong)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTCQ4H4W6EGY9VEMMT	ja-JP	Japanese (Japan)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJT6ZQK9X3PCCM47C1M	ko-KR	Korean (South Korea)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFYN5RJTPHED0VGBMVEV3BK6	ka-GE	Georgian (Georgia)	2026-01-27 02:40:26.202+00	2026-01-27 02:40:26.202+00	\N
loc_01KFZ9RD65ZGVDM7A3RTXV6B8X	lt-LT	Lithuanian (Lithuania)	2026-01-27 08:40:08.645+00	2026-01-27 08:40:08.645+00	\N
loc_01KFZ9RD65B6YJCSH3XSE91C39	mn-MN	Mongolian (Mongolia)	2026-01-27 08:40:08.646+00	2026-01-27 08:40:08.646+00	\N
\.


--
-- Data for Name: location_fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_provider (stock_location_id, fulfillment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KEXP5SH53F9HTRK7BG7P16N7	manual_manual	locfp_01KEXP5SHGQ2JF6PBE4N2E0TNJ	2026-01-14 07:22:59.504364+00	2026-01-14 07:22:59.504364+00	\N
\.


--
-- Data for Name: location_fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_set (stock_location_id, fulfillment_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KEXP5SH53F9HTRK7BG7P16N7	fuset_01KEXP5SHQCTX37AQFF199TDE2	locfs_01KEXP5SHZ324AT3RVH1F1BFNY	2026-01-14 07:22:59.518782+00	2026-01-14 07:22:59.518782+00	\N
\.


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20240307161216	2026-01-14 07:22:52.474884+00
2	Migration20241210073813	2026-01-14 07:22:52.474884+00
3	Migration20250106142624	2026-01-14 07:22:52.474884+00
4	Migration20250120110820	2026-01-14 07:22:52.474884+00
5	Migration20240307132720	2026-01-14 07:22:52.547441+00
6	Migration20240719123015	2026-01-14 07:22:52.547441+00
7	Migration20241213063611	2026-01-14 07:22:52.547441+00
8	Migration20251010131115	2026-01-14 07:22:52.547441+00
9	InitialSetup20240401153642	2026-01-14 07:22:52.643445+00
10	Migration20240601111544	2026-01-14 07:22:52.643445+00
11	Migration202408271511	2026-01-14 07:22:52.643445+00
12	Migration20241122120331	2026-01-14 07:22:52.643445+00
13	Migration20241125090957	2026-01-14 07:22:52.643445+00
14	Migration20250411073236	2026-01-14 07:22:52.643445+00
15	Migration20250516081326	2026-01-14 07:22:52.643445+00
16	Migration20250910154539	2026-01-14 07:22:52.643445+00
17	Migration20250911092221	2026-01-14 07:22:52.643445+00
18	Migration20250929204438	2026-01-14 07:22:52.643445+00
19	Migration20251008132218	2026-01-14 07:22:52.643445+00
20	Migration20251011090511	2026-01-14 07:22:52.643445+00
21	Migration20230929122253	2026-01-14 07:22:52.874339+00
22	Migration20240322094407	2026-01-14 07:22:52.874339+00
23	Migration20240322113359	2026-01-14 07:22:52.874339+00
24	Migration20240322120125	2026-01-14 07:22:52.874339+00
25	Migration20240626133555	2026-01-14 07:22:52.874339+00
26	Migration20240704094505	2026-01-14 07:22:52.874339+00
27	Migration20241127114534	2026-01-14 07:22:52.874339+00
28	Migration20241127223829	2026-01-14 07:22:52.874339+00
29	Migration20241128055359	2026-01-14 07:22:52.874339+00
30	Migration20241212190401	2026-01-14 07:22:52.874339+00
31	Migration20250408145122	2026-01-14 07:22:52.874339+00
32	Migration20250409122219	2026-01-14 07:22:52.874339+00
33	Migration20251009110625	2026-01-14 07:22:52.874339+00
34	Migration20251112192723	2026-01-14 07:22:52.874339+00
35	Migration20240227120221	2026-01-14 07:22:53.063588+00
36	Migration20240617102917	2026-01-14 07:22:53.063588+00
37	Migration20240624153824	2026-01-14 07:22:53.063588+00
38	Migration20241211061114	2026-01-14 07:22:53.063588+00
39	Migration20250113094144	2026-01-14 07:22:53.063588+00
40	Migration20250120110700	2026-01-14 07:22:53.063588+00
41	Migration20250226130616	2026-01-14 07:22:53.063588+00
42	Migration20250508081510	2026-01-14 07:22:53.063588+00
43	Migration20250828075407	2026-01-14 07:22:53.063588+00
44	Migration20250909083125	2026-01-14 07:22:53.063588+00
45	Migration20250916120552	2026-01-14 07:22:53.063588+00
46	Migration20250917143818	2026-01-14 07:22:53.063588+00
47	Migration20250919122137	2026-01-14 07:22:53.063588+00
48	Migration20251006000000	2026-01-14 07:22:53.063588+00
49	Migration20251015113934	2026-01-14 07:22:53.063588+00
50	Migration20251107050148	2026-01-14 07:22:53.063588+00
51	Migration20240124154000	2026-01-14 07:22:53.245446+00
52	Migration20240524123112	2026-01-14 07:22:53.245446+00
53	Migration20240602110946	2026-01-14 07:22:53.245446+00
54	Migration20241211074630	2026-01-14 07:22:53.245446+00
55	Migration20251010130829	2026-01-14 07:22:53.245446+00
56	Migration20240115152146	2026-01-14 07:22:53.310831+00
57	Migration20240222170223	2026-01-14 07:22:53.336437+00
58	Migration20240831125857	2026-01-14 07:22:53.336437+00
59	Migration20241106085918	2026-01-14 07:22:53.336437+00
60	Migration20241205095237	2026-01-14 07:22:53.336437+00
61	Migration20241216183049	2026-01-14 07:22:53.336437+00
62	Migration20241218091938	2026-01-14 07:22:53.336437+00
63	Migration20250120115059	2026-01-14 07:22:53.336437+00
64	Migration20250212131240	2026-01-14 07:22:53.336437+00
65	Migration20250326151602	2026-01-14 07:22:53.336437+00
66	Migration20250508081553	2026-01-14 07:22:53.336437+00
67	Migration20251017153909	2026-01-14 07:22:53.336437+00
68	Migration20251208130704	2026-01-14 07:22:53.336437+00
69	Migration20240205173216	2026-01-14 07:22:53.484411+00
70	Migration20240624200006	2026-01-14 07:22:53.484411+00
71	Migration20250120110744	2026-01-14 07:22:53.484411+00
72	InitialSetup20240221144943	2026-01-14 07:22:53.538479+00
73	Migration20240604080145	2026-01-14 07:22:53.538479+00
74	Migration20241205122700	2026-01-14 07:22:53.538479+00
75	Migration20251015123842	2026-01-14 07:22:53.538479+00
76	InitialSetup20240227075933	2026-01-14 07:22:53.574652+00
77	Migration20240621145944	2026-01-14 07:22:53.574652+00
78	Migration20241206083313	2026-01-14 07:22:53.574652+00
79	Migration20251202184737	2026-01-14 07:22:53.574652+00
80	Migration20251212161429	2026-01-14 07:22:53.574652+00
81	Migration20240227090331	2026-01-14 07:22:53.625265+00
82	Migration20240710135844	2026-01-14 07:22:53.625265+00
83	Migration20240924114005	2026-01-14 07:22:53.625265+00
84	Migration20241212052837	2026-01-14 07:22:53.625265+00
85	InitialSetup20240228133303	2026-01-14 07:22:53.694879+00
86	Migration20240624082354	2026-01-14 07:22:53.694879+00
87	Migration20240225134525	2026-01-14 07:22:53.725719+00
88	Migration20240806072619	2026-01-14 07:22:53.725719+00
89	Migration20241211151053	2026-01-14 07:22:53.725719+00
90	Migration20250115160517	2026-01-14 07:22:53.725719+00
91	Migration20250120110552	2026-01-14 07:22:53.725719+00
92	Migration20250123122334	2026-01-14 07:22:53.725719+00
93	Migration20250206105639	2026-01-14 07:22:53.725719+00
94	Migration20250207132723	2026-01-14 07:22:53.725719+00
95	Migration20250625084134	2026-01-14 07:22:53.725719+00
96	Migration20250924135437	2026-01-14 07:22:53.725719+00
97	Migration20250929124701	2026-01-14 07:22:53.725719+00
98	Migration20240219102530	2026-01-14 07:22:53.852854+00
99	Migration20240604100512	2026-01-14 07:22:53.852854+00
100	Migration20240715102100	2026-01-14 07:22:53.852854+00
101	Migration20240715174100	2026-01-14 07:22:53.852854+00
102	Migration20240716081800	2026-01-14 07:22:53.852854+00
103	Migration20240801085921	2026-01-14 07:22:53.852854+00
104	Migration20240821164505	2026-01-14 07:22:53.852854+00
105	Migration20240821170920	2026-01-14 07:22:53.852854+00
106	Migration20240827133639	2026-01-14 07:22:53.852854+00
107	Migration20240902195921	2026-01-14 07:22:53.852854+00
108	Migration20240913092514	2026-01-14 07:22:53.852854+00
109	Migration20240930122627	2026-01-14 07:22:53.852854+00
110	Migration20241014142943	2026-01-14 07:22:53.852854+00
111	Migration20241106085223	2026-01-14 07:22:53.852854+00
112	Migration20241129124827	2026-01-14 07:22:53.852854+00
113	Migration20241217162224	2026-01-14 07:22:53.852854+00
114	Migration20250326151554	2026-01-14 07:22:53.852854+00
115	Migration20250522181137	2026-01-14 07:22:53.852854+00
116	Migration20250702095353	2026-01-14 07:22:53.852854+00
117	Migration20250704120229	2026-01-14 07:22:53.852854+00
118	Migration20250910130000	2026-01-14 07:22:53.852854+00
119	Migration20251016160403	2026-01-14 07:22:53.852854+00
120	Migration20251016182939	2026-01-14 07:22:53.852854+00
121	Migration20251017155709	2026-01-14 07:22:53.852854+00
122	Migration20251114100559	2026-01-14 07:22:53.852854+00
123	Migration20251125164002	2026-01-14 07:22:53.852854+00
124	Migration20251210112909	2026-01-14 07:22:53.852854+00
125	Migration20251210112924	2026-01-14 07:22:53.852854+00
126	Migration20251225120947	2026-01-14 07:22:53.852854+00
127	Migration20250717162007	2026-01-14 07:22:54.259002+00
128	Migration20240205025928	2026-01-14 07:22:54.298373+00
129	Migration20240529080336	2026-01-14 07:22:54.298373+00
130	Migration20241202100304	2026-01-14 07:22:54.298373+00
131	Migration20240214033943	2026-01-14 07:22:54.387336+00
132	Migration20240703095850	2026-01-14 07:22:54.387336+00
133	Migration20241202103352	2026-01-14 07:22:54.387336+00
134	Migration20240311145700_InitialSetupMigration	2026-01-14 07:22:54.444277+00
135	Migration20240821170957	2026-01-14 07:22:54.444277+00
136	Migration20240917161003	2026-01-14 07:22:54.444277+00
137	Migration20241217110416	2026-01-14 07:22:54.444277+00
138	Migration20250113122235	2026-01-14 07:22:54.444277+00
139	Migration20250120115002	2026-01-14 07:22:54.444277+00
140	Migration20250822130931	2026-01-14 07:22:54.444277+00
141	Migration20250825132614	2026-01-14 07:22:54.444277+00
142	Migration20251114133146	2026-01-14 07:22:54.444277+00
143	Migration20240509083918_InitialSetupMigration	2026-01-14 07:22:54.62095+00
144	Migration20240628075401	2026-01-14 07:22:54.62095+00
145	Migration20240830094712	2026-01-14 07:22:54.62095+00
146	Migration20250120110514	2026-01-14 07:22:54.62095+00
147	Migration20251028172715	2026-01-14 07:22:54.62095+00
148	Migration20251121123942	2026-01-14 07:22:54.62095+00
149	Migration20251121150408	2026-01-14 07:22:54.62095+00
150	Migration20231228143900	2026-01-14 07:22:54.743122+00
151	Migration20241206101446	2026-01-14 07:22:54.743122+00
152	Migration20250128174331	2026-01-14 07:22:54.743122+00
153	Migration20250505092459	2026-01-14 07:22:54.743122+00
154	Migration20250819104213	2026-01-14 07:22:54.743122+00
155	Migration20250819110924	2026-01-14 07:22:54.743122+00
156	Migration20250908080305	2026-01-14 07:22:54.743122+00
157	Migration20260119031945	2026-01-19 03:19:56.452544+00
158	Migration20251208124155	2026-01-27 02:40:24.833763+00
159	Migration20251215083927	2026-01-27 02:40:24.833763+00
160	Migration20251218140235	2026-01-27 02:40:24.833763+00
161	Migration20260108122757	2026-01-27 08:40:06.520719+00
162	Migration20260216082651	2026-02-16 08:28:39.706604+00
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, "to", channel, template, data, trigger_type, resource_id, resource_type, receiver_id, original_notification_id, idempotency_key, external_id, provider_id, created_at, updated_at, deleted_at, status, "from", provider_data) FROM stdin;
\.


--
-- Data for Name: notification_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_provider (id, handle, name, is_enabled, channels, created_at, updated_at, deleted_at) FROM stdin;
local	local	local	t	{feed}	2026-01-14 07:22:56.528+00	2026-01-14 07:22:56.528+00	\N
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, region_id, display_id, customer_id, version, sales_channel_id, status, is_draft_order, email, currency_code, shipping_address_id, billing_address_id, no_notification, metadata, created_at, updated_at, deleted_at, canceled_at, custom_display_id, locale) FROM stdin;
\.


--
-- Data for Name: order_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_cart (order_id, cart_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_change; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change (id, order_id, version, description, status, internal_note, created_by, requested_by, requested_at, confirmed_by, confirmed_at, declined_by, declined_reason, metadata, declined_at, canceled_by, canceled_at, created_at, updated_at, change_type, deleted_at, return_id, claim_id, exchange_id, carry_over_promotions) FROM stdin;
\.


--
-- Data for Name: order_change_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change_action (id, order_id, version, ordering, order_change_id, reference, reference_id, action, details, amount, raw_amount, internal_note, applied, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_claim; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim (id, order_id, return_id, order_version, display_id, type, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_claim_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item (id, claim_id, item_id, is_additional_item, reason, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_claim_item_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item_image (id, claim_item_id, url, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_credit_line (id, order_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at, version) FROM stdin;
\.


--
-- Data for Name: order_exchange; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange (id, order_id, return_id, order_version, display_id, no_notification, allow_backorder, difference_due, raw_difference_due, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_exchange_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange_item (id, exchange_id, item_id, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_fulfillment (order_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, order_id, version, item_id, quantity, raw_quantity, fulfilled_quantity, raw_fulfilled_quantity, shipped_quantity, raw_shipped_quantity, return_requested_quantity, raw_return_requested_quantity, return_received_quantity, raw_return_received_quantity, return_dismissed_quantity, raw_return_dismissed_quantity, written_off_quantity, raw_written_off_quantity, metadata, created_at, updated_at, deleted_at, delivered_quantity, raw_delivered_quantity, unit_price, raw_unit_price, compare_at_unit_price, raw_compare_at_unit_price) FROM stdin;
\.


--
-- Data for Name: order_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item (id, totals_id, title, subtitle, thumbnail, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, is_custom_price, product_type_id, is_giftcard) FROM stdin;
\.


--
-- Data for Name: order_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, item_id, deleted_at, is_tax_inclusive, version) FROM stdin;
\.


--
-- Data for Name: order_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, item_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_payment_collection (order_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_promotion (order_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping (id, order_id, version, shipping_method_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: order_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method (id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at, is_custom_amount) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_summary (id, order_id, version, totals, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_transaction (id, order_id, version, amount, raw_amount, currency_code, reference, reference_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (id, amount, raw_amount, currency_code, provider_id, data, created_at, updated_at, deleted_at, captured_at, canceled_at, payment_collection_id, payment_session_id, metadata) FROM stdin;
\.


--
-- Data for Name: payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection (id, currency_code, amount, raw_amount, authorized_amount, raw_authorized_amount, captured_amount, raw_captured_amount, refunded_amount, raw_refunded_amount, created_at, updated_at, deleted_at, completed_at, status, metadata) FROM stdin;
\.


--
-- Data for Name: payment_collection_payment_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection_payment_providers (payment_collection_id, payment_provider_id) FROM stdin;
\.


--
-- Data for Name: payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
pp_system_default	t	2026-01-14 07:22:56.524+00	2026-01-14 07:22:56.524+00	\N
\.


--
-- Data for Name: payment_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_session (id, currency_code, amount, raw_amount, provider_id, data, context, status, authorized_at, payment_collection_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price (id, title, price_set_id, currency_code, raw_amount, rules_count, created_at, updated_at, deleted_at, price_list_id, amount, min_quantity, max_quantity, raw_min_quantity, raw_max_quantity) FROM stdin;
price_01KEXP5SJVT7VVMV7DBRF7BNVJ	\N	pset_01KEXP5SJVKC9E9ECQ2PAPX9NF	usd	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SJVEYVJK8Y12GWZYMAQ	\N	pset_01KEXP5SJVKC9E9ECQ2PAPX9NF	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SJV5Y3PV7NDRXGXBN8W	\N	pset_01KEXP5SJVKC9E9ECQ2PAPX9NF	eur	{"value": "10", "precision": 20}	1	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SJV69GPDNK694M90J3G	\N	pset_01KEXP5SJVZSA5NNNBPF07DJFJ	usd	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SJVYJNVHDE4APRN7JH3	\N	pset_01KEXP5SJVZSA5NNNBPF07DJFJ	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SJVD4E4NSEHF8MVXZJJ	\N	pset_01KEXP5SJVZSA5NNNBPF07DJFJ	eur	{"value": "10", "precision": 20}	1	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQQ4E0X50SGZQBMNYA3	\N	pset_01KEXP5SQQY2F74NCVPW49R8R0	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQQJMSWPGQVW0ZXYCH2	\N	pset_01KEXP5SQQY2F74NCVPW49R8R0	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQRJC39BVJH4EHPR965	\N	pset_01KEXP5SQR6T559EZX7TEM77CK	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQRYGMKXMZWWY3967AY	\N	pset_01KEXP5SQR6T559EZX7TEM77CK	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQRCH2RAAY5NP5Q4YEB	\N	pset_01KEXP5SQR1285C8PXA15MGXZV	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQR699XS3C3C5HR2WQW	\N	pset_01KEXP5SQR1285C8PXA15MGXZV	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQRW78NZDVWMFZY1FEX	\N	pset_01KEXP5SQR3N1KFH30MCPG2FYP	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQRJMM6AG7W3ZA0DVQ8	\N	pset_01KEXP5SQR3N1KFH30MCPG2FYP	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQR9Q2Z6M47KPT2QM4X	\N	pset_01KEXP5SQSV58RSKAWGMB4FQ3C	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQRM4FR7WQNH8Z5RGCV	\N	pset_01KEXP5SQSV58RSKAWGMB4FQ3C	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQSG40JGMWD78RM6206	\N	pset_01KEXP5SQSF2DFDV334BAEJ230	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQSX09MSBZS69GJTMTP	\N	pset_01KEXP5SQSF2DFDV334BAEJ230	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQS5HXTB705F4TNRQTT	\N	pset_01KEXP5SQSJS1XKHWZ5QN4SFYG	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQSF1BN4VZWP40TCEPE	\N	pset_01KEXP5SQSJS1XKHWZ5QN4SFYG	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQSFBRKXWNFDDWT1R0P	\N	pset_01KEXP5SQSDXD8M5HAP6GBN7QJ	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQSTFJM8V0S2NHF8AVJ	\N	pset_01KEXP5SQSDXD8M5HAP6GBN7QJ	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQS40DKVJEE07R3YMGV	\N	pset_01KEXP5SQSS32YF2GAX1MHYSHH	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQS4TQ7H5NQXDR34XRC	\N	pset_01KEXP5SQSS32YF2GAX1MHYSHH	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQS507HVPR1R79D5KVZ	\N	pset_01KEXP5SQSVN77Y6ZWHCX2DJDX	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQSHP9GKXFN3SD80144	\N	pset_01KEXP5SQSVN77Y6ZWHCX2DJDX	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQSSP7BD2HJCEWV78MF	\N	pset_01KEXP5SQTR7ZGHJE1TX38ZTQN	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQT61261WJ8PE7DZ3QJ	\N	pset_01KEXP5SQTR7ZGHJE1TX38ZTQN	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQT80V2F8FF2MS96T39	\N	pset_01KEXP5SQTFTKXE0MYKFVE386E	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQTBHBCA0EF65HGRD4Q	\N	pset_01KEXP5SQTFTKXE0MYKFVE386E	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQTW3VBKCBHYZQPR6FH	\N	pset_01KEXP5SQT8YTHXMKYH1QKG2ZX	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQTWTQ1JCG6JDFWJBY7	\N	pset_01KEXP5SQT8YTHXMKYH1QKG2ZX	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQT4P52Y5REDHJ5NP8X	\N	pset_01KEXP5SQT3TG22WGD9HQ6B174	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQTCF3063WY8ECTKR5Q	\N	pset_01KEXP5SQT3TG22WGD9HQ6B174	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQT5W5HYYB2MRDTT7C0	\N	pset_01KEXP5SQTC3JMQ1VNPY82ERC1	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQTVTC879X8WVT67EZP	\N	pset_01KEXP5SQTC3JMQ1VNPY82ERC1	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQTP0090NM02SQY3V81	\N	pset_01KEXP5SQTNN5PAEYS6G228WGX	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQTP73P80B48BQR6MNS	\N	pset_01KEXP5SQTNN5PAEYS6G228WGX	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQTF08NZQC05WDAEPJ7	\N	pset_01KEXP5SQVZFBJYRTN2E78VRH7	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQTZKMAJMS5TVPAKCD5	\N	pset_01KEXP5SQVZFBJYRTN2E78VRH7	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQV969NR75NW56A2AEJ	\N	pset_01KEXP5SQV2NX1RKNZPCZ0PSZ7	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQVG287TYY4G1P4APC5	\N	pset_01KEXP5SQV2NX1RKNZPCZ0PSZ7	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQV9BAGHQC03BXFFJZN	\N	pset_01KEXP5SQV2HHREK4AWGHSGZ7J	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQVMS8F9YXN6FHPCSE3	\N	pset_01KEXP5SQV2HHREK4AWGHSGZ7J	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KEXP5SQVMN0AT3X0H5SQZVPF	\N	pset_01KEXP5SQVT71QXVQHNVSQE09R	eur	{"value": "10", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	10	\N	\N	\N	\N
price_01KEXP5SQVMXP68CNZAEM7MJ6A	\N	pset_01KEXP5SQVT71QXVQHNVSQE09R	usd	{"value": "15", "precision": 20}	0	2026-01-14 07:22:59.708+00	2026-01-14 07:22:59.708+00	\N	\N	15	\N	\N	\N	\N
price_01KFMBP4X8S2ZAT31NV1625HYJ	\N	pset_01KFMA764EBHT3X2ZDHMCF8EF1	hkd	{"value": "240", "precision": 20}	0	2026-01-23 02:42:13.032+00	2026-01-23 02:42:13.032+00	\N	\N	240	\N	\N	\N	\N
price_01KFMBP4X8DK5N7Z3S7AZ0QH4V	\N	pset_01KFMA764EBHT3X2ZDHMCF8EF1	hkd	{"value": "240", "precision": 20}	1	2026-01-23 02:42:13.033+00	2026-01-23 02:42:13.033+00	\N	\N	240	\N	\N	\N	\N
price_01KFMA764E4NXRHFDA4S9H6EA3	\N	pset_01KFMA764EBHT3X2ZDHMCF8EF1	usd	{"value": "31.5", "precision": 20}	0	2026-01-23 02:16:34.19+00	2026-01-23 02:42:13.042+00	\N	\N	31.5	\N	\N	\N	\N
price_01KH5QBTC6DSD301W5E82AVGD5	\N	pset_01KH5AEZF0J4V65YNT5KAA3EYC	hkd	{"value": "70", "precision": 20}	1	2026-02-11 06:49:04.646+00	2026-02-11 06:49:04.646+00	\N	\N	70	\N	\N	\N	\N
price_01KH5AEZF06QK017VC3MV9A9HX	\N	pset_01KH5AEZF0J4V65YNT5KAA3EYC	usd	{"value": "15", "precision": 20}	0	2026-02-11 03:03:36.672+00	2026-02-11 06:49:04.653+00	\N	\N	15	\N	\N	\N	\N
price_01KH5QDBSRZVZY88DRY8YR8EW5	\N	pset_01KH5AEZF0J4V65YNT5KAA3EYC	hkd	{"value": "70", "precision": 20}	0	2026-02-11 06:49:55.257+00	2026-02-11 06:49:55.257+00	\N	\N	70	\N	\N	\N	\N
price_01KH5VQDJVR767C9AEASS5BWQP	\N	pset_01KEXP5SQQY2F74NCVPW49R8R0	hkd	{"value": "70", "precision": 20}	0	2026-02-11 08:05:19.067+00	2026-02-11 08:05:19.067+00	\N	\N	70	\N	\N	\N	\N
price_01KH5VRP5FZVJZJ6WRAA8Z1DGF	\N	pset_01KEXP5SQSV58RSKAWGMB4FQ3C	hkd	{"value": "70", "precision": 20}	0	2026-02-11 08:06:00.623+00	2026-02-11 08:06:00.623+00	\N	\N	70	\N	\N	\N	\N
price_01KH5VRZM8WDXN3ZM9JPJNVEKQ	\N	pset_01KEXP5SQR1285C8PXA15MGXZV	hkd	{"value": "70", "precision": 20}	0	2026-02-11 08:06:10.312+00	2026-02-11 08:06:10.312+00	\N	\N	70	\N	\N	\N	\N
price_01KH5VSESPWBBRYFGPQDWXT5A9	\N	pset_01KEXP5SQR3N1KFH30MCPG2FYP	hkd	{"value": "70", "precision": 20}	0	2026-02-11 08:06:25.846+00	2026-02-11 08:06:25.846+00	\N	\N	70	\N	\N	\N	\N
price_01KH5VSYEPW05QQEVYX5WFWTYQ	\N	pset_01KEXP5SQSF2DFDV334BAEJ230	hkd	{"value": "70", "precision": 20}	0	2026-02-11 08:06:41.878+00	2026-02-11 08:06:41.878+00	\N	\N	70	\N	\N	\N	\N
price_01KH5VTDF7SE52RARVPMYD3JDZ	\N	pset_01KEXP5SQSJS1XKHWZ5QN4SFYG	hkd	{"value": "70", "precision": 20}	0	2026-02-11 08:06:57.256+00	2026-02-11 08:06:57.256+00	\N	\N	70	\N	\N	\N	\N
price_01KH5VTMJZ5D0PDB2R9RKJ3QE2	\N	pset_01KEXP5SQSDXD8M5HAP6GBN7QJ	hkd	{"value": "70", "precision": 20}	0	2026-02-11 08:07:04.544+00	2026-02-11 08:07:04.544+00	\N	\N	70	\N	\N	\N	\N
\.


--
-- Data for Name: price_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list (id, status, starts_at, ends_at, rules_count, title, description, type, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price_list_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list_rule (id, price_list_id, created_at, updated_at, deleted_at, value, attribute) FROM stdin;
\.


--
-- Data for Name: price_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_preference (id, attribute, value, is_tax_inclusive, created_at, updated_at, deleted_at) FROM stdin;
prpref_01KEXP5SEZ315QFDP7BP4HFC7F	currency_code	eur	f	2026-01-14 07:22:59.423+00	2026-01-14 07:22:59.423+00	\N
prpref_01KEXP5SGK9Q6VBPE8RVA8869M	region_id	reg_01KEXP5SG4F1K07ZVNJBQR30FT	f	2026-01-14 07:22:59.475+00	2026-01-14 07:22:59.475+00	\N
prpref_01KFCJ0EEFFVNG3AMKSARAK4P2	currency_code	hkd	f	2026-01-20 01:58:46.479+00	2026-01-20 01:58:46.479+00	\N
prpref_01KFCJ0EEF2C9JF1YFEKXQNMHA	currency_code	usd	f	2026-01-20 01:58:46.479+00	2026-01-20 01:58:46.479+00	\N
prpref_01KFCJ3P362TR3S8BTXFYPDFMP	region_id	reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	f	2026-01-20 02:00:32.614+00	2026-01-20 02:00:32.614+00	\N
prpref_01KH7SJBW80Y92YTWN0VZNMMZP	region_id	reg_01KH7SJBVW27CE31NJWETDPNN3	f	2026-02-12 02:06:05.192+00	2026-02-12 02:06:05.192+00	\N
\.


--
-- Data for Name: price_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_rule (id, value, priority, price_id, created_at, updated_at, deleted_at, attribute, operator) FROM stdin;
prule_01KEXP5SJVJXZ6JH0S4NB84P9Q	reg_01KEXP5SG4F1K07ZVNJBQR30FT	0	price_01KEXP5SJV5Y3PV7NDRXGXBN8W	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	region_id	eq
prule_01KEXP5SJV7VB7EV74S8TKKETJ	reg_01KEXP5SG4F1K07ZVNJBQR30FT	0	price_01KEXP5SJVD4E4NSEHF8MVXZJJ	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N	region_id	eq
prule_01KFMBP4X8MZ5SH16QG96Z8RBV	reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	0	price_01KFMBP4X8DK5N7Z3S7AZ0QH4V	2026-01-23 02:42:13.033+00	2026-01-23 02:42:13.033+00	\N	region_id	eq
prule_01KH5QDBSR30ZJQY0GQ0KMSQV4	reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	0	price_01KH5QBTC6DSD301W5E82AVGD5	2026-02-11 06:49:55.257+00	2026-02-11 06:49:55.257+00	\N	region_id	eq
\.


--
-- Data for Name: price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_set (id, created_at, updated_at, deleted_at) FROM stdin;
pset_01KEXP5SJVKC9E9ECQ2PAPX9NF	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N
pset_01KEXP5SJVZSA5NNNBPF07DJFJ	2026-01-14 07:22:59.548+00	2026-01-14 07:22:59.548+00	\N
pset_01KEXP5SQQY2F74NCVPW49R8R0	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQR6T559EZX7TEM77CK	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQR1285C8PXA15MGXZV	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQR3N1KFH30MCPG2FYP	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQSV58RSKAWGMB4FQ3C	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQSF2DFDV334BAEJ230	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQSJS1XKHWZ5QN4SFYG	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQSDXD8M5HAP6GBN7QJ	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQSS32YF2GAX1MHYSHH	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQSVN77Y6ZWHCX2DJDX	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQTR7ZGHJE1TX38ZTQN	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQTFTKXE0MYKFVE386E	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQT8YTHXMKYH1QKG2ZX	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQT3TG22WGD9HQ6B174	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQTC3JMQ1VNPY82ERC1	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQTNN5PAEYS6G228WGX	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQVZFBJYRTN2E78VRH7	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQV2NX1RKNZPCZ0PSZ7	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQV2HHREK4AWGHSGZ7J	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KEXP5SQVT71QXVQHNVSQE09R	2026-01-14 07:22:59.707+00	2026-01-14 07:22:59.707+00	\N
pset_01KFMA764EBHT3X2ZDHMCF8EF1	2026-01-23 02:16:34.19+00	2026-01-23 02:16:34.19+00	\N
pset_01KH5AEZF0J4V65YNT5KAA3EYC	2026-02-11 03:03:36.672+00	2026-02-11 03:03:36.672+00	\N
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, title, handle, subtitle, description, is_giftcard, status, thumbnail, weight, length, height, width, origin_country, hs_code, mid_code, material, collection_id, type_id, discountable, external_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
prod_01KEXP5SM6KACCKTJJZY65RPWW	Medusa Sweatshirt	sweatshirt	\N	Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.	f	published	https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png	400	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	\N
prod_01KEXP5SM60G3EXBA2FB86C4G9	Medusa Sweatpants	sweatpants	\N	Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.	f	published	https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png	400	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	\N
prod_01KEXP5SM6N24680BAA32FX71Y	Medusa Shorts	shorts	\N	Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.	f	published	https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png	400	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N	\N
prod_01KEXP5SM5RRMY6D3MYZW6Z196	Medusa T-Shirt	t-shirt	\N	Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.	f	published	https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png	400	\N	\N	\N	\N	\N	\N	\N	pcol_01KFCG71WTYH187XWZGD18T2MA	\N	t	\N	2026-01-14 07:22:59.593+00	2026-01-20 01:28:15.178+00	\N	\N
prod_01KFMA7633M0GS3YF54WQWK8V5	Boho handbag	boho-handbag	\N	Size: 70cm x 60cm\n\n======================= \nThis page is only used as a product catalog. If you want to purchase, please go to Instagram inbox (@wonderhin.handmade)	f	published	http://localhost:9000/static/1769134594136-product-1.webp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-01-23 02:16:34.149+00	2026-01-27 02:52:56.188+00	\N	\N
prod_01KH5AEZE0APZ33X6WEET8PT9J	Lunch bag (Cherry blossoms 🌸 )	lunch-bag-cherry-blossoms		There is a place for your wallet, tissues, lipstick, and mobile phone. You are afraid of falling when you go out for lunch \n\nSize: 32cm W x 34cm H	f	published	http://localhost:9000/static/1770865366898-6684b266aa256d0022d5a012-01.webp	\N	\N	34	32				\N	\N	\N	f	\N	2026-02-11 03:03:36.641+00	2026-02-16 04:14:32.909+00	\N	\N
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (id, name, description, handle, mpath, is_active, is_internal, rank, parent_category_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
pcat_01KEXP5SKWMG8B1PPMVHXFH15T	Bags		bags		t	f	0	\N	2026-01-14 07:22:59.581+00	2026-02-11 02:43:40.576+00	\N	\N
pcat_01KEXP5SKX61PP1EYFHQVYKMWZ	Phone Straps		phone-straps	pcat_01KEXP5SKX61PP1EYFHQVYKMWZ	t	f	3	\N	2026-01-14 07:22:59.581+00	2026-02-11 02:47:53.56+00	\N	\N
pcat_01KEXP5SKXGJ492S8BP9F10QPF	Bracelets		bracelets	pcat_01KEXP5SKXGJ492S8BP9F10QPF	t	f	2	\N	2026-01-14 07:22:59.581+00	2026-02-11 02:48:10.342+00	\N	\N
pcat_01KEXP5SKXVHK7D5022FDF0XKY	Necklaces		necklaces	pcat_01KEXP5SKXVHK7D5022FDF0XKY	t	f	1	\N	2026-01-14 07:22:59.581+00	2026-02-11 02:48:26.21+00	\N	\N
pcat_01KH59MWTZR8VH1B0S2YJW7VGY	Indian Fabric Collection		indian-fabric-collection	pcat_01KEXP5SKX61PP1EYFHQVYKMWZ.pcat_01KH59MWTZR8VH1B0S2YJW7VGY	t	f	0	pcat_01KEXP5SKX61PP1EYFHQVYKMWZ	2026-02-11 02:49:22.015+00	2026-02-11 02:49:22.015+00	\N	\N
pcat_01KH59NSWKYYYJ366X7FVZG9W5	Lunch Bag		lunch-bag	.pcat_01KH59NSWKYYYJ366X7FVZG9W5	t	f	0	pcat_01KEXP5SKWMG8B1PPMVHXFH15T	2026-02-11 02:49:51.763+00	2026-02-11 02:49:51.763+00	\N	\N
pcat_01KJ05GAY784AHR0M6HD1TGV8E	Other Bags		other-bags	.pcat_01KJ05GAY784AHR0M6HD1TGV8E	t	f	1	pcat_01KEXP5SKWMG8B1PPMVHXFH15T	2026-02-21 13:16:27.975+00	2026-02-21 13:16:27.975+00	\N	\N
\.


--
-- Data for Name: product_category_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category_product (product_id, product_category_id) FROM stdin;
prod_01KEXP5SM5RRMY6D3MYZW6Z196	pcat_01KEXP5SKWMG8B1PPMVHXFH15T
prod_01KEXP5SM6KACCKTJJZY65RPWW	pcat_01KEXP5SKXVHK7D5022FDF0XKY
prod_01KEXP5SM60G3EXBA2FB86C4G9	pcat_01KEXP5SKXGJ492S8BP9F10QPF
prod_01KEXP5SM6N24680BAA32FX71Y	pcat_01KEXP5SKX61PP1EYFHQVYKMWZ
prod_01KH5AEZE0APZ33X6WEET8PT9J	pcat_01KH59NSWKYYYJ366X7FVZG9W5
prod_01KEXP5SM60G3EXBA2FB86C4G9	pcat_01KJ05GAY784AHR0M6HD1TGV8E
\.


--
-- Data for Name: product_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_collection (id, title, handle, metadata, created_at, updated_at, deleted_at) FROM stdin;
pcol_01KFCG71WTYH187XWZGD18T2MA	Summer Collection 2026	summer-collection	\N	2026-01-20 01:27:25.849895+00	2026-01-20 01:27:25.849895+00	\N
\.


--
-- Data for Name: product_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option (id, title, product_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
opt_01KEXP5SM743462XQYWHMV57BK	Size	prod_01KEXP5SM5RRMY6D3MYZW6Z196	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
opt_01KEXP5SM7Z6B8T66Y9XTK39S4	Color	prod_01KEXP5SM5RRMY6D3MYZW6Z196	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
opt_01KEXP5SM8BJA1TY20VFEYMSM4	Size	prod_01KEXP5SM6KACCKTJJZY65RPWW	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
opt_01KEXP5SM8CZPM37QCRV0K6KE5	Size	prod_01KEXP5SM60G3EXBA2FB86C4G9	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
opt_01KEXP5SM9VMX7MEP2FJ21B4GR	Size	prod_01KEXP5SM6N24680BAA32FX71Y	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
opt_01KFMA7634HS8Y2V1ZBE9PK5KH	Default option	prod_01KFMA7633M0GS3YF54WQWK8V5	\N	2026-01-23 02:16:34.149+00	2026-01-23 02:16:34.149+00	\N
opt_01KH5AEZE1RVNV2VNMWZWANPQ6	Default option	prod_01KH5AEZE0APZ33X6WEET8PT9J	\N	2026-02-11 03:03:36.641+00	2026-02-11 03:03:36.641+00	\N
\.


--
-- Data for Name: product_option_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option_value (id, value, option_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
optval_01KEXP5SM7KCRXTDT2PHJFRCTQ	S	opt_01KEXP5SM743462XQYWHMV57BK	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM7303NJ8F12PFABN2Z	M	opt_01KEXP5SM743462XQYWHMV57BK	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM7TTENT3EVHNJYA2GQ	L	opt_01KEXP5SM743462XQYWHMV57BK	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM7WF7YW976B298E3CZ	XL	opt_01KEXP5SM743462XQYWHMV57BK	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM7RVK3RXEACGK8BQGZ	Black	opt_01KEXP5SM7Z6B8T66Y9XTK39S4	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM75AFBV6T84SKSS3MF	White	opt_01KEXP5SM7Z6B8T66Y9XTK39S4	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM8X6ZKRY5MEEZC001V	S	opt_01KEXP5SM8BJA1TY20VFEYMSM4	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM808YQFPNX770CN3H9	M	opt_01KEXP5SM8BJA1TY20VFEYMSM4	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM8GNPQ1S0YEYKZ5C5Q	L	opt_01KEXP5SM8BJA1TY20VFEYMSM4	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM8V5WEZ1MEADYG8YRP	XL	opt_01KEXP5SM8BJA1TY20VFEYMSM4	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM87ZZJFT6Z6F23F7S6	S	opt_01KEXP5SM8CZPM37QCRV0K6KE5	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM8F53NDP64MW3THJCX	M	opt_01KEXP5SM8CZPM37QCRV0K6KE5	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM8B4D611DJPXSRQ3RJ	L	opt_01KEXP5SM8CZPM37QCRV0K6KE5	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM883333A4QMB7XEBJM	XL	opt_01KEXP5SM8CZPM37QCRV0K6KE5	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM9PJD9CP19F9GJHC0C	S	opt_01KEXP5SM9VMX7MEP2FJ21B4GR	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM9CG9PRKA2NFXNJS4G	M	opt_01KEXP5SM9VMX7MEP2FJ21B4GR	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM9YNSRJJEK0S0PXA5B	L	opt_01KEXP5SM9VMX7MEP2FJ21B4GR	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KEXP5SM9NT67AK938C8AX5EY	XL	opt_01KEXP5SM9VMX7MEP2FJ21B4GR	\N	2026-01-14 07:22:59.594+00	2026-01-14 07:22:59.594+00	\N
optval_01KFMA7634DX5YFVMHZSSS9D2A	Default option value	opt_01KFMA7634HS8Y2V1ZBE9PK5KH	\N	2026-01-23 02:16:34.149+00	2026-01-23 02:16:34.149+00	\N
optval_01KH5AEZE1T6KDKQMMT07THHPH	Default option value	opt_01KH5AEZE1RVNV2VNMWZWANPQ6	\N	2026-02-11 03:03:36.641+00	2026-02-11 03:03:36.641+00	\N
\.


--
-- Data for Name: product_product_brand_brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_product_brand_brand (product_id, brand_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_product_category_categoryimage_category_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_product_category_categoryimage_category_image (product_category_id, category_image_id, id, created_at, updated_at, deleted_at) FROM stdin;
pcat_01KEXP5SKWMG8B1PPMVHXFH15T	01KHJS6MP7A98R1ZF67XQBM193	link_01KHJS6MPE2N0AAJ4E4FABDJ2F	2026-02-16 08:31:19.757515+00	2026-02-16 08:31:19.757515+00	\N
pcat_01KEXP5SKWMG8B1PPMVHXFH15T	01KHJS8AZH0CPN8A3PPQS4T7HD	link_01KHJS8AZPJ9HYCXBACX3J70VP	2026-02-16 08:32:15.350327+00	2026-02-16 08:32:15.350327+00	\N
pcat_01KEXP5SKX61PP1EYFHQVYKMWZ	01KHJVF4TPMTE29H282T90BPD3	link_01KHJVF4TY5PX8A8541AVQEQRB	2026-02-16 09:10:55.581869+00	2026-02-16 09:10:55.581869+00	\N
pcat_01KEXP5SKXGJ492S8BP9F10QPF	01KHJVGS0T86H15NB98NMGEXD3	link_01KHJVGS0XMMQBTPJSG28EBBSJ	2026-02-16 09:11:49.021133+00	2026-02-16 09:11:49.021133+00	\N
pcat_01KEXP5SKXVHK7D5022FDF0XKY	01KHJVHZ0TZ9JSWY2ESR1HB021	link_01KHJVHZ0YNE62NF1FK67RTBZ5	2026-02-16 09:12:27.934247+00	2026-02-16 09:12:27.934247+00	\N
\.


--
-- Data for Name: product_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sales_channel (product_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KEXP5SM5RRMY6D3MYZW6Z196	sc_01KEXP5SEB2P87PM49V5A9WTA8	prodsc_01KEXP5SMPH32WY2MGH04QP5D9	2026-01-14 07:22:59.605878+00	2026-01-14 07:22:59.605878+00	\N
prod_01KEXP5SM6KACCKTJJZY65RPWW	sc_01KEXP5SEB2P87PM49V5A9WTA8	prodsc_01KEXP5SMP73Q6VR0ECWN6CG38	2026-01-14 07:22:59.605878+00	2026-01-14 07:22:59.605878+00	\N
prod_01KEXP5SM60G3EXBA2FB86C4G9	sc_01KEXP5SEB2P87PM49V5A9WTA8	prodsc_01KEXP5SMQ8RG2K8AEB783BBDH	2026-01-14 07:22:59.605878+00	2026-01-14 07:22:59.605878+00	\N
prod_01KEXP5SM6N24680BAA32FX71Y	sc_01KEXP5SEB2P87PM49V5A9WTA8	prodsc_01KEXP5SMQ14SDVYN3G62109FW	2026-01-14 07:22:59.605878+00	2026-01-14 07:22:59.605878+00	\N
prod_01KFMA7633M0GS3YF54WQWK8V5	sc_01KEXP5SEB2P87PM49V5A9WTA8	prodsc_01KFMA763GHSTNNTZGDYBQKJFK	2026-01-23 02:16:34.160136+00	2026-01-23 02:16:34.160136+00	\N
prod_01KH5AEZE0APZ33X6WEET8PT9J	sc_01KEXP5SEB2P87PM49V5A9WTA8	prodsc_01KH5AEZE8J186Y0R93E4TMQJ5	2026-02-11 03:03:36.647559+00	2026-02-11 03:03:36.647559+00	\N
\.


--
-- Data for Name: product_shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_shipping_profile (product_id, shipping_profile_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KEXP5SM5RRMY6D3MYZW6Z196	sp_01KEXP5Q8BW5PPR02XDD8K8RA9	prodsp_01KEXP5SMY44SBDW813W1DZ51F	2026-01-14 07:22:59.614223+00	2026-01-14 07:22:59.614223+00	\N
prod_01KEXP5SM6KACCKTJJZY65RPWW	sp_01KEXP5Q8BW5PPR02XDD8K8RA9	prodsp_01KEXP5SMZA70VBK89B5KAV7XV	2026-01-14 07:22:59.614223+00	2026-01-14 07:22:59.614223+00	\N
prod_01KEXP5SM60G3EXBA2FB86C4G9	sp_01KEXP5Q8BW5PPR02XDD8K8RA9	prodsp_01KEXP5SMZZ7J5RN4RFH62ZBPE	2026-01-14 07:22:59.614223+00	2026-01-14 07:22:59.614223+00	\N
prod_01KEXP5SM6N24680BAA32FX71Y	sp_01KEXP5Q8BW5PPR02XDD8K8RA9	prodsp_01KEXP5SMZ4Y86EJCPKJWXCGN9	2026-01-14 07:22:59.614223+00	2026-01-14 07:22:59.614223+00	\N
\.


--
-- Data for Name: product_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tag (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tags (product_id, product_tag_id) FROM stdin;
\.


--
-- Data for Name: product_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_type (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant (id, title, sku, barcode, ean, upc, allow_backorder, manage_inventory, hs_code, origin_country, mid_code, material, weight, length, height, width, metadata, variant_rank, product_id, created_at, updated_at, deleted_at, thumbnail) FROM stdin;
variant_01KEXP5SNFNZ9QMTRP4N5ZQPWS	S / White	SHIRT-S-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFV4QJM8TS2V532DG4	S	SWEATSHIRT-S	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6KACCKTJJZY65RPWW	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNF7EN02JEYVK81AVPV	M	SWEATSHIRT-M	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6KACCKTJJZY65RPWW	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFQ8K1PZYTHGX44PRH	L	SWEATSHIRT-L	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6KACCKTJJZY65RPWW	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNF86TTA2SEQ4XRQPVS	XL	SWEATSHIRT-XL	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6KACCKTJJZY65RPWW	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFHP4RSKVNG2SPP5ZQ	S	SWEATPANTS-S	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM60G3EXBA2FB86C4G9	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNG1NYJBY83VP3PGRSN	M	SWEATPANTS-M	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM60G3EXBA2FB86C4G9	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNGWRBAS4P6F1DS7RNH	L	SWEATPANTS-L	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM60G3EXBA2FB86C4G9	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNGW34DD5NDDM7KC3VN	XL	SWEATPANTS-XL	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM60G3EXBA2FB86C4G9	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNGK67RWWMN38WF31KH	S	SHORTS-S	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6N24680BAA32FX71Y	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNG76Y2VQP4JT64C0JF	M	SHORTS-M	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6N24680BAA32FX71Y	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNGHTBQ0T0A08Z2GKGA	L	SHORTS-L	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6N24680BAA32FX71Y	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNG8KSFSBC75RW0EEHA	XL	SHORTS-XL	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM6N24680BAA32FX71Y	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KFMA763YVDRFYFY07FTATYK5	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KFMA7633M0GS3YF54WQWK8V5	2026-01-23 02:16:34.175+00	2026-01-23 02:16:34.175+00	\N	\N
variant_01KH5AEZEMPH1ETR14TJJ6Z2BY	Default variant	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KH5AEZE0APZ33X6WEET8PT9J	2026-02-11 03:03:36.66+00	2026-02-11 03:03:36.66+00	\N	\N
variant_01KEXP5SNEF0WPB79D4AX69XTA	S / Black	SHIRT-S-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNF69HJYSR74C1W5SCP	L / Black	SHIRT-L-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFHK3S11M1WHNYECCX	M / Black	SHIRT-M-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFN9FMJKH6YS0SC2GA	M / White	SHIRT-M-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFRXFK570EJ00SVRYS	L / White	SHIRT-L-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFV9FRS5P67Q4V3J6M	XL / Black	SHIRT-XL-BLACK	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
variant_01KEXP5SNFVSK8TBER4SRH6GR0	XL / White	SHIRT-XL-WHITE	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KEXP5SM5RRMY6D3MYZW6Z196	2026-01-14 07:22:59.633+00	2026-01-14 07:22:59.633+00	\N	\N
\.


--
-- Data for Name: product_variant_inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_inventory_item (variant_id, inventory_item_id, id, required_quantity, created_at, updated_at, deleted_at) FROM stdin;
variant_01KEXP5SNEF0WPB79D4AX69XTA	iitem_01KEXP5SP6SGFCC9FT7VQWZ7XZ	pvitem_01KEXP5SPM81RWBN6VC4EG76VB	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFNZ9QMTRP4N5ZQPWS	iitem_01KEXP5SP6TTB9E91259EN77P5	pvitem_01KEXP5SPMDAE6EJ4GJQXXWSTJ	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFHK3S11M1WHNYECCX	iitem_01KEXP5SP6XQR3K1JGGS32YRKD	pvitem_01KEXP5SPM0G5XY1GZM41YRDRD	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFN9FMJKH6YS0SC2GA	iitem_01KEXP5SP6QYBCSZJH1A4JB3M9	pvitem_01KEXP5SPMP17RACFRN641DSDM	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNF69HJYSR74C1W5SCP	iitem_01KEXP5SP6BQ44JK9JNK9MVESK	pvitem_01KEXP5SPMAVYH0R9NZXF6PD08	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFRXFK570EJ00SVRYS	iitem_01KEXP5SP6JHZVYS0MDA8W61WP	pvitem_01KEXP5SPM5FX6E6QKZMGZB3BZ	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFV9FRS5P67Q4V3J6M	iitem_01KEXP5SP67Q5NMJFSPB1TJ23V	pvitem_01KEXP5SPM7C75ZVZR1R8EVMZA	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFVSK8TBER4SRH6GR0	iitem_01KEXP5SP6YZ3SC3ASCJGZX3AQ	pvitem_01KEXP5SPMSW0H0P3KWNSFRMGK	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFV4QJM8TS2V532DG4	iitem_01KEXP5SP6KCZT1MXP3GTW9KAV	pvitem_01KEXP5SPN7D52X8J2SZPE2E65	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNF7EN02JEYVK81AVPV	iitem_01KEXP5SP74FQNTCPNPB01RMC2	pvitem_01KEXP5SPNKJXCJ300JZRDKKRG	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFQ8K1PZYTHGX44PRH	iitem_01KEXP5SP7MSSW8H3SBRW711E5	pvitem_01KEXP5SPNTNGJZB941JFST6DV	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNF86TTA2SEQ4XRQPVS	iitem_01KEXP5SP7YT7T3P7AGY16GFTS	pvitem_01KEXP5SPNBYHBTZD1WHD3ZSQ5	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNFHP4RSKVNG2SPP5ZQ	iitem_01KEXP5SP7EA6SH1VC1G01RMVJ	pvitem_01KEXP5SPNSW28XD80861EWE2Q	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNG1NYJBY83VP3PGRSN	iitem_01KEXP5SP7WTQHWZNK07CFGKCW	pvitem_01KEXP5SPNAZV34RY2046WF5WV	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNGWRBAS4P6F1DS7RNH	iitem_01KEXP5SP7TWT2T7X4DQJCF2K9	pvitem_01KEXP5SPNHJ3VS01Y76X2C03M	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNGW34DD5NDDM7KC3VN	iitem_01KEXP5SP7AZ3NB3DSAM0VGRCH	pvitem_01KEXP5SPN2VAHA598Q4BQ6AW6	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNGK67RWWMN38WF31KH	iitem_01KEXP5SP772WRKW5GBQQGC5SP	pvitem_01KEXP5SPNT6ECC1CH3WXPR7RW	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNG76Y2VQP4JT64C0JF	iitem_01KEXP5SP7DSMS3WKBQB87MZP5	pvitem_01KEXP5SPNTZRM4WMSGZ6ZN4V6	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNGHTBQ0T0A08Z2GKGA	iitem_01KEXP5SP7QFKHCCMQ3QD6C5K2	pvitem_01KEXP5SPN48BS7EE3TMRRAZJV	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
variant_01KEXP5SNG8KSFSBC75RW0EEHA	iitem_01KEXP5SP7HPZ8P26Q13P58MKM	pvitem_01KEXP5SPNGM55MNT587ZAEY4P	1	2026-01-14 07:22:59.667955+00	2026-01-14 07:22:59.667955+00	\N
\.


--
-- Data for Name: product_variant_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_option (variant_id, option_value_id) FROM stdin;
variant_01KEXP5SNEF0WPB79D4AX69XTA	optval_01KEXP5SM7KCRXTDT2PHJFRCTQ
variant_01KEXP5SNEF0WPB79D4AX69XTA	optval_01KEXP5SM7RVK3RXEACGK8BQGZ
variant_01KEXP5SNFNZ9QMTRP4N5ZQPWS	optval_01KEXP5SM7KCRXTDT2PHJFRCTQ
variant_01KEXP5SNFNZ9QMTRP4N5ZQPWS	optval_01KEXP5SM75AFBV6T84SKSS3MF
variant_01KEXP5SNFHK3S11M1WHNYECCX	optval_01KEXP5SM7303NJ8F12PFABN2Z
variant_01KEXP5SNFHK3S11M1WHNYECCX	optval_01KEXP5SM7RVK3RXEACGK8BQGZ
variant_01KEXP5SNFN9FMJKH6YS0SC2GA	optval_01KEXP5SM7303NJ8F12PFABN2Z
variant_01KEXP5SNFN9FMJKH6YS0SC2GA	optval_01KEXP5SM75AFBV6T84SKSS3MF
variant_01KEXP5SNF69HJYSR74C1W5SCP	optval_01KEXP5SM7TTENT3EVHNJYA2GQ
variant_01KEXP5SNF69HJYSR74C1W5SCP	optval_01KEXP5SM7RVK3RXEACGK8BQGZ
variant_01KEXP5SNFRXFK570EJ00SVRYS	optval_01KEXP5SM7TTENT3EVHNJYA2GQ
variant_01KEXP5SNFRXFK570EJ00SVRYS	optval_01KEXP5SM75AFBV6T84SKSS3MF
variant_01KEXP5SNFV9FRS5P67Q4V3J6M	optval_01KEXP5SM7WF7YW976B298E3CZ
variant_01KEXP5SNFV9FRS5P67Q4V3J6M	optval_01KEXP5SM7RVK3RXEACGK8BQGZ
variant_01KEXP5SNFVSK8TBER4SRH6GR0	optval_01KEXP5SM7WF7YW976B298E3CZ
variant_01KEXP5SNFVSK8TBER4SRH6GR0	optval_01KEXP5SM75AFBV6T84SKSS3MF
variant_01KEXP5SNFV4QJM8TS2V532DG4	optval_01KEXP5SM8X6ZKRY5MEEZC001V
variant_01KEXP5SNF7EN02JEYVK81AVPV	optval_01KEXP5SM808YQFPNX770CN3H9
variant_01KEXP5SNFQ8K1PZYTHGX44PRH	optval_01KEXP5SM8GNPQ1S0YEYKZ5C5Q
variant_01KEXP5SNF86TTA2SEQ4XRQPVS	optval_01KEXP5SM8V5WEZ1MEADYG8YRP
variant_01KEXP5SNFHP4RSKVNG2SPP5ZQ	optval_01KEXP5SM87ZZJFT6Z6F23F7S6
variant_01KEXP5SNG1NYJBY83VP3PGRSN	optval_01KEXP5SM8F53NDP64MW3THJCX
variant_01KEXP5SNGWRBAS4P6F1DS7RNH	optval_01KEXP5SM8B4D611DJPXSRQ3RJ
variant_01KEXP5SNGW34DD5NDDM7KC3VN	optval_01KEXP5SM883333A4QMB7XEBJM
variant_01KEXP5SNGK67RWWMN38WF31KH	optval_01KEXP5SM9PJD9CP19F9GJHC0C
variant_01KEXP5SNG76Y2VQP4JT64C0JF	optval_01KEXP5SM9CG9PRKA2NFXNJS4G
variant_01KEXP5SNGHTBQ0T0A08Z2GKGA	optval_01KEXP5SM9YNSRJJEK0S0PXA5B
variant_01KEXP5SNG8KSFSBC75RW0EEHA	optval_01KEXP5SM9NT67AK938C8AX5EY
variant_01KFMA763YVDRFYFY07FTATYK5	optval_01KFMA7634DX5YFVMHZSSS9D2A
variant_01KH5AEZEMPH1ETR14TJJ6Z2BY	optval_01KH5AEZE1T6KDKQMMT07THHPH
\.


--
-- Data for Name: product_variant_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_price_set (variant_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
variant_01KEXP5SNEF0WPB79D4AX69XTA	pset_01KEXP5SQQY2F74NCVPW49R8R0	pvps_01KEXP5SRT488NYNBEB5QJB4KX	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFNZ9QMTRP4N5ZQPWS	pset_01KEXP5SQR6T559EZX7TEM77CK	pvps_01KEXP5SRVJWP1A5742MKX4ZN0	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFHK3S11M1WHNYECCX	pset_01KEXP5SQR1285C8PXA15MGXZV	pvps_01KEXP5SRVGFWTN41WDVTXGBYX	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFN9FMJKH6YS0SC2GA	pset_01KEXP5SQR3N1KFH30MCPG2FYP	pvps_01KEXP5SRV7MV48Y7QXRRBHG78	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNF69HJYSR74C1W5SCP	pset_01KEXP5SQSV58RSKAWGMB4FQ3C	pvps_01KEXP5SRVEFMMWT00K3SM78V3	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFRXFK570EJ00SVRYS	pset_01KEXP5SQSF2DFDV334BAEJ230	pvps_01KEXP5SRVJX558S1RY5S9KSDT	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFV9FRS5P67Q4V3J6M	pset_01KEXP5SQSJS1XKHWZ5QN4SFYG	pvps_01KEXP5SRVF6WG8VGZHY5X4ZNA	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFVSK8TBER4SRH6GR0	pset_01KEXP5SQSDXD8M5HAP6GBN7QJ	pvps_01KEXP5SRVK7YVXX32C2HY1DT4	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFV4QJM8TS2V532DG4	pset_01KEXP5SQSS32YF2GAX1MHYSHH	pvps_01KEXP5SRVE9J1MDWZGJAHJ472	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNF7EN02JEYVK81AVPV	pset_01KEXP5SQSVN77Y6ZWHCX2DJDX	pvps_01KEXP5SRVNA50060FFQM46DNV	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFQ8K1PZYTHGX44PRH	pset_01KEXP5SQTR7ZGHJE1TX38ZTQN	pvps_01KEXP5SRV3EQGR57BYN5D4JG9	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNF86TTA2SEQ4XRQPVS	pset_01KEXP5SQTFTKXE0MYKFVE386E	pvps_01KEXP5SRVMJXQX31WAVT4XB9B	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNFHP4RSKVNG2SPP5ZQ	pset_01KEXP5SQT8YTHXMKYH1QKG2ZX	pvps_01KEXP5SRV1J9WKJB4QDYJ18FV	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNG1NYJBY83VP3PGRSN	pset_01KEXP5SQT3TG22WGD9HQ6B174	pvps_01KEXP5SRVMKG0GAED4QXGVJNR	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNGWRBAS4P6F1DS7RNH	pset_01KEXP5SQTC3JMQ1VNPY82ERC1	pvps_01KEXP5SRV8PJ23B3ET8RA13NM	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNGW34DD5NDDM7KC3VN	pset_01KEXP5SQTNN5PAEYS6G228WGX	pvps_01KEXP5SRV8FECXKWJJQC92WB5	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNGK67RWWMN38WF31KH	pset_01KEXP5SQVZFBJYRTN2E78VRH7	pvps_01KEXP5SRV7Q3KSZCEBAD1D3WC	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNG76Y2VQP4JT64C0JF	pset_01KEXP5SQV2NX1RKNZPCZ0PSZ7	pvps_01KEXP5SRV4TFQTM8KXXY9FPM4	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNGHTBQ0T0A08Z2GKGA	pset_01KEXP5SQV2HHREK4AWGHSGZ7J	pvps_01KEXP5SRVDDYT878J8RZQ9TTP	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KEXP5SNG8KSFSBC75RW0EEHA	pset_01KEXP5SQVT71QXVQHNVSQE09R	pvps_01KEXP5SRWF597C2V7053P1F5Z	2026-01-14 07:22:59.736282+00	2026-01-14 07:22:59.736282+00	\N
variant_01KFMA763YVDRFYFY07FTATYK5	pset_01KFMA764EBHT3X2ZDHMCF8EF1	pvps_01KFMA764RNV9XE18BBQYSGXDN	2026-01-23 02:16:34.200269+00	2026-01-23 02:16:34.200269+00	\N
variant_01KH5AEZEMPH1ETR14TJJ6Z2BY	pset_01KH5AEZF0J4V65YNT5KAA3EYC	pvps_01KH5AEZFAQNPHMCXJ8VFVHSPH	2026-02-11 03:03:36.681797+00	2026-02-11 03:03:36.681797+00	\N
\.


--
-- Data for Name: product_variant_product_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_product_image (id, variant_id, image_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion (id, code, campaign_id, is_automatic, type, created_at, updated_at, deleted_at, status, is_tax_inclusive, "limit", used, metadata) FROM stdin;
promo_01KFZG3NM0JPDNS949B213HFZ6	SUMMER26	procamp_01KFZG3NMBGJTFB43ZCZ0J9DZD	f	standard	2026-01-27 10:31:09.2+00	2026-01-27 10:31:09.2+00	\N	draft	f	\N	0	\N
\.


--
-- Data for Name: promotion_application_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_application_method (id, value, raw_value, max_quantity, apply_to_quantity, buy_rules_min_quantity, type, target_type, allocation, promotion_id, created_at, updated_at, deleted_at, currency_code) FROM stdin;
proappmet_01KFZG3NM9Z3DMXZF7J1479QHC	1000	{"value": "1000", "precision": 20}	\N	\N	\N	fixed	order	across	promo_01KFZG3NM0JPDNS949B213HFZ6	2026-01-27 10:31:09.199+00	2026-01-27 10:31:09.199+00	\N	usd
\.


--
-- Data for Name: promotion_campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign (id, name, description, campaign_identifier, starts_at, ends_at, created_at, updated_at, deleted_at) FROM stdin;
procamp_01KFZG3NMBGJTFB43ZCZ0J9DZD	Summer Campaign 2026	Summer Campaign 2026	summer-campaign-2026	\N	\N	2026-01-27 10:31:09.199+00	2026-01-27 10:31:09.199+00	\N
\.


--
-- Data for Name: promotion_campaign_budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget (id, type, campaign_id, "limit", raw_limit, used, raw_used, created_at, updated_at, deleted_at, currency_code, attribute) FROM stdin;
probudg_01KFZG3NMDPY3YRJMND38C27J9	use_by_attribute	procamp_01KFZG3NMBGJTFB43ZCZ0J9DZD	100	{"value": "100", "precision": 20}	0	{"value": "0", "precision": 20}	2026-01-27 10:31:09.197+00	2026-01-27 10:31:09.198+00	\N	\N	customer_id
\.


--
-- Data for Name: promotion_campaign_budget_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget_usage (id, attribute_value, used, budget_id, raw_used, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_promotion_rule (promotion_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule (id, description, attribute, operator, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_rule_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule_value (id, promotion_rule_id, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: provider_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provider_identity (id, entity_id, provider, auth_identity_id, user_metadata, provider_metadata, created_at, updated_at, deleted_at) FROM stdin;
01KEXPMZXZ1NYT94FBWQ2JXNFN	admin@test.com	emailpass	authid_01KEXPMZXZZBN8BG03J04PW3X7	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAbCJC87cpVw2fUP2uT3coMxbnUYDCZVh/vbG9xCzpl0jg1ihnBdY1Pic09B+GYZJPaRWXnj+VQcvN9uqLpl3ucl2+Uh74kjaLi+UeQtqL4Rw"}	2026-01-14 07:31:17.568+00	2026-01-14 07:31:17.568+00	\N
01KFMDCQF34J3VY36W71NNGMXN	admin2@test.com	emailpass	authid_01KFMDCQF3GJVD8SEXDKDDTQFH	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAQVKmV7tQivazjYrtCjtZO1U9P6mnJcqRWpGlZvl724lDRaV3zTYDUDyQfCPiTs7CpmmHehJVv97TTpALsOgRSYoMjy4Etf/s7XQHHLhlbGK"}	2026-01-23 03:12:01.507+00	2026-01-23 03:12:01.507+00	\N
01KFMEMK5PN6XXP9HFW7TWTQDX	user1@test.com	emailpass	authid_01KFMEMK5PGEQ49FMY5YHQQCK0	\N	{"password": "c2NyeXB0AA8AAAAIAAAAASuaoMd9oo+tKMC+f+g/0ZZEDgIiHVSwZMcLpDqHEXtbfiX6jp6n79AETfnU0n7Gh+at88lz4yynX2EQLISAvPTR5EjsuRb31Dycjm7vpL+t"}	2026-01-23 03:33:47.83+00	2026-01-23 03:33:47.83+00	\N
01KFMEXAQ0QTA5J00KNYGEESG7	peter.chan@handmade.com	emailpass	authid_01KFMEXAQ1XSAY87D2AC049604	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAS4T1RF0BUjteX0ldd1tzlzhYhuBKNia9vpp9o3QNAB5wEqjm+8vu8H7zELewn2rrWyg23MVoRx3DoB1Kap+aS79o2thyKifoWs1Vi/gaV7r"}	2026-01-23 03:38:34.081+00	2026-01-23 03:38:34.081+00	\N
01KFMJKSN82YY691DZD77D9VYK	david.yuen@handmade.com	emailpass	authid_01KFMJKSN9KSQAMZKSYNAGXTAV	\N	{"password": "c2NyeXB0AA8AAAAIAAAAATBd6E4ycO2wS9FUUEcisEc20Vqxv70pfNQUXiP/GQJJAr4yQdZx9BTYv+0HISfY0ndtXw9I/qKSwyHxzVMdoxeL+eJYaeupnZCVWm5p3pmT"}	2026-01-23 04:43:16.009+00	2026-01-23 04:43:16.009+00	\N
\.


--
-- Data for Name: publishable_api_key_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publishable_api_key_sales_channel (publishable_key_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
apk_01KEXP5SF6GME73XYYAMNARQVD	sc_01KEXP5SEB2P87PM49V5A9WTA8	pksc_01KEXP5SKN0QXM90FK7CA1JV6R	2026-01-14 07:22:59.435929+00	2026-01-14 07:22:59.435929+00	\N
\.


--
-- Data for Name: refund; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata, refund_reason_id, note) FROM stdin;
\.


--
-- Data for Name: refund_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund_reason (id, label, description, metadata, created_at, updated_at, deleted_at, code) FROM stdin;
refr_01KEXP5M05GS08J4KPAEKF6DB5	Shipping Issue	Refund due to lost, delayed, or misdelivered shipment	\N	2026-01-14 07:22:53.725719+00	2026-01-14 07:22:53.725719+00	\N	shipping_issue
refr_01KEXP5M05FF3KB90NC6EGHPXS	Customer Care Adjustment	Refund given as goodwill or compensation for inconvenience	\N	2026-01-14 07:22:53.725719+00	2026-01-14 07:22:53.725719+00	\N	customer_care_adjustment
refr_01KEXP5M052QPRYZCMVJ0P14P8	Pricing Error	Refund to correct an overcharge, missing discount, or incorrect price	\N	2026-01-14 07:22:53.725719+00	2026-01-14 07:22:53.725719+00	\N	pricing_error
\.


--
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region (id, name, currency_code, metadata, created_at, updated_at, deleted_at, automatic_taxes) FROM stdin;
reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	Hong Kong	hkd	\N	2026-01-20 02:00:32.605+00	2026-01-20 02:00:32.605+00	\N	f
reg_01KEXP5SG4F1K07ZVNJBQR30FT	Europe	eur	\N	2026-01-14 07:22:59.464+00	2026-02-11 07:49:01.597+00	2026-02-11 07:49:01.597+00	t
reg_01KH7SJBVW27CE31NJWETDPNN3	Europe	eur	\N	2026-02-12 02:06:05.184+00	2026-02-12 02:06:05.184+00	\N	t
\.


--
-- Data for Name: region_country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_country (iso_2, iso_3, num_code, name, display_name, region_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
af	afg	004	AFGHANISTAN	Afghanistan	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
al	alb	008	ALBANIA	Albania	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
dz	dza	012	ALGERIA	Algeria	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
as	asm	016	AMERICAN SAMOA	American Samoa	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ad	and	020	ANDORRA	Andorra	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ao	ago	024	ANGOLA	Angola	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ai	aia	660	ANGUILLA	Anguilla	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
aq	ata	010	ANTARCTICA	Antarctica	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ag	atg	028	ANTIGUA AND BARBUDA	Antigua and Barbuda	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ar	arg	032	ARGENTINA	Argentina	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
am	arm	051	ARMENIA	Armenia	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
aw	abw	533	ARUBA	Aruba	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
au	aus	036	AUSTRALIA	Australia	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
at	aut	040	AUSTRIA	Austria	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
az	aze	031	AZERBAIJAN	Azerbaijan	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bs	bhs	044	BAHAMAS	Bahamas	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bh	bhr	048	BAHRAIN	Bahrain	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bd	bgd	050	BANGLADESH	Bangladesh	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bb	brb	052	BARBADOS	Barbados	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
by	blr	112	BELARUS	Belarus	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
be	bel	056	BELGIUM	Belgium	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bz	blz	084	BELIZE	Belize	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bj	ben	204	BENIN	Benin	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bm	bmu	060	BERMUDA	Bermuda	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bt	btn	064	BHUTAN	Bhutan	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bo	bol	068	BOLIVIA	Bolivia	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bq	bes	535	BONAIRE, SINT EUSTATIUS AND SABA	Bonaire, Sint Eustatius and Saba	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ba	bih	070	BOSNIA AND HERZEGOVINA	Bosnia and Herzegovina	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bw	bwa	072	BOTSWANA	Botswana	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bv	bvd	074	BOUVET ISLAND	Bouvet Island	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
br	bra	076	BRAZIL	Brazil	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
io	iot	086	BRITISH INDIAN OCEAN TERRITORY	British Indian Ocean Territory	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bn	brn	096	BRUNEI DARUSSALAM	Brunei Darussalam	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bg	bgr	100	BULGARIA	Bulgaria	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bf	bfa	854	BURKINA FASO	Burkina Faso	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
bi	bdi	108	BURUNDI	Burundi	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
kh	khm	116	CAMBODIA	Cambodia	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cm	cmr	120	CAMEROON	Cameroon	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ca	can	124	CANADA	Canada	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cv	cpv	132	CAPE VERDE	Cape Verde	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ky	cym	136	CAYMAN ISLANDS	Cayman Islands	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cf	caf	140	CENTRAL AFRICAN REPUBLIC	Central African Republic	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
td	tcd	148	CHAD	Chad	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cl	chl	152	CHILE	Chile	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cn	chn	156	CHINA	China	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cx	cxr	162	CHRISTMAS ISLAND	Christmas Island	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cc	cck	166	COCOS (KEELING) ISLANDS	Cocos (Keeling) Islands	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
co	col	170	COLOMBIA	Colombia	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
km	com	174	COMOROS	Comoros	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cg	cog	178	CONGO	Congo	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cd	cod	180	CONGO, THE DEMOCRATIC REPUBLIC OF THE	Congo, the Democratic Republic of the	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ck	cok	184	COOK ISLANDS	Cook Islands	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cr	cri	188	COSTA RICA	Costa Rica	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ci	civ	384	COTE D'IVOIRE	Cote D'Ivoire	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
hr	hrv	191	CROATIA	Croatia	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cu	cub	192	CUBA	Cuba	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cw	cuw	531	CURAÇAO	Curaçao	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cy	cyp	196	CYPRUS	Cyprus	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
cz	cze	203	CZECH REPUBLIC	Czech Republic	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
dj	dji	262	DJIBOUTI	Djibouti	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
dm	dma	212	DOMINICA	Dominica	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
do	dom	214	DOMINICAN REPUBLIC	Dominican Republic	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ec	ecu	218	ECUADOR	Ecuador	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
eg	egy	818	EGYPT	Egypt	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
sv	slv	222	EL SALVADOR	El Salvador	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
gq	gnq	226	EQUATORIAL GUINEA	Equatorial Guinea	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
er	eri	232	ERITREA	Eritrea	\N	\N	2026-01-14 07:22:56.508+00	2026-01-14 07:22:56.508+00	\N
ee	est	233	ESTONIA	Estonia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
et	eth	231	ETHIOPIA	Ethiopia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
fk	flk	238	FALKLAND ISLANDS (MALVINAS)	Falkland Islands (Malvinas)	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
fo	fro	234	FAROE ISLANDS	Faroe Islands	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
fj	fji	242	FIJI	Fiji	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
fi	fin	246	FINLAND	Finland	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gf	guf	254	FRENCH GUIANA	French Guiana	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pf	pyf	258	FRENCH POLYNESIA	French Polynesia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
tf	atf	260	FRENCH SOUTHERN TERRITORIES	French Southern Territories	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ga	gab	266	GABON	Gabon	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gm	gmb	270	GAMBIA	Gambia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ge	geo	268	GEORGIA	Georgia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gh	gha	288	GHANA	Ghana	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gi	gib	292	GIBRALTAR	Gibraltar	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gr	grc	300	GREECE	Greece	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gl	grl	304	GREENLAND	Greenland	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gd	grd	308	GRENADA	Grenada	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gp	glp	312	GUADELOUPE	Guadeloupe	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gu	gum	316	GUAM	Guam	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gt	gtm	320	GUATEMALA	Guatemala	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gg	ggy	831	GUERNSEY	Guernsey	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gn	gin	324	GUINEA	Guinea	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gw	gnb	624	GUINEA-BISSAU	Guinea-Bissau	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gy	guy	328	GUYANA	Guyana	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ht	hti	332	HAITI	Haiti	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
hm	hmd	334	HEARD ISLAND AND MCDONALD ISLANDS	Heard Island And Mcdonald Islands	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
va	vat	336	HOLY SEE (VATICAN CITY STATE)	Holy See (Vatican City State)	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
hn	hnd	340	HONDURAS	Honduras	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
hu	hun	348	HUNGARY	Hungary	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
is	isl	352	ICELAND	Iceland	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
in	ind	356	INDIA	India	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
id	idn	360	INDONESIA	Indonesia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ir	irn	364	IRAN, ISLAMIC REPUBLIC OF	Iran, Islamic Republic of	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
iq	irq	368	IRAQ	Iraq	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ie	irl	372	IRELAND	Ireland	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
im	imn	833	ISLE OF MAN	Isle Of Man	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
il	isr	376	ISRAEL	Israel	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
jm	jam	388	JAMAICA	Jamaica	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
jp	jpn	392	JAPAN	Japan	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
je	jey	832	JERSEY	Jersey	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
jo	jor	400	JORDAN	Jordan	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
kz	kaz	398	KAZAKHSTAN	Kazakhstan	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ke	ken	404	KENYA	Kenya	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ki	kir	296	KIRIBATI	Kiribati	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
kp	prk	408	KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF	Korea, Democratic People's Republic of	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
kr	kor	410	KOREA, REPUBLIC OF	Korea, Republic of	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
xk	xkx	900	KOSOVO	Kosovo	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
kw	kwt	414	KUWAIT	Kuwait	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
kg	kgz	417	KYRGYZSTAN	Kyrgyzstan	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
la	lao	418	LAO PEOPLE'S DEMOCRATIC REPUBLIC	Lao People's Democratic Republic	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
lv	lva	428	LATVIA	Latvia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
lb	lbn	422	LEBANON	Lebanon	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ls	lso	426	LESOTHO	Lesotho	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
lr	lbr	430	LIBERIA	Liberia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ly	lby	434	LIBYA	Libya	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
li	lie	438	LIECHTENSTEIN	Liechtenstein	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
lt	ltu	440	LITHUANIA	Lithuania	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
lu	lux	442	LUXEMBOURG	Luxembourg	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mo	mac	446	MACAO	Macao	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mg	mdg	450	MADAGASCAR	Madagascar	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mw	mwi	454	MALAWI	Malawi	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
my	mys	458	MALAYSIA	Malaysia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mv	mdv	462	MALDIVES	Maldives	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ml	mli	466	MALI	Mali	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mt	mlt	470	MALTA	Malta	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mh	mhl	584	MARSHALL ISLANDS	Marshall Islands	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mq	mtq	474	MARTINIQUE	Martinique	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mr	mrt	478	MAURITANIA	Mauritania	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mu	mus	480	MAURITIUS	Mauritius	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
yt	myt	175	MAYOTTE	Mayotte	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mx	mex	484	MEXICO	Mexico	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
fm	fsm	583	MICRONESIA, FEDERATED STATES OF	Micronesia, Federated States of	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
md	mda	498	MOLDOVA, REPUBLIC OF	Moldova, Republic of	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mc	mco	492	MONACO	Monaco	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mn	mng	496	MONGOLIA	Mongolia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
me	mne	499	MONTENEGRO	Montenegro	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ms	msr	500	MONTSERRAT	Montserrat	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ma	mar	504	MOROCCO	Morocco	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mz	moz	508	MOZAMBIQUE	Mozambique	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mm	mmr	104	MYANMAR	Myanmar	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
na	nam	516	NAMIBIA	Namibia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
nr	nru	520	NAURU	Nauru	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
np	npl	524	NEPAL	Nepal	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
nl	nld	528	NETHERLANDS	Netherlands	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
nc	ncl	540	NEW CALEDONIA	New Caledonia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
nz	nzl	554	NEW ZEALAND	New Zealand	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ni	nic	558	NICARAGUA	Nicaragua	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ne	ner	562	NIGER	Niger	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ng	nga	566	NIGERIA	Nigeria	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
nu	niu	570	NIUE	Niue	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
nf	nfk	574	NORFOLK ISLAND	Norfolk Island	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mk	mkd	807	NORTH MACEDONIA	North Macedonia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mp	mnp	580	NORTHERN MARIANA ISLANDS	Northern Mariana Islands	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
no	nor	578	NORWAY	Norway	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
om	omn	512	OMAN	Oman	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pk	pak	586	PAKISTAN	Pakistan	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pw	plw	585	PALAU	Palau	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ps	pse	275	PALESTINIAN TERRITORY, OCCUPIED	Palestinian Territory, Occupied	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pa	pan	591	PANAMA	Panama	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pg	png	598	PAPUA NEW GUINEA	Papua New Guinea	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
py	pry	600	PARAGUAY	Paraguay	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pe	per	604	PERU	Peru	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ph	phl	608	PHILIPPINES	Philippines	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pn	pcn	612	PITCAIRN	Pitcairn	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pl	pol	616	POLAND	Poland	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pt	prt	620	PORTUGAL	Portugal	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pr	pri	630	PUERTO RICO	Puerto Rico	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
qa	qat	634	QATAR	Qatar	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
re	reu	638	REUNION	Reunion	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ro	rom	642	ROMANIA	Romania	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
hk	hkg	344	HONG KONG	Hong Kong	reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	\N	2026-01-14 07:22:56.509+00	2026-01-20 02:00:32.606+00	\N
ru	rus	643	RUSSIAN FEDERATION	Russian Federation	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
rw	rwa	646	RWANDA	Rwanda	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
bl	blm	652	SAINT BARTHÉLEMY	Saint Barthélemy	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sh	shn	654	SAINT HELENA	Saint Helena	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
kn	kna	659	SAINT KITTS AND NEVIS	Saint Kitts and Nevis	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
lc	lca	662	SAINT LUCIA	Saint Lucia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
mf	maf	663	SAINT MARTIN (FRENCH PART)	Saint Martin (French part)	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
pm	spm	666	SAINT PIERRE AND MIQUELON	Saint Pierre and Miquelon	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
vc	vct	670	SAINT VINCENT AND THE GRENADINES	Saint Vincent and the Grenadines	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ws	wsm	882	SAMOA	Samoa	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sm	smr	674	SAN MARINO	San Marino	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
st	stp	678	SAO TOME AND PRINCIPE	Sao Tome and Principe	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sa	sau	682	SAUDI ARABIA	Saudi Arabia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sn	sen	686	SENEGAL	Senegal	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
rs	srb	688	SERBIA	Serbia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sc	syc	690	SEYCHELLES	Seychelles	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sl	sle	694	SIERRA LEONE	Sierra Leone	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sg	sgp	702	SINGAPORE	Singapore	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sx	sxm	534	SINT MAARTEN	Sint Maarten	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sk	svk	703	SLOVAKIA	Slovakia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
si	svn	705	SLOVENIA	Slovenia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sb	slb	090	SOLOMON ISLANDS	Solomon Islands	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
so	som	706	SOMALIA	Somalia	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
za	zaf	710	SOUTH AFRICA	South Africa	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
gs	sgs	239	SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS	South Georgia and the South Sandwich Islands	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ss	ssd	728	SOUTH SUDAN	South Sudan	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
lk	lka	144	SRI LANKA	Sri Lanka	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sd	sdn	729	SUDAN	Sudan	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sr	sur	740	SURINAME	Suriname	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sj	sjm	744	SVALBARD AND JAN MAYEN	Svalbard and Jan Mayen	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sz	swz	748	SWAZILAND	Swaziland	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
ch	che	756	SWITZERLAND	Switzerland	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
sy	syr	760	SYRIAN ARAB REPUBLIC	Syrian Arab Republic	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.509+00	\N
tw	twn	158	TAIWAN, PROVINCE OF CHINA	Taiwan, Province of China	\N	\N	2026-01-14 07:22:56.509+00	2026-01-14 07:22:56.51+00	\N
tj	tjk	762	TAJIKISTAN	Tajikistan	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tz	tza	834	TANZANIA, UNITED REPUBLIC OF	Tanzania, United Republic of	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
th	tha	764	THAILAND	Thailand	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tl	tls	626	TIMOR LESTE	Timor Leste	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tg	tgo	768	TOGO	Togo	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tk	tkl	772	TOKELAU	Tokelau	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
to	ton	776	TONGA	Tonga	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tt	tto	780	TRINIDAD AND TOBAGO	Trinidad and Tobago	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tn	tun	788	TUNISIA	Tunisia	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tr	tur	792	TURKEY	Turkey	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tm	tkm	795	TURKMENISTAN	Turkmenistan	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tc	tca	796	TURKS AND CAICOS ISLANDS	Turks and Caicos Islands	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
tv	tuv	798	TUVALU	Tuvalu	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
ug	uga	800	UGANDA	Uganda	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
ua	ukr	804	UKRAINE	Ukraine	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
ae	are	784	UNITED ARAB EMIRATES	United Arab Emirates	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
us	usa	840	UNITED STATES	United States	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
um	umi	581	UNITED STATES MINOR OUTLYING ISLANDS	United States Minor Outlying Islands	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
uy	ury	858	URUGUAY	Uruguay	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
uz	uzb	860	UZBEKISTAN	Uzbekistan	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
vu	vut	548	VANUATU	Vanuatu	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
ve	ven	862	VENEZUELA	Venezuela	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
vn	vnm	704	VIET NAM	Viet Nam	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
vg	vgb	092	VIRGIN ISLANDS, BRITISH	Virgin Islands, British	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
vi	vir	850	VIRGIN ISLANDS, U.S.	Virgin Islands, U.S.	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
wf	wlf	876	WALLIS AND FUTUNA	Wallis and Futuna	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
eh	esh	732	WESTERN SAHARA	Western Sahara	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
ye	yem	887	YEMEN	Yemen	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
zm	zmb	894	ZAMBIA	Zambia	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
zw	zwe	716	ZIMBABWE	Zimbabwe	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
ax	ala	248	ÅLAND ISLANDS	Åland Islands	\N	\N	2026-01-14 07:22:56.51+00	2026-01-14 07:22:56.51+00	\N
dk	dnk	208	DENMARK	Denmark	reg_01KH7SJBVW27CE31NJWETDPNN3	\N	2026-01-14 07:22:56.508+00	2026-02-12 02:06:05.184+00	\N
fr	fra	250	FRANCE	France	reg_01KH7SJBVW27CE31NJWETDPNN3	\N	2026-01-14 07:22:56.509+00	2026-02-12 02:06:05.184+00	\N
de	deu	276	GERMANY	Germany	reg_01KH7SJBVW27CE31NJWETDPNN3	\N	2026-01-14 07:22:56.509+00	2026-02-12 02:06:05.184+00	\N
it	ita	380	ITALY	Italy	reg_01KH7SJBVW27CE31NJWETDPNN3	\N	2026-01-14 07:22:56.509+00	2026-02-12 02:06:05.185+00	\N
es	esp	724	SPAIN	Spain	reg_01KH7SJBVW27CE31NJWETDPNN3	\N	2026-01-14 07:22:56.509+00	2026-02-12 02:06:05.184+00	\N
se	swe	752	SWEDEN	Sweden	reg_01KH7SJBVW27CE31NJWETDPNN3	\N	2026-01-14 07:22:56.509+00	2026-02-12 02:06:05.185+00	\N
gb	gbr	826	UNITED KINGDOM	United Kingdom	reg_01KH7SJBVW27CE31NJWETDPNN3	\N	2026-01-14 07:22:56.51+00	2026-02-12 02:06:05.184+00	\N
\.


--
-- Data for Name: region_payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_payment_provider (region_id, payment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	pp_system_default	regpp_01KFCJ3P365XDT0FA4N3ZZ9DZP	2026-01-20 02:00:32.613893+00	2026-01-20 02:00:32.613893+00	\N
reg_01KEXP5SG4F1K07ZVNJBQR30FT	pp_system_default	regpp_01KEXP5SGK0NS49TXNT4JQJ2YP	2026-01-14 07:22:59.475177+00	2026-02-11 07:49:01.604+00	2026-02-11 07:49:01.603+00
reg_01KH7SJBVW27CE31NJWETDPNN3	pp_system_default	regpp_01KH7SJBWCFXZBY5ZGF6XRRQD9	2026-02-12 02:06:05.195939+00	2026-02-12 02:06:05.195939+00	\N
\.


--
-- Data for Name: reservation_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_item (id, created_at, updated_at, deleted_at, line_item_id, location_id, quantity, external_id, description, created_by, metadata, inventory_item_id, allow_backorder, raw_quantity) FROM stdin;
\.


--
-- Data for Name: return; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return (id, order_id, claim_id, exchange_id, order_version, display_id, status, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, received_at, canceled_at, location_id, requested_at, created_by) FROM stdin;
\.


--
-- Data for Name: return_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_fulfillment (return_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: return_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_item (id, return_id, reason_id, item_id, quantity, raw_quantity, received_quantity, raw_received_quantity, note, metadata, created_at, updated_at, deleted_at, damaged_quantity, raw_damaged_quantity) FROM stdin;
\.


--
-- Data for Name: return_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_reason (id, value, label, description, metadata, parent_return_reason_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel (id, name, description, is_disabled, metadata, created_at, updated_at, deleted_at) FROM stdin;
sc_01KEXP5SEB2P87PM49V5A9WTA8	Default Sales Channel	Created by Medusa	f	\N	2026-01-14 07:22:59.403+00	2026-01-14 07:22:59.403+00	\N
\.


--
-- Data for Name: sales_channel_stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel_stock_location (sales_channel_id, stock_location_id, id, created_at, updated_at, deleted_at) FROM stdin;
sc_01KEXP5SEB2P87PM49V5A9WTA8	sloc_01KEXP5SH53F9HTRK7BG7P16N7	scloc_01KEXP5SKFDRW52NSFEZG1W1T6	2026-01-14 07:22:59.565659+00	2026-01-14 07:22:59.565659+00	\N
\.


--
-- Data for Name: script_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.script_migrations (id, script_name, created_at, finished_at) FROM stdin;
1	migrate-product-shipping-profile.js	2026-01-14 07:22:57.149333+00	2026-01-14 07:22:57.168004+00
2	migrate-tax-region-provider.js	2026-01-14 07:22:57.169716+00	2026-01-14 07:22:57.177887+00
\.


--
-- Data for Name: service_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_zone (id, name, metadata, fulfillment_set_id, created_at, updated_at, deleted_at) FROM stdin;
serzo_01KEXP5SHQBXSHNEG41D5G01Q2	Europe	\N	fuset_01KEXP5SHQCTX37AQFF199TDE2	2026-01-14 07:22:59.511+00	2026-01-14 07:22:59.511+00	\N
\.


--
-- Data for Name: shipping_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, data, metadata, shipping_option_type_id, created_at, updated_at, deleted_at) FROM stdin;
so_01KEXP5SJJ2A9VBBGYH7JJ9PGV	Standard Shipping	flat	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	sp_01KEXP5Q8BW5PPR02XDD8K8RA9	manual_manual	\N	\N	sotype_01KEXP5SJHXSAGK6ENESKM6825	2026-01-14 07:22:59.538+00	2026-01-14 07:22:59.538+00	\N
so_01KEXP5SJJTR29BPP56G5ESYC8	Express Shipping	flat	serzo_01KEXP5SHQBXSHNEG41D5G01Q2	sp_01KEXP5Q8BW5PPR02XDD8K8RA9	manual_manual	\N	\N	sotype_01KEXP5SJJKK8MRK8ZX27TW89J	2026-01-14 07:22:59.538+00	2026-01-14 07:22:59.538+00	\N
\.


--
-- Data for Name: shipping_option_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_price_set (shipping_option_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
so_01KEXP5SJJ2A9VBBGYH7JJ9PGV	pset_01KEXP5SJVKC9E9ECQ2PAPX9NF	sops_01KEXP5SK94H0RW0GE90B8G279	2026-01-14 07:22:59.56187+00	2026-01-14 07:22:59.56187+00	\N
so_01KEXP5SJJTR29BPP56G5ESYC8	pset_01KEXP5SJVZSA5NNNBPF07DJFJ	sops_01KEXP5SKA9PSG8GJP3ZAGZ037	2026-01-14 07:22:59.56187+00	2026-01-14 07:22:59.56187+00	\N
\.


--
-- Data for Name: shipping_option_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_rule (id, attribute, operator, value, shipping_option_id, created_at, updated_at, deleted_at) FROM stdin;
sorul_01KEXP5SJJ8ZC93PWC9G6A7THK	enabled_in_store	eq	"true"	so_01KEXP5SJJ2A9VBBGYH7JJ9PGV	2026-01-14 07:22:59.538+00	2026-01-14 07:22:59.538+00	\N
sorul_01KEXP5SJJB21GW8HFC1DQB3MA	is_return	eq	"false"	so_01KEXP5SJJ2A9VBBGYH7JJ9PGV	2026-01-14 07:22:59.539+00	2026-01-14 07:22:59.539+00	\N
sorul_01KEXP5SJJ3ZCA9GNP1FJF0V3W	enabled_in_store	eq	"true"	so_01KEXP5SJJTR29BPP56G5ESYC8	2026-01-14 07:22:59.539+00	2026-01-14 07:22:59.539+00	\N
sorul_01KEXP5SJJ5BEC0KKSWZY6CQEZ	is_return	eq	"false"	so_01KEXP5SJJTR29BPP56G5ESYC8	2026-01-14 07:22:59.539+00	2026-01-14 07:22:59.539+00	\N
\.


--
-- Data for Name: shipping_option_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_type (id, label, description, code, created_at, updated_at, deleted_at) FROM stdin;
sotype_01KEXP5SJHXSAGK6ENESKM6825	Standard	Ship in 2-3 days.	standard	2026-01-14 07:22:59.538+00	2026-01-14 07:22:59.538+00	\N
sotype_01KEXP5SJJKK8MRK8ZX27TW89J	Express	Ship in 24 hours.	express	2026-01-14 07:22:59.538+00	2026-01-14 07:22:59.538+00	\N
\.


--
-- Data for Name: shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_profile (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
sp_01KEXP5Q8BW5PPR02XDD8K8RA9	Default Shipping Profile	default	\N	2026-01-14 07:22:57.163+00	2026-01-14 07:22:57.163+00	\N
\.


--
-- Data for Name: stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location (id, created_at, updated_at, deleted_at, name, address_id, metadata) FROM stdin;
sloc_01KEXP5SH53F9HTRK7BG7P16N7	2026-01-14 07:22:59.493+00	2026-01-14 07:22:59.493+00	\N	European Warehouse	laddr_01KEXP5SH4PVCQVPR7XZYQJS6D	\N
\.


--
-- Data for Name: stock_location_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location_address (id, created_at, updated_at, deleted_at, address_1, address_2, company, city, country_code, phone, province, postal_code, metadata) FROM stdin;
laddr_01KEXP5SH4PVCQVPR7XZYQJS6D	2026-01-14 07:22:59.493+00	2026-01-14 07:22:59.493+00	\N		\N	\N	Copenhagen	DK	\N	\N	\N	\N
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store (id, name, default_sales_channel_id, default_region_id, default_location_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
store_01KEXP5SENWJTQZFTYXZQWFDX5	Medusa Store	sc_01KEXP5SEB2P87PM49V5A9WTA8	reg_01KFCJ3P2TEK5Z4P62KBVTAZ3P	sloc_01KEXP5SH53F9HTRK7BG7P16N7	\N	2026-01-14 07:22:59.412928+00	2026-01-14 07:22:59.412928+00	\N
\.


--
-- Data for Name: store_currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_currency (id, currency_code, is_default, store_id, created_at, updated_at, deleted_at) FROM stdin;
stocur_01KJ0BSDEW1B7R8JDSG40XPJHP	eur	t	store_01KEXP5SENWJTQZFTYXZQWFDX5	2026-02-21 15:06:16.920296+00	2026-02-21 15:06:16.920296+00	\N
stocur_01KJ0BSDEWFW4K3XZ8VM77EMV5	usd	f	store_01KEXP5SENWJTQZFTYXZQWFDX5	2026-02-21 15:06:16.920296+00	2026-02-21 15:06:16.920296+00	\N
\.


--
-- Data for Name: store_locale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_locale (id, locale_code, store_id, created_at, updated_at, deleted_at) FROM stdin;
stloc_01KFYNV7GQ01415CBQW99KVM5H	zh-TW	store_01KEXP5SENWJTQZFTYXZQWFDX5	2026-01-27 02:52:09.621167+00	2026-01-27 02:52:09.621167+00	\N
\.


--
-- Data for Name: tax_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
tp_system	t	2026-01-14 07:22:56.525+00	2026-01-14 07:22:56.525+00	\N
\.


--
-- Data for Name: tax_rate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate (id, rate, code, name, is_default, is_combinable, tax_region_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_rate_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate_rule (id, tax_rate_id, reference_id, reference, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_region (id, provider_id, country_code, province_code, parent_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
txreg_01KEXP5SGVWK3DKNEC83RTN6M3	tp_system	gb	\N	\N	\N	2026-01-14 07:22:59.484+00	2026-01-14 07:22:59.484+00	\N	\N
txreg_01KEXP5SGWEJ112MHEN6Z9VK1A	tp_system	se	\N	\N	\N	2026-01-14 07:22:59.484+00	2026-01-27 03:47:24.549+00	\N	2026-01-27 03:47:24.548+00
txreg_01KEXP5SGWCK55QAP4TY512Z27	tp_system	it	\N	\N	\N	2026-01-14 07:22:59.484+00	2026-01-27 03:47:27.332+00	\N	2026-01-27 03:47:27.331+00
txreg_01KEXP5SGW1M4JPW5SH87BZK1Z	tp_system	fr	\N	\N	\N	2026-01-14 07:22:59.484+00	2026-01-27 03:47:30.863+00	\N	2026-01-27 03:47:30.863+00
txreg_01KEXP5SGWB7BPTSCYM108JH2D	tp_system	es	\N	\N	\N	2026-01-14 07:22:59.484+00	2026-01-27 03:47:33.312+00	\N	2026-01-27 03:47:33.311+00
txreg_01KEXP5SGWJFDWBCMR4VS9XWVY	tp_system	dk	\N	\N	\N	2026-01-14 07:22:59.484+00	2026-01-27 03:47:35.988+00	\N	2026-01-27 03:47:35.988+00
txreg_01KEXP5SGW0MJSWR8VNFJEVRK8	tp_system	de	\N	\N	\N	2026-01-14 07:22:59.484+00	2026-01-27 03:47:38.914+00	\N	2026-01-27 03:47:38.914+00
\.


--
-- Data for Name: translation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.translation (id, reference_id, reference, locale_code, translations, created_at, updated_at, deleted_at, translated_field_count) FROM stdin;
trans_01KFYNRSPD1RTRXHY7VJHTBSV5	prod_01KFMA7633M0GS3YF54WQWK8V5	product	zh-TW	{"title": "Boho手挽袋", "material": "", "subtitle": "", "description": "Size: 70cm x 60cm\\n\\n=======================\\n此網頁只用作產品目錄，如需購買請到Instagram inbox (@wonderhin.handmade)\\n\\n-全部產品是人手製作\\n-訂單滿300港元可免運費（只限順豐智能櫃或順豐站自取)\\n-實物與圖片可能存在色差的情況，以實物顏色為準"}	2026-01-27 02:50:49.933+00	2026-01-27 02:50:49.933+00	\N	2
trans_01KFZ9SZ57T6BQQ17G3A0DVEDN	01KFAD2WXX5QCGG5A12TG6N9TH	brand	zh-TW	{"name": "宜家"}	2026-01-27 08:40:59.815+00	2026-01-27 08:40:59.815+00	\N	1
trans_01KFZ9SZ57RHMBQYRD8S08YDS1	01KFAFZZR8536Y5GQM4BAA3K6K	brand	zh-TW	{"name": "宜家"}	2026-01-27 08:40:59.815+00	2026-01-27 08:40:59.815+00	\N	1
trans_01KFZ9SZ57GKYM2224DBV9A27N	01KFCR0V2MC2XZHHXNAYJP64ZG	brand	zh-TW	{"name": "國泰"}	2026-01-27 08:40:59.815+00	2026-01-27 08:40:59.815+00	\N	1
trans_01KH5PNVVKSJE6S5N10AV2E37E	prod_01KH5AEZE0APZ33X6WEET8PT9J	product	zh-TW	{"title": "和風Lunch棉袋 (櫻花盛放 🌸 )", "material": "", "subtitle": "", "description": "和風Lunch 棉袋 🎏全新Summer系列☀️\\n\\n小袋子大容量\\n遠看就像拿著粽子般可愛 銀包、紙巾、唇膏、手機，通通都有容身之所 外出午飯時就怕周圍跌 | 同事羨慕之選\\n尺寸:32cm W x 34cm H"}	2026-02-11 06:37:05.267+00	2026-02-11 06:37:05.267+00	\N	2
\.


--
-- Data for Name: translation_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.translation_settings (id, entity_type, fields, created_at, updated_at, deleted_at, is_active) FROM stdin;
trset_01KFYN5RK2HSCQX9N20NF82MQM	product	["title", "description", "material", "subtitle"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK2S74AYEEWPPKQB47W	product_variant	["title", "material"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK2RW7T4NKVQ2YG5NMX	product_type	["value"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK28GH74GCEE95H79A8	product_collection	["title"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK25Y7FAE1T4VSHDM1M	product_category	["name", "description"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK2TF0BRE3MHRKR2FCS	product_tag	["value"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK36STG4WH39Z72ANDB	product_option	["title"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK3KRKATEHS4CPDFWFY	product_option_value	["value"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK35JAK2TJ3FP8RMKPR	region	["name"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK3PTAVTMF0N2PRYY2M	customer_group	["name"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK3TK52CT6SXW641MWK	shipping_option	["name"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK3KMJGJ2A13BS01BY8	shipping_option_type	["label", "description"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFYN5RK3CY01EMW6T003NYVJ	tax_rate	["name"]	2026-01-27 02:40:26.211+00	2026-01-27 02:40:26.211+00	\N	t
trset_01KFZ9RFK4KHVRYVXHN6HCFZC0	brand	["name"]	2026-01-27 08:40:11.108+00	2026-01-27 10:45:09.567+00	\N	t
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, first_name, last_name, email, avatar_url, metadata, created_at, updated_at, deleted_at) FROM stdin;
user_01KEXPMZVWQX77SXGJHER0CY4A			admin@test.com	\N	\N	2026-01-14 07:31:17.5+00	2026-01-15 03:45:09.851+00	\N
\.


--
-- Data for Name: user_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preference (id, user_id, key, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_rbac_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_rbac_role (user_id, rbac_role_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: view_configuration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.view_configuration (id, entity, name, user_id, is_system_default, configuration, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: workflow_execution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_execution (id, workflow_id, transaction_id, execution, context, state, created_at, updated_at, deleted_at, retention_time, run_id) FROM stdin;
\.


--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.link_module_migrations_id_seq', 1577, true);


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 162, true);


--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_change_action_ordering_seq', 1, false);


--
-- Name: order_claim_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_claim_display_id_seq', 1, false);


--
-- Name: order_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_display_id_seq', 1, false);


--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_exchange_display_id_seq', 1, false);


--
-- Name: return_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_display_id_seq', 1, false);


--
-- Name: script_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.script_migrations_id_seq', 2, true);


--
-- Name: account_holder account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_holder
    ADD CONSTRAINT account_holder_pkey PRIMARY KEY (id);


--
-- Name: api_key api_key_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_key
    ADD CONSTRAINT api_key_pkey PRIMARY KEY (id);


--
-- Name: application_method_buy_rules application_method_buy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: application_method_target_rules application_method_target_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: auth_identity auth_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_identity
    ADD CONSTRAINT auth_identity_pkey PRIMARY KEY (id);


--
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (id);


--
-- Name: capture capture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_pkey PRIMARY KEY (id);


--
-- Name: cart_address cart_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_address
    ADD CONSTRAINT cart_address_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item cart_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: cart_payment_collection cart_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_payment_collection
    ADD CONSTRAINT cart_payment_collection_pkey PRIMARY KEY (cart_id, payment_collection_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart_promotion cart_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_promotion
    ADD CONSTRAINT cart_promotion_pkey PRIMARY KEY (cart_id, promotion_id);


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method cart_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: category_image category_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_image
    ADD CONSTRAINT category_image_pkey PRIMARY KEY (id);


--
-- Name: credit_line credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_pkey PRIMARY KEY (id);


--
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (code);


--
-- Name: customer_account_holder customer_account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_account_holder
    ADD CONSTRAINT customer_account_holder_pkey PRIMARY KEY (customer_id, account_holder_id);


--
-- Name: customer_address customer_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_pkey PRIMARY KEY (id);


--
-- Name: customer_group_customer customer_group_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_pkey PRIMARY KEY (id);


--
-- Name: customer_group customer_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group
    ADD CONSTRAINT customer_group_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_address fulfillment_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_address
    ADD CONSTRAINT fulfillment_address_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_item fulfillment_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_label fulfillment_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_pkey PRIMARY KEY (id);


--
-- Name: fulfillment fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_provider fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_provider
    ADD CONSTRAINT fulfillment_provider_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_set fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_set
    ADD CONSTRAINT fulfillment_set_pkey PRIMARY KEY (id);


--
-- Name: geo_zone geo_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: inventory_item inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_item
    ADD CONSTRAINT inventory_item_pkey PRIMARY KEY (id);


--
-- Name: inventory_level inventory_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_pkey PRIMARY KEY (id);


--
-- Name: invite invite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_table_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_table_name_key UNIQUE (table_name);


--
-- Name: locale locale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locale
    ADD CONSTRAINT locale_pkey PRIMARY KEY (id);


--
-- Name: location_fulfillment_provider location_fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_provider
    ADD CONSTRAINT location_fulfillment_provider_pkey PRIMARY KEY (stock_location_id, fulfillment_provider_id);


--
-- Name: location_fulfillment_set location_fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_set
    ADD CONSTRAINT location_fulfillment_set_pkey PRIMARY KEY (stock_location_id, fulfillment_set_id);


--
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: notification_provider notification_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_provider
    ADD CONSTRAINT notification_provider_pkey PRIMARY KEY (id);


--
-- Name: order_address order_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_address
    ADD CONSTRAINT order_address_pkey PRIMARY KEY (id);


--
-- Name: order_cart order_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_cart
    ADD CONSTRAINT order_cart_pkey PRIMARY KEY (order_id, cart_id);


--
-- Name: order_change_action order_change_action_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_pkey PRIMARY KEY (id);


--
-- Name: order_change order_change_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item_image order_claim_item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item_image
    ADD CONSTRAINT order_claim_item_image_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item order_claim_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item
    ADD CONSTRAINT order_claim_item_pkey PRIMARY KEY (id);


--
-- Name: order_claim order_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim
    ADD CONSTRAINT order_claim_pkey PRIMARY KEY (id);


--
-- Name: order_credit_line order_credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_pkey PRIMARY KEY (id);


--
-- Name: order_exchange_item order_exchange_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange_item
    ADD CONSTRAINT order_exchange_item_pkey PRIMARY KEY (id);


--
-- Name: order_exchange order_exchange_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange
    ADD CONSTRAINT order_exchange_pkey PRIMARY KEY (id);


--
-- Name: order_fulfillment order_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_fulfillment
    ADD CONSTRAINT order_fulfillment_pkey PRIMARY KEY (order_id, fulfillment_id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_adjustment order_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_line_item order_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_tax_line order_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_payment_collection order_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_payment_collection
    ADD CONSTRAINT order_payment_collection_pkey PRIMARY KEY (order_id, payment_collection_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: order_promotion order_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotion
    ADD CONSTRAINT order_promotion_pkey PRIMARY KEY (order_id, promotion_id);


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method order_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method
    ADD CONSTRAINT order_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_shipping order_shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_pkey PRIMARY KEY (id);


--
-- Name: order_summary order_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_pkey PRIMARY KEY (id);


--
-- Name: order_transaction order_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_pkey PRIMARY KEY (id);


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_pkey PRIMARY KEY (payment_collection_id, payment_provider_id);


--
-- Name: payment_collection payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection
    ADD CONSTRAINT payment_collection_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: payment_provider payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_provider
    ADD CONSTRAINT payment_provider_pkey PRIMARY KEY (id);


--
-- Name: payment_session payment_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_pkey PRIMARY KEY (id);


--
-- Name: price_list price_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list
    ADD CONSTRAINT price_list_pkey PRIMARY KEY (id);


--
-- Name: price_list_rule price_list_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_pkey PRIMARY KEY (id);


--
-- Name: price price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_pkey PRIMARY KEY (id);


--
-- Name: price_preference price_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_preference
    ADD CONSTRAINT price_preference_pkey PRIMARY KEY (id);


--
-- Name: price_rule price_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_pkey PRIMARY KEY (id);


--
-- Name: price_set price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_set
    ADD CONSTRAINT price_set_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);


--
-- Name: product_category_product product_category_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_pkey PRIMARY KEY (product_id, product_category_id);


--
-- Name: product_collection product_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT product_collection_pkey PRIMARY KEY (id);


--
-- Name: product_option product_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_pkey PRIMARY KEY (id);


--
-- Name: product_option_value product_option_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_product_brand_brand product_product_brand_brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_product_brand_brand
    ADD CONSTRAINT product_product_brand_brand_pkey PRIMARY KEY (product_id, brand_id);


--
-- Name: product_product_category_categoryimage_category_image product_product_category_categoryimage_category_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_product_category_categoryimage_category_image
    ADD CONSTRAINT product_product_category_categoryimage_category_image_pkey PRIMARY KEY (product_category_id, category_image_id);


--
-- Name: product_sales_channel product_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_channel
    ADD CONSTRAINT product_sales_channel_pkey PRIMARY KEY (product_id, sales_channel_id);


--
-- Name: product_shipping_profile product_shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_shipping_profile
    ADD CONSTRAINT product_shipping_profile_pkey PRIMARY KEY (product_id, shipping_profile_id);


--
-- Name: product_tag product_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tag
    ADD CONSTRAINT product_tag_pkey PRIMARY KEY (id);


--
-- Name: product_tags product_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, product_tag_id);


--
-- Name: product_type product_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT product_type_pkey PRIMARY KEY (id);


--
-- Name: product_variant_inventory_item product_variant_inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_inventory_item
    ADD CONSTRAINT product_variant_inventory_item_pkey PRIMARY KEY (variant_id, inventory_item_id);


--
-- Name: product_variant_option product_variant_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_pkey PRIMARY KEY (variant_id, option_value_id);


--
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (id);


--
-- Name: product_variant_price_set product_variant_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_price_set
    ADD CONSTRAINT product_variant_price_set_pkey PRIMARY KEY (variant_id, price_set_id);


--
-- Name: product_variant_product_image product_variant_product_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_pkey PRIMARY KEY (id);


--
-- Name: promotion_application_method promotion_application_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget promotion_campaign_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign promotion_campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign
    ADD CONSTRAINT promotion_campaign_pkey PRIMARY KEY (id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (id);


--
-- Name: promotion_promotion_rule promotion_promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_pkey PRIMARY KEY (promotion_id, promotion_rule_id);


--
-- Name: promotion_rule promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule
    ADD CONSTRAINT promotion_rule_pkey PRIMARY KEY (id);


--
-- Name: promotion_rule_value promotion_rule_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_pkey PRIMARY KEY (id);


--
-- Name: provider_identity provider_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_pkey PRIMARY KEY (id);


--
-- Name: publishable_api_key_sales_channel publishable_api_key_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishable_api_key_sales_channel
    ADD CONSTRAINT publishable_api_key_sales_channel_pkey PRIMARY KEY (publishable_key_id, sales_channel_id);


--
-- Name: refund refund_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_pkey PRIMARY KEY (id);


--
-- Name: refund_reason refund_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_reason
    ADD CONSTRAINT refund_reason_pkey PRIMARY KEY (id);


--
-- Name: region_country region_country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_pkey PRIMARY KEY (iso_2);


--
-- Name: region_payment_provider region_payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_payment_provider
    ADD CONSTRAINT region_payment_provider_pkey PRIMARY KEY (region_id, payment_provider_id);


--
-- Name: region region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: reservation_item reservation_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_pkey PRIMARY KEY (id);


--
-- Name: return_fulfillment return_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_fulfillment
    ADD CONSTRAINT return_fulfillment_pkey PRIMARY KEY (return_id, fulfillment_id);


--
-- Name: return_item return_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT return_item_pkey PRIMARY KEY (id);


--
-- Name: return return_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT return_pkey PRIMARY KEY (id);


--
-- Name: return_reason return_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_pkey PRIMARY KEY (id);


--
-- Name: sales_channel sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel
    ADD CONSTRAINT sales_channel_pkey PRIMARY KEY (id);


--
-- Name: sales_channel_stock_location sales_channel_stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel_stock_location
    ADD CONSTRAINT sales_channel_stock_location_pkey PRIMARY KEY (sales_channel_id, stock_location_id);


--
-- Name: script_migrations script_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations
    ADD CONSTRAINT script_migrations_pkey PRIMARY KEY (id);


--
-- Name: service_zone service_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_pkey PRIMARY KEY (id);


--
-- Name: shipping_option shipping_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_price_set shipping_option_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_price_set
    ADD CONSTRAINT shipping_option_price_set_pkey PRIMARY KEY (shipping_option_id, price_set_id);


--
-- Name: shipping_option_rule shipping_option_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_type shipping_option_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_type
    ADD CONSTRAINT shipping_option_type_pkey PRIMARY KEY (id);


--
-- Name: shipping_profile shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_profile
    ADD CONSTRAINT shipping_profile_pkey PRIMARY KEY (id);


--
-- Name: stock_location_address stock_location_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location_address
    ADD CONSTRAINT stock_location_address_pkey PRIMARY KEY (id);


--
-- Name: stock_location stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_pkey PRIMARY KEY (id);


--
-- Name: store_currency store_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_pkey PRIMARY KEY (id);


--
-- Name: store_locale store_locale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_pkey PRIMARY KEY (id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: tax_provider tax_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_provider
    ADD CONSTRAINT tax_provider_pkey PRIMARY KEY (id);


--
-- Name: tax_rate tax_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT tax_rate_pkey PRIMARY KEY (id);


--
-- Name: tax_rate_rule tax_rate_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT tax_rate_rule_pkey PRIMARY KEY (id);


--
-- Name: tax_region tax_region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT tax_region_pkey PRIMARY KEY (id);


--
-- Name: translation translation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translation
    ADD CONSTRAINT translation_pkey PRIMARY KEY (id);


--
-- Name: translation_settings translation_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translation_settings
    ADD CONSTRAINT translation_settings_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_preference user_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preference
    ADD CONSTRAINT user_preference_pkey PRIMARY KEY (id);


--
-- Name: user_rbac_role user_rbac_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rbac_role
    ADD CONSTRAINT user_rbac_role_pkey PRIMARY KEY (user_id, rbac_role_id);


--
-- Name: view_configuration view_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_configuration
    ADD CONSTRAINT view_configuration_pkey PRIMARY KEY (id);


--
-- Name: workflow_execution workflow_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_execution
    ADD CONSTRAINT workflow_execution_pkey PRIMARY KEY (workflow_id, transaction_id, run_id);


--
-- Name: IDX_account_holder_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_deleted_at" ON public.account_holder USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_id_5cb3a0c0" ON public.customer_account_holder USING btree (account_holder_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_provider_id_external_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_account_holder_provider_id_external_id_unique" ON public.account_holder USING btree (provider_id, external_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_deleted_at" ON public.api_key USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_redacted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_redacted" ON public.api_key USING btree (redacted) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_revoked_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_revoked_at" ON public.api_key USING btree (revoked_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_token_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_api_key_token_unique" ON public.api_key USING btree (token);


--
-- Name: IDX_api_key_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_type" ON public.api_key USING btree (type);


--
-- Name: IDX_application_method_allocation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_allocation" ON public.promotion_application_method USING btree (allocation);


--
-- Name: IDX_application_method_target_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_target_type" ON public.promotion_application_method USING btree (target_type);


--
-- Name: IDX_application_method_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_type" ON public.promotion_application_method USING btree (type);


--
-- Name: IDX_auth_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_auth_identity_deleted_at" ON public.auth_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_brand_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_brand_deleted_at" ON public.brand USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_brand_id_29c624132; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_brand_id_29c624132" ON public.product_product_brand_brand USING btree (brand_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_campaign_budget_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_campaign_budget_type" ON public.promotion_campaign_budget USING btree (type);


--
-- Name: IDX_capture_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_deleted_at" ON public.capture USING btree (deleted_at);


--
-- Name: IDX_capture_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_payment_id" ON public.capture USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_address_deleted_at" ON public.cart_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_billing_address_id" ON public.cart USING btree (billing_address_id) WHERE ((deleted_at IS NULL) AND (billing_address_id IS NOT NULL));


--
-- Name: IDX_cart_credit_line_reference_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_credit_line_reference_reference_id" ON public.credit_line USING btree (reference, reference_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_currency_code" ON public.cart USING btree (currency_code);


--
-- Name: IDX_cart_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_customer_id" ON public.cart USING btree (customer_id) WHERE ((deleted_at IS NULL) AND (customer_id IS NOT NULL));


--
-- Name: IDX_cart_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_deleted_at" ON public.cart USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-4a39f6c9" ON public.cart_payment_collection USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-71069c16" ON public.order_cart USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-a9d4a70b" ON public.cart_promotion USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_deleted_at" ON public.cart_line_item_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_item_id" ON public.cart_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_cart_id" ON public.cart_line_item USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_deleted_at" ON public.cart_line_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_deleted_at" ON public.cart_line_item_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_item_id" ON public.cart_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_region_id" ON public.cart USING btree (region_id) WHERE ((deleted_at IS NULL) AND (region_id IS NOT NULL));


--
-- Name: IDX_cart_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_sales_channel_id" ON public.cart USING btree (sales_channel_id) WHERE ((deleted_at IS NULL) AND (sales_channel_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_address_id" ON public.cart USING btree (shipping_address_id) WHERE ((deleted_at IS NULL) AND (shipping_address_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_method_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_deleted_at" ON public.cart_shipping_method_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_shipping_method_id" ON public.cart_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_cart_id" ON public.cart_shipping_method USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_deleted_at" ON public.cart_shipping_method USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_deleted_at" ON public.cart_shipping_method_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_shipping_method_id" ON public.cart_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_category_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_category_handle_unique" ON public.product_category USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_category_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_category_image_deleted_at" ON public.category_image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_category_image_id_2e4823822; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_category_image_id_2e4823822" ON public.product_product_category_categoryimage_category_image USING btree (category_image_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_collection_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_collection_handle_unique" ON public.product_collection USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_cart_id" ON public.credit_line USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_deleted_at" ON public.credit_line USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_customer_id" ON public.customer_address USING btree (customer_id);


--
-- Name: IDX_customer_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_deleted_at" ON public.customer_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_unique_customer_billing; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_billing" ON public.customer_address USING btree (customer_id) WHERE (is_default_billing = true);


--
-- Name: IDX_customer_address_unique_customer_shipping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_shipping" ON public.customer_address USING btree (customer_id) WHERE (is_default_shipping = true);


--
-- Name: IDX_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_deleted_at" ON public.customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_email_has_account_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_email_has_account_unique" ON public.customer USING btree (email, has_account) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_group_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_group_id" ON public.customer_group_customer USING btree (customer_group_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_id" ON public.customer_group_customer USING btree (customer_id);


--
-- Name: IDX_customer_group_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_deleted_at" ON public.customer_group_customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_deleted_at" ON public.customer_group USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_group_name_unique" ON public.customer_group USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_id_5cb3a0c0" ON public.customer_account_holder USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_deleted_at_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1e5992737" ON public.location_fulfillment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-31ea43a" ON public.return_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-4a39f6c9" ON public.cart_payment_collection USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71069c16" ON public.order_cart USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71518339" ON public.order_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-a9d4a70b" ON public.cart_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e88adb96" ON public.location_fulfillment_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e8d2543e" ON public.order_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17a262437" ON public.product_shipping_profile USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17b4c4e35" ON public.product_variant_inventory_item USING btree (deleted_at);


--
-- Name: IDX_deleted_at_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_1c934dab0" ON public.region_payment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_20b454295" ON public.product_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_26d06f470" ON public.sales_channel_stock_location USING btree (deleted_at);


--
-- Name: IDX_deleted_at_29c624132; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_29c624132" ON public.product_product_brand_brand USING btree (deleted_at);


--
-- Name: IDX_deleted_at_2e4823822; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_2e4823822" ON public.product_product_category_categoryimage_category_image USING btree (deleted_at);


--
-- Name: IDX_deleted_at_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_52b23597" ON public.product_variant_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_5cb3a0c0" ON public.customer_account_holder USING btree (deleted_at);


--
-- Name: IDX_deleted_at_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_64ff0c4c" ON public.user_rbac_role USING btree (deleted_at);


--
-- Name: IDX_deleted_at_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_ba32fa9c" ON public.shipping_option_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_f42b9949" ON public.order_payment_collection USING btree (deleted_at);


--
-- Name: IDX_fulfillment_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_address_deleted_at" ON public.fulfillment_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_deleted_at" ON public.fulfillment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-31ea43a" ON public.return_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-e8d2543e" ON public.order_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_deleted_at" ON public.fulfillment_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_item_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_fulfillment_id" ON public.fulfillment_item USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_inventory_item_id" ON public.fulfillment_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_line_item_id" ON public.fulfillment_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_label_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_deleted_at" ON public.fulfillment_label USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_label_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_fulfillment_id" ON public.fulfillment_label USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_location_id" ON public.fulfillment USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_deleted_at" ON public.fulfillment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_id_-1e5992737" ON public.location_fulfillment_provider USING btree (fulfillment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_deleted_at" ON public.fulfillment_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_set_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_id_-e88adb96" ON public.location_fulfillment_set USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fulfillment_set_name_unique" ON public.fulfillment_set USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_shipping_option_id" ON public.fulfillment USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_city" ON public.geo_zone USING btree (city) WHERE ((deleted_at IS NULL) AND (city IS NOT NULL));


--
-- Name: IDX_geo_zone_country_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_country_code" ON public.geo_zone USING btree (country_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_deleted_at" ON public.geo_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_geo_zone_province_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_province_code" ON public.geo_zone USING btree (province_code) WHERE ((deleted_at IS NULL) AND (province_code IS NOT NULL));


--
-- Name: IDX_geo_zone_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_service_zone_id" ON public.geo_zone USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (id);


--
-- Name: IDX_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1e5992737" ON public.location_fulfillment_provider USING btree (id);


--
-- Name: IDX_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-31ea43a" ON public.return_fulfillment USING btree (id);


--
-- Name: IDX_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-4a39f6c9" ON public.cart_payment_collection USING btree (id);


--
-- Name: IDX_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71069c16" ON public.order_cart USING btree (id);


--
-- Name: IDX_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71518339" ON public.order_promotion USING btree (id);


--
-- Name: IDX_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-a9d4a70b" ON public.cart_promotion USING btree (id);


--
-- Name: IDX_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e88adb96" ON public.location_fulfillment_set USING btree (id);


--
-- Name: IDX_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e8d2543e" ON public.order_fulfillment USING btree (id);


--
-- Name: IDX_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17a262437" ON public.product_shipping_profile USING btree (id);


--
-- Name: IDX_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (id);


--
-- Name: IDX_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_1c934dab0" ON public.region_payment_provider USING btree (id);


--
-- Name: IDX_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_20b454295" ON public.product_sales_channel USING btree (id);


--
-- Name: IDX_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_26d06f470" ON public.sales_channel_stock_location USING btree (id);


--
-- Name: IDX_id_29c624132; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_29c624132" ON public.product_product_brand_brand USING btree (id);


--
-- Name: IDX_id_2e4823822; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_2e4823822" ON public.product_product_category_categoryimage_category_image USING btree (id);


--
-- Name: IDX_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_52b23597" ON public.product_variant_price_set USING btree (id);


--
-- Name: IDX_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_5cb3a0c0" ON public.customer_account_holder USING btree (id);


--
-- Name: IDX_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_64ff0c4c" ON public.user_rbac_role USING btree (id);


--
-- Name: IDX_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_ba32fa9c" ON public.shipping_option_price_set USING btree (id);


--
-- Name: IDX_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_f42b9949" ON public.order_payment_collection USING btree (id);


--
-- Name: IDX_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_deleted_at" ON public.image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_image_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_product_id" ON public.image USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_deleted_at" ON public.inventory_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_item_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_item_sku" ON public.inventory_item USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_deleted_at" ON public.inventory_level USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_level_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_location_id" ON public.inventory_level USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_level_location_id_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id, location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_deleted_at" ON public.invite USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_invite_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_invite_email_unique" ON public.invite USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_token" ON public.invite USING btree (token) WHERE (deleted_at IS NULL);


--
-- Name: IDX_line_item_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_adjustment_promotion_id" ON public.cart_line_item_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_id" ON public.cart_line_item USING btree (product_id) WHERE ((deleted_at IS NULL) AND (product_id IS NOT NULL));


--
-- Name: IDX_line_item_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_type_id" ON public.order_line_item USING btree (product_type_id) WHERE ((deleted_at IS NULL) AND (product_type_id IS NOT NULL));


--
-- Name: IDX_line_item_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_tax_line_tax_rate_id" ON public.cart_line_item_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_variant_id" ON public.cart_line_item USING btree (variant_id) WHERE ((deleted_at IS NULL) AND (variant_id IS NOT NULL));


--
-- Name: IDX_locale_code_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_locale_code_unique" ON public.locale USING btree (code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_locale_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_locale_deleted_at" ON public.locale USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_deleted_at" ON public.notification USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_idempotency_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_notification_idempotency_key_unique" ON public.notification USING btree (idempotency_key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_deleted_at" ON public.notification_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_id" ON public.notification USING btree (provider_id);


--
-- Name: IDX_notification_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_receiver_id" ON public.notification USING btree (receiver_id);


--
-- Name: IDX_option_product_id_title_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_product_id_title_unique" ON public.product_option USING btree (product_id, title) WHERE (deleted_at IS NULL);


--
-- Name: IDX_option_value_option_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_value_option_id_unique" ON public.product_option_value USING btree (option_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_customer_id" ON public.order_address USING btree (customer_id);


--
-- Name: IDX_order_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_deleted_at" ON public.order_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_billing_address_id" ON public."order" USING btree (billing_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_claim_id" ON public.order_change_action USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_deleted_at" ON public.order_change_action USING btree (deleted_at);


--
-- Name: IDX_order_change_action_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_exchange_id" ON public.order_change_action USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_order_change_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_change_id" ON public.order_change_action USING btree (order_change_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_id" ON public.order_change_action USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_ordering; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_ordering" ON public.order_change_action USING btree (ordering) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_return_id" ON public.order_change_action USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_change_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_change_type" ON public.order_change USING btree (change_type);


--
-- Name: IDX_order_change_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_claim_id" ON public.order_change USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_deleted_at" ON public.order_change USING btree (deleted_at);


--
-- Name: IDX_order_change_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_exchange_id" ON public.order_change USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id" ON public.order_change USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id_version" ON public.order_change USING btree (order_id, version);


--
-- Name: IDX_order_change_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_return_id" ON public.order_change USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_status" ON public.order_change USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_version" ON public.order_change USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_deleted_at" ON public.order_claim USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_display_id" ON public.order_claim USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_claim_id" ON public.order_claim_item USING btree (claim_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_deleted_at" ON public.order_claim_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_claim_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_claim_item_id" ON public.order_claim_item_image USING btree (claim_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_deleted_at" ON public.order_claim_item_image USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_claim_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_item_id" ON public.order_claim_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_order_id" ON public.order_claim USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_return_id" ON public.order_claim USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_deleted_at" ON public.order_credit_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_credit_line_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id" ON public.order_credit_line USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_credit_line_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id_version" ON public.order_credit_line USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_currency_code" ON public."order" USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_custom_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_order_custom_display_id" ON public."order" USING btree (custom_display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_customer_id" ON public."order" USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_deleted_at" ON public."order" USING btree (deleted_at);


--
-- Name: IDX_order_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_display_id" ON public."order" USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_deleted_at" ON public.order_exchange USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_display_id" ON public.order_exchange USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_deleted_at" ON public.order_exchange_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_exchange_id" ON public.order_exchange_item USING btree (exchange_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_item_id" ON public.order_exchange_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_order_id" ON public.order_exchange USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_return_id" ON public.order_exchange USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71069c16" ON public.order_cart USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71518339" ON public.order_promotion USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-e8d2543e" ON public.order_fulfillment USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_f42b9949" ON public.order_payment_collection USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_is_draft_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_is_draft_order" ON public."order" USING btree (is_draft_order) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_deleted_at" ON public.order_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_item_id" ON public.order_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id" ON public.order_item USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id_version" ON public.order_item USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_adjustment_item_id" ON public.order_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_product_id" ON public.order_line_item USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_tax_line_item_id" ON public.order_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_variant_id" ON public.order_line_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_region_id" ON public."order" USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_sales_channel_id" ON public."order" USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_address_id" ON public."order" USING btree (shipping_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_claim_id" ON public.order_shipping USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_deleted_at" ON public.order_shipping USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_shipping_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_exchange_id" ON public.order_shipping USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_item_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_adjustment_shipping_method_id" ON public.order_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_shipping_option_id" ON public.order_shipping_method USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_tax_line_shipping_method_id" ON public.order_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id" ON public.order_shipping USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id_version" ON public.order_shipping USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_return_id" ON public.order_shipping USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_shipping_method_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_summary_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_deleted_at" ON public.order_summary USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_summary_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_order_id_version" ON public.order_summary USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_claim_id" ON public.order_transaction USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_currency_code" ON public.order_transaction USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_exchange_id" ON public.order_transaction USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id" ON public.order_transaction USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id_version" ON public.order_transaction USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_reference_id" ON public.order_transaction USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_return_id" ON public.order_transaction USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_payment_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_deleted_at" ON public.payment_collection USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_collection_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_-4a39f6c9" ON public.cart_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_collection_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_f42b9949" ON public.order_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_deleted_at" ON public.payment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_collection_id" ON public.payment USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_payment_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_session_id" ON public.payment USING btree (payment_session_id);


--
-- Name: IDX_payment_payment_session_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_payment_payment_session_id_unique" ON public.payment USING btree (payment_session_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_deleted_at" ON public.payment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id" ON public.payment USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id_1c934dab0" ON public.region_payment_provider USING btree (payment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_session_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_deleted_at" ON public.payment_session USING btree (deleted_at);


--
-- Name: IDX_payment_session_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_payment_collection_id" ON public.payment_session USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_currency_code" ON public.price USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_deleted_at" ON public.price USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_deleted_at" ON public.price_list USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_id_status_starts_at_ends_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_id_status_starts_at_ends_at" ON public.price_list USING btree (id, status, starts_at, ends_at) WHERE ((deleted_at IS NULL) AND (status = 'active'::text));


--
-- Name: IDX_price_list_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_attribute" ON public.price_list_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_list_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_deleted_at" ON public.price_list_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_price_list_id" ON public.price_list_rule USING btree (price_list_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_value" ON public.price_list_rule USING gin (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_preference_attribute_value" ON public.price_preference USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_preference_deleted_at" ON public.price_preference USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_list_id" ON public.price USING btree (price_list_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_price_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_set_id" ON public.price USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute" ON public.price_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value" ON public.price_rule USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value_price_id" ON public.price_rule USING btree (attribute, value, price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_deleted_at" ON public.price_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator" ON public.price_rule USING btree (operator);


--
-- Name: IDX_price_rule_operator_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator_value" ON public.price_rule USING btree (operator, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_price_id" ON public.price_rule USING btree (price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id_attribute_operator_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_rule_price_id_attribute_operator_unique" ON public.price_rule USING btree (price_id, attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_deleted_at" ON public.price_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_set_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_52b23597" ON public.product_variant_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_ba32fa9c" ON public.shipping_option_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_id_2e4823822; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_id_2e4823822" ON public.product_product_category_categoryimage_category_image USING btree (product_category_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_parent_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_parent_category_id" ON public.product_category USING btree (parent_category_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_path; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_path" ON public.product_category USING btree (mpath) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_deleted_at" ON public.product_collection USING btree (deleted_at);


--
-- Name: IDX_product_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_id" ON public.product USING btree (collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_deleted_at" ON public.product USING btree (deleted_at);


--
-- Name: IDX_product_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_handle_unique" ON public.product USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_17a262437" ON public.product_shipping_profile USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_20b454295" ON public.product_sales_channel USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_29c624132; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_29c624132" ON public.product_product_brand_brand USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank" ON public.image USING btree (rank) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank_product_id" ON public.image USING btree (rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url" ON public.image USING btree (url) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url_rank_product_id" ON public.image USING btree (url, rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_deleted_at" ON public.product_option USING btree (deleted_at);


--
-- Name: IDX_product_option_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_product_id" ON public.product_option USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_deleted_at" ON public.product_option_value USING btree (deleted_at);


--
-- Name: IDX_product_option_value_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_option_id" ON public.product_option_value USING btree (option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_status" ON public.product USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_tag_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_tag_deleted_at" ON public.product_tag USING btree (deleted_at);


--
-- Name: IDX_product_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_deleted_at" ON public.product_type USING btree (deleted_at);


--
-- Name: IDX_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_id" ON public.product USING btree (type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_barcode_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_barcode_unique" ON public.product_variant USING btree (barcode) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_deleted_at" ON public.product_variant USING btree (deleted_at);


--
-- Name: IDX_product_variant_ean_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_ean_unique" ON public.product_variant USING btree (ean) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_id_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_id_product_id" ON public.product_variant USING btree (id, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_id" ON public.product_variant USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_deleted_at" ON public.product_variant_product_image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_image_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_image_id" ON public.product_variant_product_image USING btree (image_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_variant_id" ON public.product_variant_product_image USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_sku_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_sku_unique" ON public.product_variant USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_upc_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_upc_unique" ON public.product_variant USING btree (upc) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_currency_code" ON public.promotion_application_method USING btree (currency_code) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_promotion_application_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_deleted_at" ON public.promotion_application_method USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_promotion_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_application_method_promotion_id_unique" ON public.promotion_application_method USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_campaign_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_campaign_id_unique" ON public.promotion_campaign_budget USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_deleted_at" ON public.promotion_campaign_budget USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u" ON public.promotion_campaign_budget_usage USING btree (attribute_value, budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_budget_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_budget_id" ON public.promotion_campaign_budget_usage USING btree (budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_deleted_at" ON public.promotion_campaign_budget_usage USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_campaign_identifier_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_campaign_identifier_unique" ON public.promotion_campaign USING btree (campaign_identifier) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_deleted_at" ON public.promotion_campaign USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_id" ON public.promotion USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_deleted_at" ON public.promotion USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-71518339" ON public.order_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-a9d4a70b" ON public.cart_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_is_automatic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_is_automatic" ON public.promotion USING btree (is_automatic) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute" ON public.promotion_rule USING btree (attribute);


--
-- Name: IDX_promotion_rule_attribute_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator" ON public.promotion_rule USING btree (attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute_operator_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator_id" ON public.promotion_rule USING btree (operator, attribute, id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_deleted_at" ON public.promotion_rule USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_operator" ON public.promotion_rule USING btree (operator);


--
-- Name: IDX_promotion_rule_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_deleted_at" ON public.promotion_rule_value USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_promotion_rule_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_promotion_rule_id" ON public.promotion_rule_value USING btree (promotion_rule_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_rule_id_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_rule_id_value" ON public.promotion_rule_value USING btree (promotion_rule_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_value" ON public.promotion_rule_value USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_status" ON public.promotion USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_type" ON public.promotion USING btree (type);


--
-- Name: IDX_provider_identity_auth_identity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_auth_identity_id" ON public.provider_identity USING btree (auth_identity_id);


--
-- Name: IDX_provider_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_deleted_at" ON public.provider_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_provider_identity_provider_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_provider_identity_provider_entity_id" ON public.provider_identity USING btree (entity_id, provider);


--
-- Name: IDX_publishable_key_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_publishable_key_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (publishable_key_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_rbac_role_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_rbac_role_id_64ff0c4c" ON public.user_rbac_role USING btree (rbac_role_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_deleted_at" ON public.refund USING btree (deleted_at);


--
-- Name: IDX_refund_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_payment_id" ON public.refund USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_reason_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_reason_deleted_at" ON public.refund_reason USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_refund_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_refund_reason_id" ON public.refund USING btree (refund_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_deleted_at" ON public.region_country USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_region_id" ON public.region_country USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id_iso_2_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_region_country_region_id_iso_2_unique" ON public.region_country USING btree (region_id, iso_2);


--
-- Name: IDX_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_deleted_at" ON public.region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_region_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_id_1c934dab0" ON public.region_payment_provider USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_deleted_at" ON public.reservation_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_reservation_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_inventory_item_id" ON public.reservation_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_line_item_id" ON public.reservation_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_location_id" ON public.reservation_item USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_claim_id" ON public.return USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_display_id" ON public.return USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_exchange_id" ON public.return USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_id_-31ea43a" ON public.return_fulfillment USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_deleted_at" ON public.return_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_item_id" ON public.return_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_reason_id" ON public.return_item USING btree (reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_return_id" ON public.return_item USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_order_id" ON public.return USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_parent_return_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_parent_return_reason_id" ON public.return_reason USING btree (parent_return_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_value" ON public.return_reason USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_deleted_at" ON public.sales_channel USING btree (deleted_at);


--
-- Name: IDX_sales_channel_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_20b454295" ON public.product_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_26d06f470" ON public.sales_channel_stock_location USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_deleted_at" ON public.service_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_service_zone_fulfillment_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_fulfillment_set_id" ON public.service_zone USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_service_zone_name_unique" ON public.service_zone USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_method_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_adjustment_promotion_id" ON public.cart_shipping_method_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_shipping_method_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_option_id" ON public.cart_shipping_method USING btree (shipping_option_id) WHERE ((deleted_at IS NULL) AND (shipping_option_id IS NOT NULL));


--
-- Name: IDX_shipping_method_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_tax_line_tax_rate_id" ON public.cart_shipping_method_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_shipping_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_deleted_at" ON public.shipping_option USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_id_ba32fa9c" ON public.shipping_option_price_set USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_provider_id" ON public.shipping_option USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_deleted_at" ON public.shipping_option_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_rule_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_shipping_option_id" ON public.shipping_option_rule USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_service_zone_id" ON public.shipping_option USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_option_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_option_type_id" ON public.shipping_option USING btree (shipping_option_type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_profile_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_profile_id" ON public.shipping_option USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_type_deleted_at" ON public.shipping_option_type USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_deleted_at" ON public.shipping_profile USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_id_17a262437" ON public.product_shipping_profile USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_profile_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_shipping_profile_name_unique" ON public.shipping_profile USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_single_default_region; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_single_default_region" ON public.tax_rate USING btree (tax_region_id) WHERE ((is_default = true) AND (deleted_at IS NULL));


--
-- Name: IDX_stock_location_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_address_deleted_at" ON public.stock_location_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_address_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_stock_location_address_id_unique" ON public.stock_location USING btree (address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_deleted_at" ON public.stock_location USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-1e5992737" ON public.location_fulfillment_provider USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-e88adb96" ON public.location_fulfillment_set USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_26d06f470" ON public.sales_channel_stock_location USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_currency_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_deleted_at" ON public.store_currency USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_currency_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_store_id" ON public.store_currency USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_deleted_at" ON public.store USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_locale_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_deleted_at" ON public.store_locale USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_locale_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_store_id" ON public.store_locale USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tag_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tag_value_unique" ON public.product_tag USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_provider_deleted_at" ON public.tax_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_deleted_at" ON public.tax_rate USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_deleted_at" ON public.tax_rate_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_reference_id" ON public.tax_rate_rule USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_tax_rate_id" ON public.tax_rate_rule USING btree (tax_rate_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_unique_rate_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_rate_rule_unique_rate_reference" ON public.tax_rate_rule USING btree (tax_rate_id, reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_tax_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_tax_region_id" ON public.tax_rate USING btree (tax_region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_deleted_at" ON public.tax_region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_region_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_parent_id" ON public.tax_region USING btree (parent_id);


--
-- Name: IDX_tax_region_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_provider_id" ON public.tax_region USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_unique_country_nullable_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_nullable_province" ON public.tax_region USING btree (country_code) WHERE ((province_code IS NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_tax_region_unique_country_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_province" ON public.tax_region USING btree (country_code, province_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_translation_deleted_at" ON public.translation USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_locale_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_translation_locale_code" ON public.translation USING btree (locale_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_reference_id_locale_code_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_translation_reference_id_locale_code_unique" ON public.translation USING btree (reference_id, locale_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_reference_id_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_translation_reference_id_reference" ON public.translation USING btree (reference_id, reference) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_reference_id_reference_locale_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_translation_reference_id_reference_locale_code" ON public.translation USING btree (reference_id, reference, locale_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_reference_locale_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_translation_reference_locale_code" ON public.translation USING btree (reference, locale_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_settings_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_translation_settings_deleted_at" ON public.translation_settings USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_translation_settings_entity_type_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_translation_settings_entity_type_unique" ON public.translation_settings USING btree (entity_type) WHERE (deleted_at IS NULL);


--
-- Name: IDX_type_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_type_value_unique" ON public.product_type USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_unique_promotion_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_unique_promotion_code" ON public.promotion USING btree (code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_deleted_at" ON public."user" USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_user_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_email_unique" ON public."user" USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_id_64ff0c4c" ON public.user_rbac_role USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_deleted_at" ON public.user_preference USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_user_id" ON public.user_preference USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_preference_user_id_key_unique" ON public.user_preference USING btree (user_id, key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_52b23597" ON public.product_variant_price_set USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_deleted_at" ON public.view_configuration USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_is_system_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_is_system_default" ON public.view_configuration USING btree (entity, is_system_default) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_user_id" ON public.view_configuration USING btree (entity, user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_user_id" ON public.view_configuration USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_deleted_at" ON public.workflow_execution USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_id" ON public.workflow_execution USING btree (id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_retention_time_updated_at_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_retention_time_updated_at_state" ON public.workflow_execution USING btree (retention_time, updated_at, state) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL));


--
-- Name: IDX_workflow_execution_run_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_run_id" ON public.workflow_execution USING btree (run_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state" ON public.workflow_execution USING btree (state) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state_updated_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state_updated_at" ON public.workflow_execution USING btree (state, updated_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_transaction_id" ON public.workflow_execution USING btree (transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_updated_at_retention_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_updated_at_retention_time" ON public.workflow_execution USING btree (updated_at, retention_time) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL) AND ((state)::text = ANY ((ARRAY['done'::character varying, 'failed'::character varying, 'reverted'::character varying])::text[])));


--
-- Name: IDX_workflow_execution_workflow_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id" ON public.workflow_execution USING btree (workflow_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id_transaction_id" ON public.workflow_execution USING btree (workflow_id, transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id_run_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique" ON public.workflow_execution USING btree (workflow_id, transaction_id, run_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_script_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_script_name_unique ON public.script_migrations USING btree (script_name);


--
-- Name: tax_rate_rule FK_tax_rate_rule_tax_rate_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT "FK_tax_rate_rule_tax_rate_id" FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rate(id) ON DELETE CASCADE;


--
-- Name: tax_rate FK_tax_rate_tax_region_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_tax_rate_tax_region_id" FOREIGN KEY (tax_region_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_parent_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_parent_id" FOREIGN KEY (parent_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_provider_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_provider_id" FOREIGN KEY (provider_id) REFERENCES public.tax_provider(id) ON DELETE SET NULL;


--
-- Name: application_method_buy_rules application_method_buy_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_buy_rules application_method_buy_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: capture capture_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item cart_line_item_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method cart_shipping_method_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credit_line credit_line_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE;


--
-- Name: customer_address customer_address_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_group_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_group_id_foreign FOREIGN KEY (customer_group_id) REFERENCES public.customer_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_delivery_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_delivery_address_id_foreign FOREIGN KEY (delivery_address_id) REFERENCES public.fulfillment_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment_item fulfillment_item_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment_label fulfillment_label_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment fulfillment_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: geo_zone geo_zone_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: image image_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_level inventory_level_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.notification_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order order_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_change_action order_change_action_order_change_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_order_change_id_foreign FOREIGN KEY (order_change_id) REFERENCES public.order_change(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_change order_change_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_credit_line order_credit_line_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_adjustment order_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_tax_line order_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item order_line_item_totals_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_totals_id_foreign FOREIGN KEY (totals_id) REFERENCES public.order_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping order_shipping_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_summary order_summary_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_transaction order_transaction_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_col_aa276_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_col_aa276_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_pro_2d555_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_pro_2d555_foreign FOREIGN KEY (payment_provider_id) REFERENCES public.payment_provider(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment payment_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_session payment_session_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_list_rule price_list_rule_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_set_id_foreign FOREIGN KEY (price_set_id) REFERENCES public.price_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_rule price_rule_price_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_price_id_foreign FOREIGN KEY (price_id) REFERENCES public.price(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category product_category_parent_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_parent_category_id_foreign FOREIGN KEY (parent_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_category_id_foreign FOREIGN KEY (product_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_collection_id_foreign FOREIGN KEY (collection_id) REFERENCES public.product_collection(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_option product_option_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_option_value product_option_value_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_option_id_foreign FOREIGN KEY (option_id) REFERENCES public.product_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_tag_id_foreign FOREIGN KEY (product_tag_id) REFERENCES public.product_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_type_id_foreign FOREIGN KEY (type_id) REFERENCES public.product_type(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_variant_option product_variant_option_option_value_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_option_value_id_foreign FOREIGN KEY (option_value_id) REFERENCES public.product_option_value(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_option product_variant_option_variant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_variant_id_foreign FOREIGN KEY (variant_id) REFERENCES public.product_variant(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant product_variant_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_product_image product_variant_product_image_image_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_image_id_foreign FOREIGN KEY (image_id) REFERENCES public.image(id) ON DELETE CASCADE;


--
-- Name: promotion_application_method promotion_application_method_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget promotion_campaign_budget_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_budget_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_budget_id_foreign FOREIGN KEY (budget_id) REFERENCES public.promotion_campaign_budget(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion promotion_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_rule_value promotion_rule_value_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: provider_identity provider_identity_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund refund_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: region_country region_country_region_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_region_id_foreign FOREIGN KEY (region_id) REFERENCES public.region(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reservation_item reservation_item_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: return_reason return_reason_parent_return_reason_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_parent_return_reason_id_foreign FOREIGN KEY (parent_return_reason_id) REFERENCES public.return_reason(id);


--
-- Name: service_zone service_zone_fulfillment_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_fulfillment_set_id_foreign FOREIGN KEY (fulfillment_set_id) REFERENCES public.fulfillment_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: shipping_option_rule shipping_option_rule_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_option_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_option_type_id_foreign FOREIGN KEY (shipping_option_type_id) REFERENCES public.shipping_option_type(id) ON UPDATE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_profile_id_foreign FOREIGN KEY (shipping_profile_id) REFERENCES public.shipping_profile(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_location stock_location_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_address_id_foreign FOREIGN KEY (address_id) REFERENCES public.stock_location_address(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_currency store_currency_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_locale store_locale_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rbYZxYYmZzkyJQecotUsJIRCefRg1yEsv19MicdqpqdyR0nalUojBigOjqhbxiQ

