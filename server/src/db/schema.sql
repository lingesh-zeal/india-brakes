-- =====================================================
-- BrakeTech India Database Schema
-- PostgreSQL
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ADMINS
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- EVENT STATUS
-- =====================================================

CREATE TABLE IF NOT EXISTS event_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- =====================================================
-- EVENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status_id INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_event_status
        FOREIGN KEY(status_id)
        REFERENCES event_status(id),
    venue VARCHAR(255),
    organized_by VARCHAR(255),
    event_date TIMESTAMP NOT NULL,
    event_end_date TIMESTAMP,
    registration_url TEXT,
    registration_deadline TIMESTAMP,
    brochure_url TEXT,
    banner_url TEXT,
    workshop_themes TEXT[],
    target_audience TEXT[],
    is_homepage BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- EVENT PHOTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS event_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    event_id UUID NOT NULL
        REFERENCES events(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ENQUIRY TYPES
-- =====================================================
CREATE TABLE IF NOT EXISTS enquiry_types(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- EVENT FEE CATEGORIES
-- =====================================================

CREATE TABLE IF NOT EXISTS event_fee_categories (
    id SERIAL PRIMARY KEY,

    event_id UUID NOT NULL
        REFERENCES events(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    category_name VARCHAR(100) NOT NULL,
    fee NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    display_order INTEGER DEFAULT 1
);

-- =====================================================
-- EVENT REGISTRATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    event_id UUID NOT NULL
        REFERENCES events(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    fee_category_id INTEGER NOT NULL
        REFERENCES event_fee_categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    organization VARCHAR(255),
    department VARCHAR(255),
    designation VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_event_registration_email
        UNIQUE(event_id,email)
);

-- =====================================================
-- EVENT SPEAKERS
-- =====================================================

CREATE TABLE IF NOT EXISTS event_speakers (
    id SERIAL PRIMARY KEY,

    event_id UUID NOT NULL
        REFERENCES events(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    designation VARCHAR(255),
    department VARCHAR(255),
    organization VARCHAR(255),
    profile_image_url TEXT,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- EVENT SPONSORS
-- =====================================================

CREATE TABLE IF NOT EXISTS event_sponsors (
    id SERIAL PRIMARY KEY,
    event_id UUID NOT NULL
        REFERENCES events(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    sponsor_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 1
);

-- =====================================================
-- SPONSOR INQUIRIES
-- =====================================================

CREATE TABLE IF NOT EXISTS sponsor_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    company VARCHAR(255),
    enquiry_type VARCHAR(100) NOT NULL,
    CONSTRAINT fk_sponsor_enquiry_type
    FOREIGN KEY(enquiry_type_id)
    REFERENCES enquiry_types(id),

    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_sponsor_email
ON sponsor_inquiries(email);


CREATE INDEX IF NOT EXISTS idx_sponsor_status
ON sponsor_inquiries(status);


CREATE INDEX IF NOT EXISTS idx_sponsor_enquiry_type
ON sponsor_inquiries(enquiry_type_id);

-- CREATE INDEX IF NOT EXISTS idx_events_slug
-- ON events(slug);

-- CREATE INDEX IF NOT EXISTS idx_events_date
-- ON events(event_date);

-- CREATE INDEX IF NOT EXISTS idx_event_photos_event
-- ON event_photos(event_id);

-- CREATE INDEX IF NOT EXISTS idx_fee_categories_event
-- ON event_fee_categories(event_id);

-- CREATE INDEX IF NOT EXISTS idx_registrations_event
-- ON event_registrations(event_id);

-- CREATE INDEX IF NOT EXISTS idx_registrations_email
-- ON event_registrations(email);

-- CREATE INDEX IF NOT EXISTS idx_speakers_event
-- ON event_speakers(event_id);

-- CREATE INDEX IF NOT EXISTS idx_event_sponsors_event
-- ON event_sponsors(event_id);

-- CREATE INDEX IF NOT EXISTS idx_sponsor_inquiries_email
-- ON sponsor_inquiries(email);

-- CREATE INDEX IF NOT EXISTS idx_sponsor_inquiries_status
-- ON sponsor_inquiries(status);

-- CREATE INDEX IF NOT EXISTS idx_sponsor_inquiries_created
-- ON sponsor_inquiries(created_at);

CREATE TABLE IF NOT EXISTS welcome_sections (

    id SERIAL PRIMARY KEY,
    heading VARCHAR(255) NOT NULL,
    sub_heading VARCHAR(255),
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS welcome_carousel_images (

    id SERIAL PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    alt_tag VARCHAR(255) NOT NULL,
    display_order SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_display_order
    CHECK(display_order BETWEEN 1 AND 6)

);