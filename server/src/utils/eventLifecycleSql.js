export const lifecycleCase = `
CASE
    WHEN e.archived = TRUE THEN 'Archived'

    WHEN s.name = 'Draft' THEN 'Draft'

    WHEN e.registration_deadline IS NOT NULL
         AND NOW() <= e.registration_deadline
        THEN 'Registration Open'

    WHEN e.registration_deadline IS NOT NULL
         AND e.event_date IS NOT NULL
         AND NOW() > e.registration_deadline
         AND NOW() < e.event_date
        THEN 'Registration Closed'

    WHEN e.event_date IS NOT NULL
         AND NOW() >= e.event_date
         AND NOW() <= COALESCE(e.event_end_date, e.event_date)
        THEN 'Ongoing'

    WHEN COALESCE(e.event_end_date, e.event_date) < NOW()
        THEN 'Completed'

    ELSE 'Upcoming'
END
`;