# Privacy Notes

1. This MVP does not store student personal information.
2. This MVP does not send data to external servers.
3. This MVP does not store API keys.
4. This MVP does not include analytics or telemetry.
5. This MVP uses only local JSON files in `local-data`.
6. Counseling, grades, student records, and report-card drafting must only be added after a separate security design.
7. Widget mode stores only window bounds and display preferences in `local-data/window-state.json`.
8. Inline editing writes only the existing dashboard JSON files through Electron IPC.

Sample data must remain fictional and must not include real students, real grades, counseling notes, or sensitive school records.
