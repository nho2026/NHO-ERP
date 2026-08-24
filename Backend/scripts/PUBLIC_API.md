# Public website API

Base URL: `http://localhost:4000/api/public`

No login or authentication cookie is required for these endpoints.

## Departments

`GET /departments`

Returns active departments with `id`, `code`, `name`, and `description`.

## Doctors

`GET /doctors`

Optional filter: `GET /doctors?departmentId=DEPARTMENT_ID`

Only active doctors with **Public booking** enabled are returned.

## Request an appointment

`POST /appointments`

```json
{
  "patientName": "Patient name",
  "patientPhone": "+964...",
  "patientEmail": "patient@example.com",
  "departmentId": "DEPARTMENT_ID",
  "doctorId": "DOCTOR_ID",
  "scheduledAt": "2026-08-25T09:30:00+03:00",
  "reason": "Consultation"
}
```

Successful requests return HTTP `201` with the appointment ID and `pending` status. Duplicate doctor/time bookings return HTTP `409`.

For production, set the comma-separated website origins:

```env
PUBLIC_WEBSITE_URLS="https://example.com,https://www.example.com"
```
