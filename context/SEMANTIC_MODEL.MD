# Semantic Model Specification

Lumio introduces a data-driven, highly extensible semantic metadata layer that separates architectural identity and structural relationships from pure visual representation (colors, styling, positions). This layer enables advanced semantic reasoning, project validation, and automated export without coupling external cloud or AI providers into the core canvas architecture.

## Core Domain Model

### 1. Nodes Layer
Each node contains a `semantic` definition under its custom data block (`NodeData`):
- **Category (`SemanticCategory`)**: Architectural categorization such as `user`, `client`, `service`, `api`, `database`, `cache`, `queue`, `storage`, `cloud_resource`, `device`, `external_system`, or `generic`.
- **Metadata (`SemanticMetadata`)**: Extensible structured details including:
  - `technology`: The technology name (e.g., `postgresql`, `redis`, `react`, or any custom user-provided string).
  - `version`: Software version identifier.
  - `environment`: Deployment tier (`development`, `staging`, `production`, `infrastructure`).
  - `tags`: Arbitrary string list for categorization and querying.

### 2. Edges Layer
Each connection contains a `semantic` descriptor mapping the architectural relationship under `EdgeData`:
- **Relationship Type (`EdgeRelationshipType`)**: Nature of connection including `depends_on`, `calls`, `reads_from`, `writes_to`, `publishes_to`, `consumes_from`, `connects_to`, `contains`, or `generic`.
- **Metadata (`EdgeMetadata`)**: Custom descriptor containing details such as `description`, `protocol` (e.g., `gRPC`, `REST`, `AMQP`), and `dataFlow` direction (`unidirectional` or `bidirectional`).

### 3. Project Level Metadata
The schema includes high-level document attributes (`ProjectMetadata`) mapping the total document state:
- `description`: Overview description of the diagram.
- `tags`: Global keywords.
- `semanticVersion`: The version of the schema structure (`1.2`).
- `createdWith`: Application source info.

## Data Integration & Compatibility
- **Migration & Backfill**: Legacy files (v1.0 or v1.1) are backfilled seamlessly upon initialization using `migrateProject` to ensure full backward compatibility. Existing visual characteristics and configurations remain exactly preserved.
- **Validation**: Project architecture integrity is verified via `validateProject()`, returning structured arrays of validation issues (`MISSING_SEMANTIC_TYPE`, `MISSING_TECHNOLOGY`, `INVALID_RELATIONSHIP`, `DANGLING_TARGET`, etc.) without enforcing brittle constraints.
