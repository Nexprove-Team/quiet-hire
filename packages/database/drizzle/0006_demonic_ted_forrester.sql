CREATE INDEX "jobs_search_idx" ON "jobs" USING gin ((
      setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
      setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
      setweight(to_tsvector('english', coalesce("skills"::text, '')), 'C') ||
      setweight(to_tsvector('english', coalesce("requirements"::text, '')), 'C')
    ));