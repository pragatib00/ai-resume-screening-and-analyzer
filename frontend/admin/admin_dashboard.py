import streamlit as st
import pandas as pd
import io

from api import (
    get_platform_stats,
    get_all_users,
    update_user_role,
    update_user_status,
    delete_user,
    get_all_jobs,
    delete_job_admin,
    get_error_logs,
    get_analytics
)


def show():

    st.title("Admin Dashboard")

    st.success(
        f"Welcome, {st.session_state.user['name']}"
    )

    token = st.session_state.token

    # ---------------------------------
    # Load Platform Stats
    # ---------------------------------

    stats_response = get_platform_stats(token)

    if stats_response.status_code != 200:

        st.error("Unable to load platform stats.")

        return

    stats = stats_response.json()

    # ---------------------------------
    # Dashboard Cards
    # ---------------------------------

    c1, c2, c3, c4, c5 = st.columns(5)

    with c1:
        st.metric(
            "Candidates",
            stats["total_candidates"]
        )

    with c2:
        st.metric(
            "Recruiters",
            stats["total_recruiters"]
        )

    with c3:
        st.metric(
            "Jobs",
            stats["total_jobs"]
        )

    with c4:
        st.metric(
            "Applications",
            stats["total_applications"]
        )

    with c5:
        st.metric(
            "Avg AI Score",
            f"{stats['average_match_score']}%"
        )

    st.download_button(
        "⬇Export Stats as CSV",
        data=pd.DataFrame([stats]).to_csv(index=False),
        file_name="platform_stats.csv",
        mime="text/csv"
    )

    st.divider()

    # ---------------------------------
    # Fetch users once, reused below
    # ---------------------------------

    users_response = get_all_users(token)

    if users_response.status_code != 200:

        st.error("Unable to load users.")

        return

    users = users_response.json()

    # ---------------------------------
    # Pending Approvals
    # ---------------------------------

    pending_users = [u for u in users if u["status"] == "pending"]

    if pending_users:

        st.subheader(f"Pending Approvals ({len(pending_users)})")

        for u in pending_users:

            with st.container(border=True):

                col1, col2, col3 = st.columns([3, 3, 2])

                with col1:
                    st.write(f"**{u['name']}**")
                    st.caption(u["email"])

                with col2:
                    st.caption(f"Wants to register as: `{u['role']}`")

                with col3:

                    if st.button(
                        "Approve",
                        key=f"approve_{u['id']}"
                    ):

                        r = update_user_status(
                            u["id"],
                            "active",
                            token
                        )

                        if r.status_code == 200:
                            st.success("Approved.")
                            st.rerun()
                        else:
                            st.error("Failed to approve.")

        st.divider()

    # ---------------------------------
    # User Management
    # ---------------------------------

    st.subheader("User Management")

    st.download_button(
        "Export Users as CSV",
        data=pd.DataFrame(users).to_csv(index=False),
        file_name="users.csv",
        mime="text/csv",
        key="export_users_csv"
    )

    search = st.text_input(
        "Search by name or email",
        key="admin_user_search"
    )

    role_filter = st.selectbox(
        "Filter by role",
        ["All", "candidate", "recruiter", "admin"],
        key="admin_role_filter"
    )

    filtered_users = []

    for u in users:

        if search:

            text = (u["name"] + u["email"]).lower()

            if search.lower() not in text:
                continue

        if role_filter != "All" and u["role"] != role_filter:
            continue

        filtered_users.append(u)

    if len(filtered_users) == 0:

        st.info("No users match your filters.")

    else:

        for u in filtered_users:

            with st.container(border=True):

                col1, col2, col3, col4, col5 = st.columns(
                    [3, 2, 2, 2, 2]
                )

                with col1:

                    st.write(f"**{u['name']}**")

                    st.caption(u["email"])

                with col2:

                    st.write(f"Role: `{u['role']}`")

                    if u["status"] == "active":
                        st.caption("Active")
                    elif u["status"] == "suspended":
                        st.caption("Suspended")
                    else:
                        st.caption("Pending")

                with col3:

                    if u["role"] != "admin":

                        new_role = st.selectbox(
                            "Change role",
                            ["candidate", "recruiter"],
                            index=["candidate", "recruiter"].index(
                                u["role"]
                            ) if u["role"] in ["candidate", "recruiter"] else 0,
                            key=f"role_select_{u['id']}",
                            label_visibility="collapsed"
                        )

                        if new_role != u["role"]:

                            if st.button(
                                "Update Role",
                                key=f"update_role_{u['id']}"
                            ):

                                r = update_user_role(
                                    u["id"],
                                    new_role,
                                    token
                                )

                                if r.status_code == 200:
                                    st.success("Role updated.")
                                    st.rerun()
                                else:
                                    st.error("Failed to update role.")

                    else:

                        st.caption("Admin accounts can't be modified here.")

                with col4:

                    if u["role"] != "admin":

                        if u["status"] == "suspended":

                            if st.button(
                                " Reactivate",
                                key=f"reactivate_{u['id']}"
                            ):

                                r = update_user_status(
                                    u["id"],
                                    "active",
                                    token
                                )

                                if r.status_code == 200:
                                    st.success("Reactivated.")
                                    st.rerun()
                                else:
                                    st.error("Failed to reactivate.")

                        else:

                            if st.button(
                                " Suspend",
                                key=f"suspend_{u['id']}"
                            ):

                                r = update_user_status(
                                    u["id"],
                                    "suspended",
                                    token
                                )

                                if r.status_code == 200:
                                    st.success("Suspended.")
                                    st.rerun()
                                else:
                                    st.error("Failed to suspend.")

                with col5:

                    if u["id"] == st.session_state.user["id"]:

                        st.caption("This is you")

                    elif u["role"] == "admin":

                        st.caption("—")

                    else:

                        if st.button(
                            " Delete",
                            key=f"delete_user_{u['id']}"
                        ):

                            r = delete_user(
                                u["id"],
                                token
                            )

                            if r.status_code == 200:
                                st.success("User deleted.")
                                st.rerun()
                            else:
                                st.error("Failed to delete user.")

    st.divider()

    # ---------------------------------
    # Job Oversight
    # ---------------------------------

    st.subheader(" Job Oversight")

    jobs_response = get_all_jobs(token)

    if jobs_response.status_code != 200:

        st.error("Unable to load jobs.")

        return

    jobs = jobs_response.json()

    if jobs:

        st.download_button(
            "⬇ Export Jobs as CSV",
            data=pd.DataFrame(jobs).to_csv(index=False),
            file_name="jobs.csv",
            mime="text/csv",
            key="export_jobs_csv"
        )

    if len(jobs) == 0:

        st.info("No jobs posted on the platform yet.")

    else:

        for job in jobs:

            with st.container(border=True):

                col1, col2 = st.columns([5, 1])

                with col1:

                    st.write(f"**{job['title']}**")

                    st.caption(
                        f" {job['company']}  |  {job['location']}"
                    )

                    st.caption(
                        f"Posted by user ID: {job['posted_by']}"
                    )

                with col2:

                    if st.button(
                        "🗑 Remove",
                        key=f"admin_delete_job_{job['id']}"
                    ):

                        r = delete_job_admin(
                            job["id"],
                            token
                        )

                        if r.status_code == 200:
                            st.success("Job removed.")
                            st.rerun()
                        else:
                            st.error("Failed to remove job.")

    st.divider()

    # ---------------------------------
    # Candidate Analytics
    # ---------------------------------

    st.subheader(" Resume Analyzer Insights")

    analytics_response = get_analytics(token)

    if analytics_response.status_code != 200:

        st.error("Unable to load analytics.")

    else:

        analytics = analytics_response.json()

        a1, a2 = st.columns(2)

        with a1:
            st.metric(
                " Resumes Analyzed",
                analytics["total_analyses"]
            )

        with a2:
            st.metric(
                " Average ATS Score",
                f"{analytics['average_ats_score']}%"
            )

        if analytics["top_missing_skills"]:

            st.write("**Most Commonly Missing Skills**")

            df = pd.DataFrame(analytics["top_missing_skills"])

            st.bar_chart(
                df.set_index("skill")["count"]
            )

        else:

            st.info("Not enough data yet to show trends.")

    st.divider()

    # ---------------------------------
    # System Health
    # ---------------------------------

    st.subheader("System Health — Extraction Failures")

    logs_response = get_error_logs(token, limit=50)

    if logs_response.status_code != 200:

        st.error("Unable to load error logs.")

    else:

        logs = logs_response.json()

        if not logs:

            st.success("No extraction failures logged. 🎉")

        else:

            st.warning(
                f"{len(logs)} recent extraction failure(s) — showing most recent first."
            )

            for log in logs:

                with st.container(border=True):

                    st.caption(
                        f"{log['created_at']}  |  Source: `{log['source']}`"
                    )

                    st.code(log["message"], language=None)