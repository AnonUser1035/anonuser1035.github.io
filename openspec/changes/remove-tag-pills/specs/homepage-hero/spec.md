## ADDED Requirements

### Requirement: No Credential Pills

The homepage hero section SHALL NOT display credential/tag pills below the tagline.

#### Scenario: Hero renders with no chip row

- **WHEN** the homepage hero section renders
- **THEN** no pill-style credential elements appear below the tagline
- **AND** the tagline text itself (including any words that previously also appeared as chip labels) still renders unchanged
