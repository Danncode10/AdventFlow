# 🔐 Authentication & Onboarding Flow

AdventFlow uses a **Scoped Onboarding** model. Users are not just "Users"; they are members of a specific Church hierarchy with tiered permissions.

## 🚀 The Signup Journey

### 1. Account Creation (The Front Gate)
- **Method**: Email/Password or Social Login (Google).
- **Result**: Basic record in `auth.users` and an empty `profiles` record (via trigger).
- **Session**: User is authenticated but in a "Restricted" state.

### 2. Information & Placement (The Membership Form)
Users must provide their location to access data (each Mission has its own database instance):
- **Personal Info**: Full Name, Phone, and DPA (Data Privacy Act) Consent.
- **Ecclesiastical Placement**: 
    1.  **Mission**: Auto-detected/Fixed (e.g., Northern Luzon Mission).
    2.  **Area**: Dropdown (e.g., Area 1).
    3.  **Division**: Dropdown (Filtered by Area).
    4.  **Church**: Dropdown (Filtered by Division).
- **Linking**: The profile's `structure_id` is linked to the lowest confirmed level (usually the Church).

### 3. Role Selection & Baseline Identity
- **Instant Identity**: Every user is automatically granted the `MEMBER` role.
- **Requested Roles**: Users can select additional roles (e.g., Treasurer, Media Team). 
- **User Feedback**: Upon selection, the UI will display a **"Verification Required"** indicator for each role, informing the user that the request is pending and can be approved or rejected by the authorized administrator.

---

## 🏛️ Tiered Approval Logic (Chain of Command)

To prevent security breaches, roles must be verified by a leader from the higher level or equivalent authorized tier.

| Requested Role | Higher Authority Approver | Level of Approval |
| :--- | :--- | :--- |
| **Member** | *Automatic* | - |
| **Media Team** | Elder / Local Admin | Local Church |
| **Treasurer / Clerk** | Elder / Local Board | Local Church |
| **Scheduler** | Elder / Local Board | Local Church |
| **Church Elder** | Area Pastor | Local Division |
| **Division Leader** | Area Pastor | Local Division |
| **Area Coordinator** | Mission President / Admin | Regional Area |
| **Pastor** | Mission Admin / Secretariat | Mission HQ |
| **Mission Admin** | System Admin | Mission HQ |
| **System Admin** | Existing System Admin | Mission HQ |

### Approval Statuses
- **VERIFIED**: Full access to toolsets (Financials, Media, Management).
- **PENDING**: Visible in the dashboard but functions are grayed out or restricted.
- **DENIED**: Role request removed; user remains as a basic `MEMBER`.

---

## 🛡️ Data Privacy (RA 10173)
Before a profile is fully created, the user **MUST** agree to the ecclesiastical data collection terms. 
- Consent is logged in the `profiles.metadata`.
- Users can revoke consent, which triggers a "soft-deletion" or anonymization of their profile.
