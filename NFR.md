6. NON-FUNCTIONAL REQUIREMENTS (NFR)
________________________________________
6.1 Performance
NFR1: App must open in < 2 seconds
NFR2: Dashboard loads < 1 second with cached data
NFR3: Search results load < 500 ms
NFR4: Barcode scan result < 800 ms
________________________________________
6.2 Security
NFR5: Use HTTPS for all API calls
NFR6: Store token in EncryptedSharedPreferences
NFR7: Password hashing: bcrypt/argon2
NFR8: Sanitize all user fields
NFR9: Secure local caching to avoid data leakage
________________________________________
6.3 Usability
NFR10: UI must follow Material Design
NFR11: Simple 4-tab layout
NFR12: Minimal clicks to reach main content
________________________________________
6.4 Compatibility
NFR13: Support Android 6.0+
NFR14: Optimize for screens 5–7 inches
________________________________________
6.5 Reliability
NFR15: Auto-retry API calls when network fails
NFR16: App must not crash due to invalid server data
NFR17: Background workers must complete gracefully
________________________________________
6.6 Maintainability
NFR18: MVVM architecture mandatory
NFR19: Clean code with proper layers:
•	UI
•	ViewModel
•	Repository
•	Retrofit API service
•	Local DB
NFR20: Well-documented code and API responses
________________________________________
6.7 Scalability
NFR21: Handle thousands of books
NFR22: Handle massive student data
NFR23: Server load must not impact UI responsiveness
________________________________________
6.8 Battery Optimization
NFR24: Background sync max 2× per day
NFR25: Limited location & sensor usage
________________________________________
6.9 Data Backup
NFR26: Cached data retained even after app restart
NFR27: If user reinstalls app → new fresh login
(mandatory for security)
________________________________________
6.10 Accessibility
NFR28: Text-to-speech support for visually impaired users
NFR29: Voice commands for hearing-impaired users
________________________________________
6.11 Localization
NFR30: Support English, Spanish, French, German, Italian, Chinese, Japanese, Korean languages.
________________________________________
6.12 Privacy
NFR31: Do not collect any personal information from the user.
NFR32: Do not store any personal information on the device or server.
NFR33: Do not share any personal information with third parties without explicit consent from the user.
________________________________________