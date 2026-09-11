# System settings and desktop releases

Open Settings from the sidebar. All eight categories are visible to signed-in users; only a user with the Super Administrator role can save system policies or create/list database backups. Doctor specialization management retains the existing healthcare permission checks. Access management links use the existing role/user pages.

## Runtime behavior

- Meetings: camera constraints and sender bitrate, audio capture constraints and bitrate, screen capture presets, join camera/microphone defaults, and server-side participant limits. Media changes take effect when joining or restarting media. Auto uses WebRTC adaptation under the selected cap. Browser/device support can affect media constraints; peer-to-peer meetings still need enough bandwidth per participant.
- Organization: logo and name appear in the dashboard; branches and contact details are maintained in the shared organization configuration.
- HR: work times default new employee records; weekend records are exempt from lost-time calculations; the grace period reduces device-derived lateness. Existing employee schedules are preserved. Leave types populate attendance permission forms.
- Healthcare: specializations remain CRUD, operating rooms populate surgery appointment forms, default appointment duration is applied on creation, and public bookings are validated against configured hours/days in the system timezone. Existing operating room names were imported in the development database.
- Finance: currency defaults new invoices, enabled methods control billing payment selection and validation, and invoice prefix/sequence is allocated in a database transaction. A duplicate invoice number is rejected without advancing the sequence.
- Notifications: task alerts and meeting/appointment reminders are filtered by policy. A one-minute worker creates one reminder per appointment time/doctor or active meeting/user. Appointment reminders go to the linked doctor's user account. Meeting reminders go to department employees who have not joined. Desktop alerts can be disabled separately.
- Security: configured session lifetime applies to new logins. Roles stay enforced regardless of password-confirmation preference. Attendance permission deletion ALWAYS requires the superadmin password; other protected attendance deletion dialogs follow the preference.
- System: date picker display uses the configured date format; public booking policy uses the timezone. Language is a default for users without a personal language selection. The integrations link opens existing attendance device management.

## Backups

`mysqldump` must be available on the backend host with suitable database privileges. Backups are database-only SQL files, mode 0600, in `Backend/backups` (ignored by Git), or the operator-configured `NHO_BACKUP_DIRECTORY`. Uploaded files are separate. Scheduled backups are disabled initially. Enabling scheduling checks every minute and applies the configured interval/retention; manual creation also applies retention after a successful backup. Failed partial files are removed. Restore is an operator action and is not exposed as a destructive UI button.

For another existing database apply `Backend/scripts/sql/system-settings.sql` and `settings-reminders-leave.sql`, then run `npm run db:generate` in Backend before restarting it. Also import any existing nonempty surgery operatingRoom values into the healthcare category before managing old appointments. New empty databases use the Prisma schema through normal setup.

## Electron release source

The updater is built, but a real release source must be supplied before downloads can work. Configure one source at BUILD time; renderer input cannot choose a source.

HTTPS hosting:

```bash
NHO_UPDATE_URL=https://your-host.example/nho/releases/ npm run electron:build:windows
NHO_UPDATE_URL=https://your-host.example/nho/releases/ npm run electron:build:linux
```

Or public GitHub Releases:

```bash
NHO_UPDATE_GITHUB=your-owner/your-repository npm run electron:build:windows
```

Increment the version in `Frontend/package.json` for each release. Build for the supported target/platform and publish the generated installers/AppImage and blockmap files, followed by `latest.yml` / `latest-linux.yml`. Configure signing credentials in your release environment; do not put private keys or GitHub tokens in renderer code or committed files. Private release authentication requires a separate trusted distribution design.

The current targets are Windows NSIS and Linux AppImage/DEB. Platform installation can require OS permission. Users on an old build without the updater need one manually installed release containing this updater first. Desktop releases do not deploy the backend or apply database migrations.

Automatic checking runs 15 seconds after launch and every four hours when enabled. Download is explicit; install-on-quit is disabled. Restart/install requires a native confirmation and is blocked during an active meeting. Development/browser builds show a clear unavailable message. Builds without a release source also show a configuration message instead of attempting updates.

## Verification

Backend tests and settings API permission/validation checks, frontend production build, updater state/security tests, and a real local database backup were exercised. Update download/install across two published signed releases and real multi-device audio/video calls require release hosting and device testing.

References: [electron-builder auto-update](https://www.electron.build/docs/features/auto-update/), [WebRTC sender parameters](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/setParameters).
