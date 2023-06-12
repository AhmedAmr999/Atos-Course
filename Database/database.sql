CREATE TABLE examDefinition (
    examDefinition_id SERIAL PRIMARY KEY,
    examDefinition_name VARCHAR(255) NOT NULL,
    passing_score DECIMAL(5, 2) NOT NULL,
    questions_ids VARCHAR(400)[]
);

CREATE TYPE exam_status AS ENUM ('absent','taken');

CREATE TABLE examInstance(
    examInstance_id SERIAL PRIMARY KEY,
    examDefinition_id INTEGER REFERENCES examDefinition_id(id),
    examName VARCHAR(300),
    startedtime TIMESTAMPTZ DEFAULT NULL,
    endTime TIMESTAMPTZ DEFAULT NULL,
    completionTime TIMESTAMPTZ,
    createdBy VARCHAR(400),
    takenBy_ids VARCHAR(400)[],
    status exam_status NOT NULL,
    questions JSONB[]
);

ALTER TABLE examInstance
ADD COLUMN generated_link VARCHAR(500);

ALTER TABLE examInstance
ALTER COLUMN generated_link TYPE VARCHAR(500);

ALTER TABLE examInstance DROP COLUMN examName;

ALTER TABLE examInstance
ADD COLUMN studentScore INTEGER DEFAULT 0,
ADD COLUMN studentGrade exam_grade_enum DEFAULT 'Fail';

CREATE TYPE exam_grade_enum AS ENUM ('Pass', 'Fail');

ALTER TABLE examInstance
ALTER COLUMN studentGrade TYPE exam_grade_enum
    USING (studentGrade::exam_grade_enum);

ALTER TABLE examInstance
ALTER COLUMN studentGrade SET DEFAULT 'Fail';

